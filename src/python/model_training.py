"""
InternMatch AI - Model Training Pipeline
Trains 8 ML models for demand prediction
"""

import pandas as pd
import numpy as np
import json
import os
import pickle
import warnings
from datetime import datetime

warnings.filterwarnings('ignore')


class ModelTrainer:
    """Train and evaluate ML models."""

    def __init__(self, output_dir='model_output'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.models = {}
        self.results = {}
        self.report = {'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

    def load_data(self, prep_dir='preprocessing_output'):
        print("\n  Loading data...")
        try:
            self.X_train = pd.read_csv(os.path.join(prep_dir, 'X_train.csv'))
            self.X_test = pd.read_csv(os.path.join(prep_dir, 'X_test.csv'))
            self.y_train_reg = pd.read_csv(os.path.join(prep_dir, 'y_train_reg.csv')).iloc[:, 0]
            self.y_test_reg = pd.read_csv(os.path.join(prep_dir, 'y_test_reg.csv')).iloc[:, 0]
            self.y_train_cls = pd.read_csv(os.path.join(prep_dir, 'y_train_cls.csv')).iloc[:, 0]
            self.y_test_cls = pd.read_csv(os.path.join(prep_dir, 'y_test_cls.csv')).iloc[:, 0]
            print(f"  Loaded: X_train={self.X_train.shape}, X_test={self.X_test.shape}")
            return True
        except FileNotFoundError:
            print("  No preprocessed data. Generating fresh...")
            return self._make_data()

    def _make_data(self):
        from sklearn.model_selection import train_test_split
        try:
            from internship_data import generate_internships
            data = generate_internships(20000)
            df = pd.DataFrame(data)
        except ImportError:
            np.random.seed(42)
            n = 5000
            df = pd.DataFrame({
                'stipend': np.random.choice([10000, 20000, 30000, 50000], n),
                'applications': np.random.randint(50, 2500, n),
                'rating': np.round(np.random.uniform(3.5, 5.0, n), 1),
                'openings': np.random.randint(1, 20, n),
                'demand_score': np.round(np.random.uniform(10, 95, n), 1),
                'growth_trend': np.round(np.random.uniform(-5, 35, n), 1),
            })
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        target = 'demand_score' if 'demand_score' in num_cols else num_cols[-1]
        features = [c for c in num_cols if c not in ['id', target]]
        X = df[features].fillna(0)
        y_reg = df[target].fillna(50)
        y_cls = pd.cut(y_reg, bins=[0, 25, 50, 75, 100],
                       labels=['Low', 'Medium', 'High', 'Very High'],
                       include_lowest=True).astype(str)
        self.X_train, self.X_test, self.y_train_reg, self.y_test_reg = \
            train_test_split(X, y_reg, test_size=0.2, random_state=42)
        _, _, self.y_train_cls, self.y_test_cls = \
            train_test_split(X, y_cls, test_size=0.2, random_state=42)
        print(f"  Generated: X_train={self.X_train.shape}")
        return True

    def train_regressors(self):
        from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
        from sklearn.svm import SVR
        from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

        print("\n" + "=" * 60)
        print("  TRAINING REGRESSION MODELS")
        print("=" * 60)

        models = {
            'RF_Regressor': RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1),
            'GB_Regressor': GradientBoostingRegressor(n_estimators=100, max_depth=6, random_state=42),
            'SVR_Regressor': SVR(kernel='rbf', C=100, epsilon=0.1),
        }
        try:
            from xgboost import XGBRegressor
            models['XGB_Regressor'] = XGBRegressor(n_estimators=100, max_depth=6, random_state=42, verbosity=0)
        except ImportError:
            print("  XGBoost not installed, skipping")

        for name, model in models.items():
            print(f"\n  Training {name}...")
            try:
                model.fit(self.X_train, self.y_train_reg)
                pred = model.predict(self.X_test)
                mae = mean_absolute_error(self.y_test_reg, pred)
                rmse = np.sqrt(mean_squared_error(self.y_test_reg, pred))
                r2 = r2_score(self.y_test_reg, pred)
                self.models[name] = model
                self.results[name] = {'type': 'regression', 'MAE': round(mae, 4),
                                       'RMSE': round(rmse, 4), 'R2': round(r2, 4)}
                print(f"    MAE={mae:.4f} RMSE={rmse:.4f} R2={r2:.4f}")
                with open(os.path.join(self.output_dir, f'{name}.pkl'), 'wb') as f:
                    pickle.dump(model, f)
            except Exception as e:
                print(f"    Error: {e}")
                self.results[name] = {'type': 'regression', 'error': str(e)}

    def train_classifiers(self):
        from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
        from sklearn.linear_model import LogisticRegression
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

        print("\n" + "=" * 60)
        print("  TRAINING CLASSIFICATION MODELS")
        print("=" * 60)

        models = {
            'RF_Classifier': RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1),
            'GB_Classifier': GradientBoostingClassifier(n_estimators=100, max_depth=6, random_state=42),
            'LR_Classifier': LogisticRegression(max_iter=1000, random_state=42),
        }
        try:
            from xgboost import XGBClassifier
            models['XGB_Classifier'] = XGBClassifier(n_estimators=100, max_depth=6, random_state=42,
                                                      verbosity=0, eval_metric='mlogloss')
        except ImportError:
            pass

        for name, model in models.items():
            print(f"\n  Training {name}...")
            try:
                model.fit(self.X_train, self.y_train_cls)
                pred = model.predict(self.X_test)
                acc = accuracy_score(self.y_test_cls, pred)
                prec = precision_score(self.y_test_cls, pred, average='weighted', zero_division=0)
                rec = recall_score(self.y_test_cls, pred, average='weighted', zero_division=0)
                f1 = f1_score(self.y_test_cls, pred, average='weighted', zero_division=0)
                self.models[name] = model
                self.results[name] = {'type': 'classification', 'Accuracy': round(acc, 4),
                                       'Precision': round(prec, 4), 'Recall': round(rec, 4),
                                       'F1': round(f1, 4)}
                print(f"    Acc={acc:.4f} Prec={prec:.4f} Rec={rec:.4f} F1={f1:.4f}")
                with open(os.path.join(self.output_dir, f'{name}.pkl'), 'wb') as f:
                    pickle.dump(model, f)
            except Exception as e:
                print(f"    Error: {e}")
                self.results[name] = {'type': 'classification', 'error': str(e)}

    def select_best(self):
        print("\n" + "=" * 60)
        print("  BEST MODEL SELECTION")
        print("=" * 60)
        reg = {k: v for k, v in self.results.items() if v.get('type') == 'regression' and 'R2' in v}
        if reg:
            best = max(reg, key=lambda k: reg[k]['R2'])
            print(f"  Best Regressor: {best} (R2={reg[best]['R2']})")
            if best in self.models:
                with open(os.path.join(self.output_dir, 'best_regressor.pkl'), 'wb') as f:
                    pickle.dump(self.models[best], f)
        cls = {k: v for k, v in self.results.items() if v.get('type') == 'classification' and 'Accuracy' in v}
        if cls:
            best = max(cls, key=lambda k: cls[k]['Accuracy'])
            print(f"  Best Classifier: {best} (Acc={cls[best]['Accuracy']})")
            if best in self.models:
                with open(os.path.join(self.output_dir, 'best_classifier.pkl'), 'wb') as f:
                    pickle.dump(self.models[best], f)

    def save_report(self):
        print(f"\n  {'Model':<25} {'Type':<15} {'Score':<10}")
        print(f"  {'-'*50}")
        for name, r in sorted(self.results.items()):
            if 'error' in r:
                continue
            score = r.get('R2', r.get('Accuracy', 0))
            print(f"  {name:<25} {r['type']:<15} {score:<10.4f}")
        self.report['results'] = self.results
        with open(os.path.join(self.output_dir, 'training_report.json'), 'w') as f:
            json.dump(self.report, f, indent=2, default=str)
        pd.DataFrame(self.results).T.to_csv(os.path.join(self.output_dir, 'model_comparison.csv'))
        # Feature importance
        imp_data = []
        for name, model in self.models.items():
            if hasattr(model, 'feature_importances_'):
                for i, val in enumerate(model.feature_importances_):
                    if i < len(self.X_train.columns):
                        imp_data.append({'model': name, 'feature': self.X_train.columns[i],
                                         'importance': round(val, 6)})
        if imp_data:
            pd.DataFrame(imp_data).to_csv(os.path.join(self.output_dir, 'feature_importance.csv'), index=False)
        print(f"\n  Reports saved to {self.output_dir}/")

    def run_all(self):
        print("\n" + "=" * 60)
        print("  MODEL TRAINING PIPELINE")
        print("=" * 60)
        if not self.load_data():
            return
        self.train_regressors()
        self.train_classifiers()
        self.select_best()
        self.save_report()
        print(f"\n  COMPLETE! {len(self.models)} models trained")


if __name__ == '__main__':
    trainer = ModelTrainer()
    trainer.run_all()