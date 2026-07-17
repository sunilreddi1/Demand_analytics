"""InternMatch AI - Main Application"""

import sys
import os


def banner():
    print("\n" + "=" * 60)
    print("  🎯 INTERNMATCH AI")
    print("  Internship Intelligence Platform")
    print("  30,000+ Listings | Live APIs | ML Models | Resume Parser")
    print("=" * 60)


def menu():
    print("\n  MENU:")
    print("   1) 🚀 Launch Streamlit Dashboard")
    print("   2) 🔬 Run EDA (11 phases)")
    print("   3) 🔧 Run Preprocessing (14 phases)")
    print("   4) 🧠 Train Models (8 models)")
    print("   5) 🔮 Full Pipeline (EDA+Preprocess+Train)")
    print("   6) 📊 Prediction Demo")
    print("   7) ✨ Recommendation Demo")
    print("   8) 📈 Analytics Summary")
    print("   9) 💾 Export Data")
    print("  10) 🌐 Launch Flask API")
    print("  11) 📄 Resume Search")
    print("  12) 🔄 Fetch Live Internships")
    print("   0) Exit")


def run_streamlit():
    os.system(f'{sys.executable} -m streamlit run streamlit_app.py')


def run_eda():
    from internship_data import generate_internships
    from eda_process import InternshipEDA
    import pandas as pd
    df = pd.DataFrame(generate_internships(30000))
    InternshipEDA().run_all(df)


def run_preprocess():
    from internship_data import generate_internships
    from preprocessing import InternshipPreprocessor
    import pandas as pd
    df = pd.DataFrame(generate_internships(30000))
    InternshipPreprocessor().run_all(df)


def run_train():
    from model_training import ModelTrainer
    ModelTrainer().run_all()


def run_pipeline():
    print("\n  Step 1/3: EDA")
    run_eda()
    print("\n  Step 2/3: Preprocessing")
    run_preprocess()
    print("\n  Step 3/3: Training")
    run_train()
    print("\n  PIPELINE COMPLETE!")


def run_predict():
    from internship_data import generate_internships
    from ml_models import DemandPredictor
    data = generate_internships(100)
    p = DemandPredictor()
    results = sorted([(i, p.predict(i)) for i in data], key=lambda x: -x[1])
    print("\n  Top 10 Predictions:")
    for idx, (i, s) in enumerate(results[:10]):
        print(f"    {idx+1}. {i['title']} at {i['company']} - Score: {s}")


def run_recommend():
    from internship_data import generate_internships
    from ml_models import RecommendationEngine
    data = generate_internships(1000)
    student = {'skills': ['Python', 'React', 'Machine Learning', 'SQL'],
               'interests': ['Data Science'], 'location': 'Bangalore',
               'preferredType': 'Remote', 'minStipend': 15000}
    results = RecommendationEngine().recommend(student, data, 10)
    print(f"\n  Recommendations for: {student['skills']}")
    for i, r in enumerate(results):
        print(f"    {i+1}. {r['internship']['title']} at {r['internship']['company']} - {r['score']}%")


def run_analytics():
    from internship_data import generate_internships
    from ml_models import AnalyticsEngine
    data = generate_internships(30000)
    s = AnalyticsEngine().summarize(data)
    live = len([d for d in data if d.get('is_live', False)])
    print(f"\n  Listings: {s['total']:,} ({live} live)")
    print(f"  Applications: {s['applications']:,}")
    print(f"  Avg Stipend: ₹{s['avg_stipend']:,}")
    print(f"  Top Domains: {list(s['top_domains'].keys())[:5]}")
    print(f"  Top Skills: {list(s['top_skills'].keys())[:10]}")


def run_export():
    from internship_data import generate_internships
    import pandas as pd
    import json
    data = generate_internships(30000)
    os.makedirs('exports', exist_ok=True)
    pd.DataFrame(data).to_csv('exports/internships.csv', index=False)
    with open('exports/internships.json', 'w') as f:
        json.dump(data[:1000], f, indent=2)
    live = len([d for d in data if d.get('is_live', False)])
    print(f"  Exported {len(data)} records ({live} live) to exports/")


def run_flask():
    os.system(f'{sys.executable} flask_app.py')


def run_resume():
    from resume_parser import ResumeParser, SkillMatcher
    from internship_data import generate_internships
    text = input("  Paste resume (or 'sample'): ")
    if text.lower() == 'sample':
        text = "Python JavaScript React Node.js SQL MongoDB Docker AWS Machine Learning TensorFlow Django Git 3 years experience B.Tech Computer Science"
    parsed = ResumeParser().parse_text(text)
    print(f"\n  Skills: {parsed['total_skills']}")
    print(f"  Experience: {parsed['experience_years']} years")
    print(f"  Education: {parsed['education']}")
    for cat, skills in parsed['skill_categories'].items():
        print(f"    {cat}: {', '.join(skills)}")
    matches = SkillMatcher(generate_internships(5000)).match(parsed, 10)
    print(f"\n  Top Matches:")
    for i, m in enumerate(matches):
        print(f"    {i+1}. {m['internship']['title']} at {m['internship']['company']} - {m['match_score']}%")


def run_live_fetch():
    print("\n  Fetching live internships from APIs...")
    try:
        from live_data_fetcher import LiveDataFetcher
        fetcher = LiveDataFetcher()
        data = fetcher.fetch_all()
        status = fetcher.get_status()
        print(f"\n  Fetched: {len(data)} live listings")
        for log in status['sources']:
            print(f"    {log['source']}: {log['count']} ({log['status']})")
    except Exception as e:
        print(f"  Error: {e}")
        print("  Make sure requests and beautifulsoup4 are installed:")
        print("  pip install requests beautifulsoup4")


def main():
    banner()
    if len(sys.argv) > 1:
        arg = sys.argv[1].replace('--', '')
        cmds = {'streamlit': run_streamlit, 'eda': run_eda, 'preprocess': run_preprocess,
                'train': run_train, 'pipeline': run_pipeline, 'predict': run_predict,
                'recommend': run_recommend, 'analytics': run_analytics, 'export': run_export,
                'api': run_flask, 'resume': run_resume, 'live': run_live_fetch,
                'fetch': run_live_fetch}
        if arg in cmds:
            cmds[arg]()
        else:
            print(f"  Unknown: {arg}")
        return
    while True:
        menu()
        c = input("\n  Choice (0-12): ").strip()
        cmds = {'1': run_streamlit, '2': run_eda, '3': run_preprocess, '4': run_train,
                '5': run_pipeline, '6': run_predict, '7': run_recommend, '8': run_analytics,
                '9': run_export, '10': run_flask, '11': run_resume, '12': run_live_fetch}
        if c == '0':
            print("  Goodbye!")
            break
        elif c in cmds:
            cmds[c]()
        else:
            print("  Invalid choice")


if __name__ == '__main__':
    main()