"""
InternMatch AI - Data Preprocessing Pipeline
14-Phase preprocessing for 20,000 internship listings
Skills are comma-separated strings - NO list columns
"""

import pandas as pd
import numpy as np
import json
import os
import pickle
import warnings
from datetime import datetime

warnings.filterwarnings('ignore')


class InternshipPreprocessor:
    """Complete 14-phase data preprocessing pipeline."""

    def __init__(self, output_dir='preprocessing_output'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.report = {'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'phases': {}}
        self.label_encoders = {}
        self.scaler = None
        self.feature_names = []
        self.df = None
        self.original_shape = None

    def _log(self, num, name, details):
        self.report['phases'][f'phase_{num}'] = {'name': name, 'details': details}
        print(f"\n{'='*60}")
        print(f"  PHASE {num}: {name}")
        print(f"{'='*60}")
        for k, v in details.items():
            if isinstance(v, dict):
                print(f"  {k}:")
                for kk, vv in list(v.items())[:15]:
                    print(f"    {kk}: {vv}")
            elif isinstance(v, list) and len(v) > 10:
                print(f"  {k}: [{len(v)} items]")
            else:
                print(f"  {k}: {v}")

    def phase1_load_and_inspect(self, df):
        self.df = df.copy()
        self.original_shape = self.df.shape
        num_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()
        self._log(1, "DATA LOADING & INSPECTION", {
            'rows': self.df.shape[0],
            'columns': self.df.shape[1],
            'column_names': list(self.df.columns),
            'numeric_columns': num_cols,
            'memory_mb': round(self.df.memory_usage(deep=True).sum() / 1024 / 1024, 2),
            'total_nulls': int(self.df.isnull().sum().sum()),
        })

    def phase2_handle_missing(self):
        before = int(self.df.isnull().sum().sum())
        filled = {}
        for col in self.df.select_dtypes(include=[np.number]).columns:
            nulls = self.df[col].isnull().sum()
            if nulls > 0:
                med = self.df[col].median()
                self.df[col].fillna(med, inplace=True)
                filled[col] = f'median={med}'
        for col in self.df.select_dtypes(include=['object']).columns:
            nulls = self.df[col].isnull().sum()
            if nulls > 0:
                mode = self.df[col].mode()[0] if len(self.df[col].mode()) > 0 else 'Unknown'
                self.df[col].fillna(mode, inplace=True)
                filled[col] = f'mode={mode}'
        after = int(self.df.isnull().sum().sum())
        self._log(2, "MISSING VALUE TREATMENT", {
            'nulls_before': before, 'nulls_after': after, 'columns_filled': filled
        })

    def phase3_remove_duplicates(self):
        before = len(self.df)
        self.df = self.df.drop_duplicates()
        check_cols = [c for c in ['company', 'title', 'city'] if c in self.df.columns]
        if len(check_cols) >= 2:
            self.df = self.df.drop_duplicates(subset=check_cols, keep='first')
        after = len(self.df)
        self._log(3, "DUPLICATE REMOVAL", {
            'rows_before': before, 'rows_after': after, 'removed': before - after
        })

    def phase4_convert_types(self):
        conversions = {}
        if 'posted_date' in self.df.columns:
            self.df['posted_date'] = pd.to_datetime(self.df['posted_date'], errors='coerce')
            conversions['posted_date'] = 'datetime'
        if 'deadline' in self.df.columns:
            self.df['deadline'] = pd.to_datetime(self.df['deadline'], errors='coerce')
            conversions['deadline'] = 'datetime'
        num_map = {'stipend': 'float64', 'applications': 'int64', 'rating': 'float64',
                   'openings': 'int64', 'demand_score': 'float64', 'growth_trend': 'float64'}
        for col, dtype in num_map.items():
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce').fillna(0)
                if 'int' in dtype:
                    self.df[col] = self.df[col].astype(int)
                conversions[col] = dtype
        self._log(4, "DATA TYPE CONVERSION", {'conversions': conversions})

    def phase5_handle_outliers(self):
        cols = [c for c in ['stipend', 'applications', 'rating', 'openings', 'demand_score', 'growth_trend']
                if c in self.df.columns]
        report = {}
        total = 0
        for col in cols:
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR
            outliers = int(((self.df[col] < lower) | (self.df[col] > upper)).sum())
            self.df[col] = self.df[col].clip(lower=lower, upper=upper)
            total += outliers
            report[col] = f'{outliers} capped [{round(lower,1)}, {round(upper,1)}]'
        self._log(5, "OUTLIER HANDLING (IQR)", {'total_capped': total, 'details': report})

    def phase6_normalize_text(self):
        ops = {}
        for col in ['company', 'domain', 'city', 'title', 'state']:
            if col in self.df.columns:
                self.df[col] = self.df[col].astype(str).str.strip().str.title()
                ops[col] = 'strip + title case'
        if 'type' in self.df.columns:
            mapping = {'remote': 'Remote', 'on-site': 'On-Site', 'onsite': 'On-Site',
                       'hybrid': 'Hybrid', 'on site': 'On-Site'}
            self.df['type'] = self.df['type'].astype(str).str.strip().str.lower().map(
                lambda x: mapping.get(x, x.title()))
            ops['type'] = 'standardized'
        self._log(6, "TEXT NORMALIZATION", {'operations': ops})

    def phase7_feature_engineering(self):
        new = []
        if 'stipend' in self.df.columns:
            self.df['stipend_category'] = pd.cut(
                self.df['stipend'], bins=[0, 10000, 20000, 35000, 50000, float('inf')],
                labels=['Very Low', 'Low', 'Medium', 'High', 'Very High'])
            new.append('stipend_category')
        if 'duration' in self.df.columns:
            self.df['duration_months'] = self.df['duration'].astype(str).apply(
                lambda d: next((i for i in range(12, 0, -1) if str(i) in d), 3))
            new.append('duration_months')
        if 'skills' in self.df.columns:
            self.df['skill_count'] = self.df['skills'].astype(str).apply(
                lambda x: len([s for s in x.split(', ') if s.strip()]))
            new.append('skill_count')
        if 'type' in self.df.columns:
            self.df['is_remote'] = (self.df['type'].str.lower() == 'remote').astype(int)
            self.df['is_hybrid'] = (self.df['type'].str.lower() == 'hybrid').astype(int)
            new.extend(['is_remote', 'is_hybrid'])
        if 'city' in self.df.columns:
            t1 = ['Bangalore', 'Mumbai', 'Delhi Ncr', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune']
            t2 = ['Ahmedabad', 'Jaipur', 'Kochi', 'Noida', 'Gurgaon', 'Chandigarh', 'Lucknow', 'Indore']
            self.df['city_tier'] = self.df['city'].apply(
                lambda c: 1 if str(c).title() in t1 else (2 if str(c).title() in t2 else 3))
            new.append('city_tier')
        if 'company' in self.df.columns:
            counts = self.df['company'].value_counts()
            self.df['company_listing_count'] = self.df['company'].map(counts)
            big = ['Google', 'Microsoft', 'Amazon', 'Tcs', 'Infosys', 'Wipro', 'Accenture', 'Ibm']
            self.df['is_large_company'] = self.df['company'].apply(
                lambda x: 1 if any(b.lower() in str(x).lower() for b in big) else 0)
            new.extend(['company_listing_count', 'is_large_company'])
        if 'stipend' in self.df.columns and 'openings' in self.df.columns:
            self.df['stipend_per_opening'] = (self.df['stipend'] / self.df['openings'].clip(lower=1)).round(2)
            new.append('stipend_per_opening')
        if 'applications' in self.df.columns and 'openings' in self.df.columns:
            self.df['app_density'] = (self.df['applications'] / self.df['openings'].clip(lower=1)).round(2)
            new.append('app_density')
        if 'applications' in self.df.columns:
            self.df['log_applications'] = np.log1p(self.df['applications'])
            new.append('log_applications')
        if 'stipend' in self.df.columns:
            self.df['log_stipend'] = np.log1p(self.df['stipend'])
            new.append('log_stipend')
        if 'rating' in self.df.columns:
            mn, mx = self.df['rating'].min(), self.df['rating'].max()
            self.df['norm_rating'] = ((self.df['rating'] - mn) / (mx - mn + 1e-8)).round(4)
            new.append('norm_rating')
        if 'domain' in self.df.columns and 'stipend' in self.df.columns:
            self.df['domain_avg_stipend'] = self.df.groupby('domain')['stipend'].transform('mean').round(2)
            new.append('domain_avg_stipend')
        if 'domain' in self.df.columns and 'applications' in self.df.columns:
            self.df['domain_avg_apps'] = self.df.groupby('domain')['applications'].transform('mean').round(2)
            new.append('domain_avg_apps')
        if 'skills' in self.df.columns:
            ml = ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision']
            self.df['has_ml_skills'] = self.df['skills'].astype(str).apply(
                lambda x: 1 if any(m in x.lower() for m in ml) else 0)
            web = ['react', 'angular', 'vue', 'javascript', 'html', 'node.js', 'django', 'flask']
            self.df['has_web_skills'] = self.df['skills'].astype(str).apply(
                lambda x: 1 if any(w in x.lower() for w in web) else 0)
            new.extend(['has_ml_skills', 'has_web_skills'])
        if 'posted_date' in self.df.columns:
            try:
                dates = pd.to_datetime(self.df['posted_date'], errors='coerce')
                self.df['post_month'] = dates.dt.month.fillna(6).astype(int)
                self.df['post_quarter'] = dates.dt.quarter.fillna(2).astype(int)
                self.df['is_peak'] = self.df['post_month'].isin([1, 2, 6, 7, 8]).astype(int)
                new.extend(['post_month', 'post_quarter', 'is_peak'])
            except Exception:
                pass
        self._log(7, "FEATURE ENGINEERING", {
            'new_features': new, 'total_new': len(new), 'columns_now': len(self.df.columns)
        })

    def phase8_encode_categoricals(self):
        from sklearn.preprocessing import LabelEncoder
        encoded = {}
        for col in ['domain', 'city', 'company', 'type', 'state', 'title']:
            if col in self.df.columns:
                le = LabelEncoder()
                self.df[f'{col}_enc'] = le.fit_transform(self.df[col].astype(str))
                self.label_encoders[col] = le
                encoded[col] = f'{col}_enc ({self.df[col].nunique()} classes)'
        for col in ['type', 'stipend_category']:
            if col in self.df.columns:
                try:
                    dummies = pd.get_dummies(self.df[col].astype(str), prefix=col, drop_first=False)
                    for dc in dummies.columns:
                        dummies[dc] = dummies[dc].astype(int)
                    self.df = pd.concat([self.df, dummies], axis=1)
                    encoded[f'{col}_onehot'] = list(dummies.columns)
                except Exception:
                    pass
        self._log(8, "CATEGORICAL ENCODING", {'encoded': encoded, 'columns_now': len(self.df.columns)})

    def phase9_vectorize_skills(self):
        skill_cols = []
        if 'skills' in self.df.columns:
            skill_freq = {}
            for s_str in self.df['skills'].dropna():
                for s in str(s_str).split(', '):
                    s = s.strip().lower()
                    if s:
                        skill_freq[s] = skill_freq.get(s, 0) + 1
            top = sorted(skill_freq.items(), key=lambda x: -x[1])[:80]
            for skill, _ in top:
                col_name = f'sk_{skill.replace(" ", "_").replace("/", "_").replace(".", "")}'
                self.df[col_name] = self.df['skills'].astype(str).apply(
                    lambda x: 1 if skill in x.lower() else 0)
                skill_cols.append(col_name)
        self._log(9, "SKILL VECTORIZATION", {
            'skills_vectorized': len(skill_cols), 'columns_now': len(self.df.columns)
        })

    def phase10_create_targets(self):
        if 'demand_score' in self.df.columns:
            self.df['target_reg'] = self.df['demand_score'].astype(float)
        elif 'applications' in self.df.columns:
            self.df['target_reg'] = (
                self.df['applications'] / self.df['applications'].max() * 50 +
                self.df['stipend'] / self.df['stipend'].max() * 30 + 20
            ).round(2)
        if 'target_reg' in self.df.columns:
            self.df['target_cls'] = pd.cut(
                self.df['target_reg'], bins=[0, 25, 50, 75, 100],
                labels=['Low', 'Medium', 'High', 'Very High'], include_lowest=True
            ).astype(str).fillna('Medium')
        dist = self.df['target_cls'].value_counts().to_dict() if 'target_cls' in self.df.columns else {}
        self._log(10, "TARGET CREATION", {
            'regression_target': 'target_reg',
            'classification_target': 'target_cls',
            'class_distribution': {str(k): int(v) for k, v in dist.items()},
        })

    def phase11_scale_features(self):
        from sklearn.preprocessing import StandardScaler
        exclude = ['id', 'target_reg', 'target_cls']
        num_cols = [c for c in self.df.select_dtypes(include=[np.number]).columns if c not in exclude]
        if num_cols:
            self.scaler = StandardScaler()
            self.df[num_cols] = self.scaler.fit_transform(self.df[num_cols].fillna(0))
        self._log(11, "FEATURE SCALING", {'columns_scaled': len(num_cols), 'scaler': 'StandardScaler'})

    def phase12_select_features(self):
        exclude = ['id', 'target_reg', 'target_cls', 'company', 'title', 'location',
                   'city', 'state', 'domain', 'type', 'duration', 'skills',
                   'posted_date', 'deadline', 'stipend_category']
        num_cols = [c for c in self.df.select_dtypes(include=[np.number]).columns if c not in exclude]
        selected = [c for c in num_cols if self.df[c].std() > 0.001]
        if len(selected) > 2:
            corr = self.df[selected].corr().abs()
            upper = corr.where(np.triu(np.ones(corr.shape), k=1).astype(bool))
            to_drop = [c for c in upper.columns if any(upper[c] > 0.95)][:len(selected) // 4]
            selected = [c for c in selected if c not in to_drop]
        self.feature_names = selected
        self._log(12, "FEATURE SELECTION", {
            'features_selected': len(selected), 'sample': selected[:20]
        })

    def phase13_split(self):
        from sklearn.model_selection import train_test_split
        if not self.feature_names:
            self.feature_names = [c for c in self.df.select_dtypes(include=[np.number]).columns
                                  if c not in ['id', 'target_reg', 'target_cls']]
        X = self.df[self.feature_names].fillna(0)
        info = {}
        if 'target_reg' in self.df.columns:
            y = self.df['target_reg'].fillna(0)
            Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
            Xtr.to_csv(os.path.join(self.output_dir, 'X_train.csv'), index=False)
            Xte.to_csv(os.path.join(self.output_dir, 'X_test.csv'), index=False)
            ytr.to_csv(os.path.join(self.output_dir, 'y_train_reg.csv'), index=False)
            yte.to_csv(os.path.join(self.output_dir, 'y_test_reg.csv'), index=False)
            info['regression'] = {'train': Xtr.shape[0], 'test': Xte.shape[0]}
        if 'target_cls' in self.df.columns:
            y = self.df['target_cls'].fillna('Medium')
            try:
                _, _, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
            except ValueError:
                _, _, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
            ytr.to_csv(os.path.join(self.output_dir, 'y_train_cls.csv'), index=False)
            yte.to_csv(os.path.join(self.output_dir, 'y_test_cls.csv'), index=False)
            info['classification_train_dist'] = {str(k): int(v) for k, v in ytr.value_counts().items()}
        self._log(13, "TRAIN/TEST SPLIT", {'split': '80/20', 'info': info})

    def phase14_export(self):
        files = []
        self.df.to_csv(os.path.join(self.output_dir, 'processed_data.csv'), index=False)
        files.append('processed_data.csv')
        with open(os.path.join(self.output_dir, 'feature_names.json'), 'w') as f:
            json.dump(self.feature_names, f, indent=2)
        files.append('feature_names.json')
        if self.scaler:
            with open(os.path.join(self.output_dir, 'scaler.pkl'), 'wb') as f:
                pickle.dump(self.scaler, f)
            files.append('scaler.pkl')
        if self.label_encoders:
            with open(os.path.join(self.output_dir, 'label_encoders.pkl'), 'wb') as f:
                pickle.dump(self.label_encoders, f)
            files.append('label_encoders.pkl')
        self.report['summary'] = {
            'original': list(self.original_shape),
            'final': list(self.df.shape),
            'features': len(self.feature_names)
        }
        with open(os.path.join(self.output_dir, 'preprocessing_report.json'), 'w') as f:
            json.dump(self.report, f, indent=2, default=str)
        files.append('preprocessing_report.json')
        lines = ["=" * 60, "  PREPROCESSING REPORT", f"  {self.report['timestamp']}", "=" * 60]
        for pk, pv in self.report['phases'].items():
            lines.append(f"\n--- {pk}: {pv['name']} ---")
            for k, v in pv['details'].items():
                lines.append(f"  {k}: {v}")
        with open(os.path.join(self.output_dir, 'preprocessing_report.txt'), 'w') as f:
            f.write('\n'.join(lines))
        files.append('preprocessing_report.txt')
        self._log(14, "EXPORT", {'files': files, 'output_dir': self.output_dir})

    def run_all(self, df):
        print("\n" + "=" * 60)
        print(f"  PREPROCESSING PIPELINE ({len(df)} records)")
        print("=" * 60)
        self.phase1_load_and_inspect(df)
        self.phase2_handle_missing()
        self.phase3_remove_duplicates()
        self.phase4_convert_types()
        self.phase5_handle_outliers()
        self.phase6_normalize_text()
        self.phase7_feature_engineering()
        self.phase8_encode_categoricals()
        self.phase9_vectorize_skills()
        self.phase10_create_targets()
        self.phase11_scale_features()
        self.phase12_select_features()
        self.phase13_split()
        self.phase14_export()
        print(f"\n  DONE! {self.original_shape} -> {self.df.shape}")
        print(f"  Features: {len(self.feature_names)}")
        return self.df


if __name__ == '__main__':
    from internship_data import generate_internships
    data = generate_internships(20000)
    df = pd.DataFrame(data)
    print(f"Skills dtype: {df['skills'].dtype}")
    p = InternshipPreprocessor()
    p.run_all(df)