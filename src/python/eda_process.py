"""
InternMatch AI - Exploratory Data Analysis Pipeline
11-Phase EDA for 20,000 internship listings
All data is string/numeric - NO list columns
"""

import pandas as pd
import numpy as np
import json
import os
import warnings
from datetime import datetime

warnings.filterwarnings('ignore')


class InternshipEDA:
    """Complete 11-phase EDA pipeline."""

    def __init__(self, output_dir='eda_output'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.report = {'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'phases': {}}
        self.df = None

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

    def phase1_data_overview(self, df):
        self.df = df.copy()
        self._log(1, "DATA OVERVIEW", {
            'shape': f"{self.df.shape[0]} rows x {self.df.shape[1]} columns",
            'columns': list(self.df.columns),
            'dtypes': {c: str(d) for c, d in self.df.dtypes.items()},
            'memory_mb': round(self.df.memory_usage(deep=True).sum() / 1024 / 1024, 2),
            'total_nulls': int(self.df.isnull().sum().sum()),
            'duplicates': int(self.df.duplicated().sum()),
        })

    def phase2_data_quality(self):
        total_cells = self.df.shape[0] * self.df.shape[1]
        null_cells = self.df.isnull().sum().sum()
        null_per_col = {c: int(v) for c, v in self.df.isnull().sum().items() if v > 0}
        self._log(2, "DATA QUALITY", {
            'completeness_pct': round((1 - null_cells / total_cells) * 100, 2),
            'null_columns': null_per_col if null_per_col else 'None',
            'unique_counts': {c: int(self.df[c].nunique()) for c in self.df.columns[:12]},
        })

    def phase3_univariate_numeric(self):
        num_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()
        stats = {}
        for col in num_cols[:10]:
            stats[col] = {
                'mean': round(float(self.df[col].mean()), 2),
                'median': round(float(self.df[col].median()), 2),
                'std': round(float(self.df[col].std()), 2),
                'min': round(float(self.df[col].min()), 2),
                'max': round(float(self.df[col].max()), 2),
                'skew': round(float(self.df[col].skew()), 3),
                'kurtosis': round(float(self.df[col].kurtosis()), 3),
            }
        self._log(3, "UNIVARIATE NUMERIC", {'statistics': stats})

    def phase4_univariate_categorical(self):
        cat_cols = self.df.select_dtypes(include=['object']).columns.tolist()
        freq = {}
        for col in cat_cols[:8]:
            top = self.df[col].value_counts().head(8)
            freq[col] = {str(k): int(v) for k, v in top.items()}
        self._log(4, "UNIVARIATE CATEGORICAL", {'frequency_tables': freq})

    def phase5_bivariate(self):
        details = {}
        if 'stipend' in self.df.columns and 'applications' in self.df.columns:
            details['stipend_vs_apps_corr'] = round(float(
                self.df['stipend'].corr(self.df['applications'])), 4)
        if 'domain' in self.df.columns and 'stipend' in self.df.columns:
            avg = self.df.groupby('domain')['stipend'].mean().sort_values(ascending=False).head(10)
            details['avg_stipend_by_domain'] = {str(k): round(float(v)) for k, v in avg.items()}
        if 'type' in self.df.columns and 'applications' in self.df.columns:
            avg = self.df.groupby('type')['applications'].mean()
            details['avg_apps_by_type'] = {str(k): round(float(v)) for k, v in avg.items()}
        if 'city' in self.df.columns and 'applications' in self.df.columns:
            avg = self.df.groupby('city')['applications'].mean().sort_values(ascending=False).head(10)
            details['avg_apps_by_city'] = {str(k): round(float(v)) for k, v in avg.items()}
        self._log(5, "BIVARIATE ANALYSIS", details)

    def phase6_multivariate(self):
        num_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()[:8]
        strong = []
        if len(num_cols) >= 2:
            corr = self.df[num_cols].corr()
            for i in range(len(corr.columns)):
                for j in range(i + 1, len(corr.columns)):
                    val = corr.iloc[i, j]
                    if abs(val) > 0.4:
                        strong.append(f"{corr.columns[i]} <-> {corr.columns[j]}: {val:.3f}")
        self._log(6, "MULTIVARIATE", {
            'strong_correlations': strong if strong else ['None found above 0.4'],
            'numeric_columns_analyzed': num_cols,
        })

    def phase7_domain_analysis(self):
        details = {}
        if 'domain' in self.df.columns:
            counts = self.df['domain'].value_counts()
            details['domain_distribution'] = {str(k): int(v) for k, v in counts.items()}
            if 'demand_score' in self.df.columns:
                avg = self.df.groupby('domain')['demand_score'].mean().sort_values(ascending=False)
                details['avg_demand_by_domain'] = {str(k): round(float(v), 1) for k, v in avg.head(10).items()}
        self._log(7, "DOMAIN ANALYSIS", details)

    def phase8_location_analysis(self):
        details = {}
        if 'city' in self.df.columns:
            counts = self.df['city'].value_counts().head(15)
            details['city_distribution'] = {str(k): int(v) for k, v in counts.items()}
            if 'stipend' in self.df.columns:
                avg = self.df.groupby('city')['stipend'].mean().sort_values(ascending=False).head(10)
                details['avg_stipend_by_city'] = {str(k): round(float(v)) for k, v in avg.items()}
        self._log(8, "LOCATION ANALYSIS", details)

    def phase9_skills_analysis(self):
        details = {}
        if 'skills' in self.df.columns:
            all_skills = {}
            for skills_str in self.df['skills'].dropna():
                for s in str(skills_str).split(', '):
                    s = s.strip()
                    if s:
                        all_skills[s] = all_skills.get(s, 0) + 1
            top = sorted(all_skills.items(), key=lambda x: -x[1])[:25]
            details['top_25_skills'] = {s: c for s, c in top}
            details['total_unique_skills'] = len(all_skills)
            details['avg_skills_per_listing'] = round(
                self.df['skills'].apply(lambda x: len(str(x).split(', '))).mean(), 1)
        self._log(9, "SKILLS ANALYSIS", details)

    def phase10_trend_analysis(self):
        details = {}
        if 'posted_date' in self.df.columns:
            try:
                dates = pd.to_datetime(self.df['posted_date'], errors='coerce')
                monthly = dates.dt.month.value_counts().sort_index()
                details['monthly_postings'] = {f"Month {int(k)}": int(v) for k, v in monthly.items()}
            except Exception:
                details['date_note'] = 'Could not parse dates'
        if 'growth_trend' in self.df.columns:
            details['avg_growth'] = round(float(self.df['growth_trend'].mean()), 2)
            details['positive_growth_pct'] = round(
                float((self.df['growth_trend'] > 0).mean() * 100), 1)
        self._log(10, "TREND ANALYSIS", details)

    def phase11_export(self):
        files = []
        with open(os.path.join(self.output_dir, 'eda_report.json'), 'w') as f:
            json.dump(self.report, f, indent=2, default=str)
        files.append('eda_report.json')

        lines = ["=" * 60, "  INTERNMATCH AI - EDA REPORT",
                  f"  {self.report['timestamp']}", "=" * 60]
        for pk, pv in self.report['phases'].items():
            lines.append(f"\n--- {pk}: {pv['name']} ---")
            for k, v in pv['details'].items():
                if isinstance(v, dict):
                    lines.append(f"  {k}:")
                    for kk, vv in list(v.items())[:15]:
                        lines.append(f"    {kk}: {vv}")
                else:
                    lines.append(f"  {k}: {v}")
        with open(os.path.join(self.output_dir, 'eda_report.txt'), 'w') as f:
            f.write('\n'.join(lines))
        files.append('eda_report.txt')

        self._log(11, "EXPORT", {'files_saved': files, 'output_dir': self.output_dir})

    def run_all(self, df):
        print("\n" + "=" * 60)
        print(f"  INTERNMATCH AI - EDA PIPELINE ({len(df)} records)")
        print("=" * 60)
        self.phase1_data_overview(df)
        self.phase2_data_quality()
        self.phase3_univariate_numeric()
        self.phase4_univariate_categorical()
        self.phase5_bivariate()
        self.phase6_multivariate()
        self.phase7_domain_analysis()
        self.phase8_location_analysis()
        self.phase9_skills_analysis()
        self.phase10_trend_analysis()
        self.phase11_export()
        print("\n  EDA COMPLETE!")
        return self.report


if __name__ == '__main__':
    from internship_data import generate_internships
    data = generate_internships(20000)
    df = pd.DataFrame(data)
    print(f"Data columns: {list(df.columns)}")
    print(f"Skills dtype: {df['skills'].dtype}")
    eda = InternshipEDA()
    eda.run_all(df)