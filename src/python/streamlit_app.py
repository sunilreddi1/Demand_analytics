"""InternMatch AI - Streamlit Dashboard (Dark Theme, 30K+ Live Data)"""

import streamlit as st
import pandas as pd
import numpy as np

st.set_page_config(page_title="InternMatch AI", page_icon="🎯", layout="wide", initial_sidebar_state="expanded")

# DARK THEME CSS
st.markdown("""
<style>
    .stApp { background-color: #0E1117; }
    [data-testid="stSidebar"] { background-color: #161B22; border-right: 1px solid #21262D; }
    h1, h2, h3, h4, h5, h6 { color: #E6EDF3 !important; }
    p, span, label, .stMarkdown { color: #C9D1D9 !important; }
    .stSelectbox > div > div, .stMultiSelect > div > div, .stTextInput > div > div,
    .stTextArea > div > div { background-color: #161B22 !important; color: #C9D1D9 !important;
        border-color: #30363D !important; }
    div[data-testid="stMetricValue"] { color: #E6EDF3 !important; font-size: 2rem !important; }
    div[data-testid="stMetricLabel"] { color: #8B949E !important; }
    .stButton > button { background: linear-gradient(135deg, #6366F1, #8B5CF6) !important;
        color: white !important; border: none !important; border-radius: 8px !important;
        padding: 0.5rem 2rem !important; font-weight: 600 !important; }
    .stButton > button:hover { background: linear-gradient(135deg, #818CF8, #A78BFA) !important; }
    .metric-card { background: linear-gradient(135deg, #161B22, #1C2333); border: 1px solid #30363D;
        border-radius: 12px; padding: 1.5rem; text-align: center; }
    .metric-value { font-size: 2rem; font-weight: 800; color: #E6EDF3; }
    .metric-label { font-size: 0.85rem; color: #8B949E; margin-top: 0.3rem; }
    .hero-card { background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
        border: 1px solid #30363D; border-radius: 16px; padding: 2rem; margin-bottom: 1rem; }
    .skill-tag { display: inline-block; background: rgba(99,102,241,0.15); color: #818CF8;
        padding: 4px 12px; border-radius: 20px; margin: 2px; font-size: 0.8rem;
        border: 1px solid rgba(99,102,241,0.3); }
    .match-tag { display: inline-block; background: rgba(16,185,129,0.15); color: #10B981;
        padding: 4px 12px; border-radius: 20px; margin: 2px; font-size: 0.8rem;
        border: 1px solid rgba(16,185,129,0.3); }
    .miss-tag { display: inline-block; background: rgba(239,68,68,0.15); color: #EF4444;
        padding: 4px 12px; border-radius: 20px; margin: 2px; font-size: 0.8rem;
        border: 1px solid rgba(239,68,68,0.3); }
    .live-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.1);
        color: #10B981; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
        border: 1px solid rgba(16,185,129,0.3); }
    .live-dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%;
        animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    hr { border-color: #21262D !important; }
    [data-testid="stExpander"] { background-color: #161B22; border: 1px solid #21262D; border-radius: 8px; }
</style>
""", unsafe_allow_html=True)

DARK_LAYOUT = dict(
    paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
    font=dict(color='#C9D1D9'), xaxis=dict(gridcolor='#21262D', color='#8B949E'),
    yaxis=dict(gridcolor='#21262D', color='#8B949E'), legend=dict(font=dict(color='#C9D1D9')),
    margin=dict(l=40, r=20, t=40, b=40),
)
COLORS = ['#818CF8', '#A78BFA', '#C084FC', '#E879F9', '#F472B6', '#FB923C',
          '#FBBF24', '#34D399', '#22D3EE', '#60A5FA', '#F87171', '#4ADE80']


@st.cache_data
def load_data():
    from internship_data import generate_internships
    return generate_internships(30000, include_live=True)


internships = load_data()
df = pd.DataFrame(internships)
live_count = len([i for i in internships if i.get('is_live', False)])
gen_count = len(internships) - live_count

# Sidebar
st.sidebar.markdown("## 🎯 InternMatch AI")
st.sidebar.markdown(f'<div class="live-badge"><div class="live-dot"></div> {live_count} LIVE LISTINGS</div>',
                    unsafe_allow_html=True)
st.sidebar.markdown(f"**{len(df):,}** Total • **{df['company'].nunique()}** Companies")
st.sidebar.markdown("---")

# Refresh button
if st.sidebar.button("🔄 Refresh Live Data"):
    try:
        from live_data_fetcher import LiveDataFetcher
        fetcher = LiveDataFetcher()
        fetcher.fetch_all()
        st.cache_data.clear()
        st.rerun()
    except Exception as e:
        st.sidebar.error(f"Error: {e}")

page = st.sidebar.radio("Navigate", ["🏠 Home", "📊 Dashboard", "🔍 Explore", "✨ Recommendations",
                                       "🧠 Predictor", "📄 Resume Search", "🔬 ML Pipeline", "📥 Export"])

if page == "🏠 Home":
    st.markdown('<div class="hero-card">', unsafe_allow_html=True)
    st.markdown("# 🎯 InternMatch AI")
    st.markdown("### AI-Powered Internship Intelligence Platform")
    st.markdown(f'<div class="live-badge" style="margin-bottom:1rem"><div class="live-dot"></div> '
                f'LIVE DATA FROM 5+ APIs</div>', unsafe_allow_html=True)
    st.markdown(f"**{len(df):,}** Listings ({live_count} 🟢 Live + {gen_count} Generated) • "
                f"**{df['company'].nunique()}** Companies • **{df['domain'].nunique()}** Domains • "
                f"**{df['city'].nunique()}** Cities")
    st.markdown('</div>', unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(f'<div class="metric-card"><div class="metric-value" style="color:#818CF8">'
                    f'{len(df):,}</div><div class="metric-label">Total Listings</div></div>',
                    unsafe_allow_html=True)
    with c2:
        st.markdown(f'<div class="metric-card"><div class="metric-value" style="color:#34D399">'
                    f'{live_count:,}</div><div class="metric-label">🟢 Live Listings</div></div>',
                    unsafe_allow_html=True)
    with c3:
        st.markdown(f'<div class="metric-card"><div class="metric-value" style="color:#A78BFA">'
                    f'₹{df["stipend"].mean():,.0f}</div><div class="metric-label">Avg Stipend</div></div>',
                    unsafe_allow_html=True)
    with c4:
        st.markdown(f'<div class="metric-card"><div class="metric-value" style="color:#FBBF24">'
                    f'{df["rating"].mean():.1f} ⭐</div><div class="metric-label">Avg Rating</div></div>',
                    unsafe_allow_html=True)

    st.markdown("---")

    # Data Sources
    st.markdown("### 🌐 Live Data Sources")
    if 'source' in df.columns:
        source_counts = df['source'].value_counts()
        cols = st.columns(min(len(source_counts), 5))
        for i, (src, count) in enumerate(source_counts.items()):
            with cols[i % len(cols)]:
                color = '#34D399' if src != 'Generated' else '#8B949E'
                badge = '🟢' if src != 'Generated' else '⚪'
                st.markdown(f'<div class="metric-card"><div class="metric-value" style="color:{color};font-size:1.5rem">'
                            f'{badge} {count:,}</div><div class="metric-label">{src}</div></div>',
                            unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("### 🚀 Quick Actions")
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        if st.button("📊 Dashboard", use_container_width=True): pass
    with c2:
        if st.button("🔍 Explore", use_container_width=True): pass
    with c3:
        if st.button("📄 Resume Search", use_container_width=True): pass
    with c4:
        if st.button("🔬 ML Pipeline", use_container_width=True): pass

elif page == "📊 Dashboard":
    import plotly.express as px
    import plotly.graph_objects as go

    st.markdown("# 📊 Analytics Dashboard")
    st.markdown(f'<div class="live-badge"><div class="live-dot"></div> {len(df):,} listings '
                f'({live_count} live)</div>', unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Listings", f"{len(df):,}")
    c2.metric("Live Listings", f"{live_count:,}")
    c3.metric("Avg Stipend", f"₹{df['stipend'].mean():,.0f}")
    c4.metric("Avg Rating", f"{df['rating'].mean():.1f}")

    st.markdown("---")
    col1, col2 = st.columns(2)

    with col1:
        domain_counts = df['domain'].value_counts().head(15)
        fig = px.bar(x=domain_counts.values, y=domain_counts.index, orientation='h',
                     title="Internships by Domain", color=domain_counts.values,
                     color_continuous_scale='Viridis')
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        city_counts = df['city'].value_counts().head(15)
        fig = px.bar(x=city_counts.values, y=city_counts.index, orientation='h',
                     title="Internships by City", color=city_counts.values,
                     color_continuous_scale='Plasma')
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    col3, col4 = st.columns(2)
    with col3:
        type_counts = df['type'].value_counts()
        fig = px.pie(values=type_counts.values, names=type_counts.index, title="Work Type",
                     color_discrete_sequence=COLORS, hole=0.4)
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with col4:
        fig = px.histogram(df, x='stipend', nbins=25, title="Stipend Distribution",
                          color_discrete_sequence=['#818CF8'])
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    col5, col6 = st.columns(2)
    with col5:
        all_skills = {}
        for s_str in df['skills'].dropna():
            for s in str(s_str).split(', '):
                s = s.strip()
                if s: all_skills[s] = all_skills.get(s, 0) + 1
        top_sk = sorted(all_skills.items(), key=lambda x: -x[1])[:20]
        sk_df = pd.DataFrame(top_sk, columns=['Skill', 'Count'])
        fig = px.bar(sk_df, x='Count', y='Skill', orientation='h', title="Top Skills",
                     color='Count', color_continuous_scale='Turbo')
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with col6:
        avg_demand = df.groupby('domain')['demand_score'].mean().sort_values(ascending=False).head(15)
        fig = px.bar(x=avg_demand.values, y=avg_demand.index, orientation='h',
                     title="Avg Demand by Domain", color=avg_demand.values,
                     color_continuous_scale='Inferno')
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    col7, col8 = st.columns(2)
    with col7:
        sample_df = df.sample(min(2000, len(df)))
        fig = px.scatter(sample_df, x='stipend', y='applications',
                        color='type', title="Stipend vs Applications",
                        color_discrete_sequence=COLORS, opacity=0.6)
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with col8:
        if 'source' in df.columns:
            src_counts = df['source'].value_counts()
            fig = px.pie(values=src_counts.values, names=src_counts.index, title="Data Sources",
                         color_discrete_sequence=COLORS, hole=0.4)
            fig.update_layout(**DARK_LAYOUT)
            st.plotly_chart(fig, use_container_width=True)
        else:
            avg_growth = df.groupby('domain')['growth_trend'].mean().sort_values(ascending=False).head(15)
            colors_g = ['#34D399' if v >= 0 else '#F87171' for v in avg_growth.values]
            fig = go.Figure(go.Bar(x=avg_growth.values, y=avg_growth.index, orientation='h', marker_color=colors_g))
            fig.update_layout(title="Growth Trend by Domain", **DARK_LAYOUT)
            st.plotly_chart(fig, use_container_width=True)

elif page == "🔍 Explore":
    st.markdown("# 🔍 Explore Internships")
    st.markdown(f'<div class="live-badge"><div class="live-dot"></div> {len(df):,} listings available</div>',
                unsafe_allow_html=True)

    c1, c2, c3, c4, c5 = st.columns(5)
    with c1: search = st.text_input("🔎 Search", "")
    with c2: dom = st.selectbox("Domain", ["All"] + sorted(df['domain'].unique().tolist()))
    with c3: cit = st.selectbox("City", ["All"] + sorted(df['city'].unique().tolist()))
    with c4: typ = st.selectbox("Type", ["All", "Remote", "On-site", "Hybrid"])
    with c5:
        src_options = ["All"] + sorted(df['source'].unique().tolist()) if 'source' in df.columns else ["All"]
        src = st.selectbox("Source", src_options)

    live_only = st.checkbox("🟢 Show Live Only", value=False)

    filtered = df.copy()
    if search:
        s = search.lower()
        filtered = filtered[filtered.apply(lambda r: s in str(r['title']).lower() or
                                           s in str(r['company']).lower() or
                                           s in str(r['skills']).lower(), axis=1)]
    if dom != "All": filtered = filtered[filtered['domain'] == dom]
    if cit != "All": filtered = filtered[filtered['city'] == cit]
    if typ != "All": filtered = filtered[filtered['type'] == typ]
    if src != "All" and 'source' in filtered.columns: filtered = filtered[filtered['source'] == src]
    if live_only and 'is_live' in filtered.columns: filtered = filtered[filtered['is_live'] == True]

    sort_by = st.selectbox("Sort by", ['demand_score', 'applications', 'stipend', 'rating'])
    filtered = filtered.sort_values(sort_by, ascending=False)

    live_in_filtered = len(filtered[filtered['is_live'] == True]) if 'is_live' in filtered.columns else 0
    st.markdown(f"**Showing {len(filtered):,} internships** ({live_in_filtered} live)")

    page_num = st.number_input("Page", 1, max((len(filtered) - 1) // 30 + 1, 1), 1)
    start = (page_num - 1) * 30
    page_data = filtered.iloc[start:start + 30]

    for _, row in page_data.iterrows():
        is_live = row.get('is_live', False)
        source = row.get('source', 'Generated')
        live_icon = '🟢' if is_live else '⚪'
        with st.expander(f"{live_icon} {row['title']} at {row['company']} | {row['city']} | ₹{row['stipend']:,} | {source}"):
            c1, c2, c3, c4 = st.columns(4)
            c1.write(f"**Domain:** {row['domain']}")
            c2.write(f"**Type:** {row['type']}")
            c3.write(f"**Duration:** {row['duration']}")
            c4.write(f"**Rating:** {row['rating']} ⭐")
            st.write(f"**Applications:** {row['applications']:,} | **Openings:** {row['openings']} | "
                     f"**Demand Score:** {row['demand_score']} | **Growth:** {row['growth_trend']}% | "
                     f"**Source:** {source} {'🟢 LIVE' if is_live else ''}")
            skills_html = ' '.join(f'<span class="skill-tag">{s.strip()}</span>'
                                   for s in str(row['skills']).split(', ') if s.strip())
            st.markdown(f"**Skills:** {skills_html}", unsafe_allow_html=True)

elif page == "✨ Recommendations":
    from ml_models import RecommendationEngine
    st.markdown("# ✨ AI Recommendations")
    st.markdown(f'<div class="live-badge"><div class="live-dot"></div> Matching against {len(df):,} listings</div>',
                unsafe_allow_html=True)

    all_skills_set = set()
    for s_str in df['skills'].dropna():
        for s in str(s_str).split(', '):
            if s.strip(): all_skills_set.add(s.strip())

    c1, c2 = st.columns(2)
    with c1:
        skills = st.multiselect("Your Skills", sorted(all_skills_set))
        interests = st.multiselect("Domain Interests", sorted(df['domain'].unique()))
    with c2:
        location = st.selectbox("Preferred City", ["Any"] + sorted(df['city'].unique().tolist()))
        work_type = st.selectbox("Work Type", ["Any", "Remote", "On-site", "Hybrid"])
        min_stipend = st.slider("Min Stipend (₹)", 0, 100000, 10000, 5000)

    if st.button("🚀 Get Recommendations", use_container_width=True) and skills:
        student = {'skills': skills, 'interests': interests,
                   'location': '' if location == 'Any' else location,
                   'preferredType': work_type, 'minStipend': min_stipend}
        engine = RecommendationEngine()
        results = engine.recommend(student, internships, 20)

        for i, r in enumerate(results):
            intern = r['internship']
            score = r['score']
            color = '#34D399' if score >= 70 else ('#818CF8' if score >= 50 else '#FBBF24')
            is_live = intern.get('is_live', False)
            source = intern.get('source', 'Generated')
            live_badge = f' <span class="live-badge" style="font-size:0.65rem"><div class="live-dot"></div>{source}</span>' if is_live else ''

            st.markdown(f"""
            <div style="background:#161B22; border:1px solid #30363D; border-radius:12px;
                        padding:1rem; margin:0.5rem 0; border-left:4px solid {color}">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <div>
                        <span style="color:#E6EDF3; font-weight:700; font-size:1.1rem">
                            #{i+1} {intern['title']}</span>
                        <span style="color:#818CF8"> at {intern['company']}</span>
                        {live_badge}
                    </div>
                    <span style="background:{color}20; color:{color}; padding:4px 16px;
                                border-radius:20px; font-weight:700; border:1px solid {color}40">
                        {score}% Match</span>
                </div>
                <div style="color:#8B949E; margin-top:0.5rem">
                    📍 {intern['city']} • 💼 {intern['domain']} • 🕐 {intern['duration']} •
                    💰 ₹{intern['stipend']:,}/mo • ⭐ {intern['rating']}
                </div>
            </div>
            """, unsafe_allow_html=True)

            i_skills = [s.strip() for s in str(intern['skills']).split(', ') if s.strip()]
            tags = ''
            for sk in i_skills:
                is_match = any(s.lower() in sk.lower() or sk.lower() in s.lower() for s in skills)
                cls = 'match-tag' if is_match else 'miss-tag'
                tags += f'<span class="{cls}">{"✓" if is_match else "✗"} {sk}</span> '
            st.markdown(tags, unsafe_allow_html=True)
    elif not skills:
        st.info("Select your skills above to get recommendations")

elif page == "🧠 Predictor":
    from ml_models import DemandPredictor
    st.markdown("# 🧠 Demand Predictor")

    c1, c2 = st.columns([1, 2])
    with c1:
        domain = st.selectbox("Domain", sorted(df['domain'].unique()))
        city = st.selectbox("City", sorted(df['city'].unique()))
        wtype = st.selectbox("Work Type", ["Remote", "On-site", "Hybrid"])
        stipend = st.slider("Stipend (₹/month)", 0, 100000, 25000, 5000)

        pred = DemandPredictor()
        score = pred.predict({'domain': domain, 'city': city, 'type': wtype, 'stipend': stipend})
        factors = pred.get_factors({'domain': domain, 'city': city, 'type': wtype, 'stipend': stipend})

        level = 'Very High' if score >= 75 else ('High' if score >= 55 else ('Medium' if score >= 35 else 'Low'))
        color = '#EF4444' if score >= 75 else ('#FB923C' if score >= 55 else ('#FBBF24' if score >= 35 else '#34D399'))

        st.markdown(f"""
        <div class="metric-card" style="margin-top:1rem">
            <div style="color:#8B949E; font-size:0.9rem">Predicted Demand</div>
            <div style="font-size:3rem; font-weight:900; color:{color}">{score}</div>
            <div style="color:{color}; font-weight:700">{level}</div>
        </div>
        """, unsafe_allow_html=True)
        if factors:
            st.markdown("**Key Factors:**")
            for f in factors:
                st.markdown(f"• {f}")

    with c2:
        import plotly.express as px

        feat_data = pd.DataFrame({
            'Factor': ['Stipend', 'Domain', 'Remote Work', 'Rating', 'Skills', 'Location', 'Duration', 'Openings'],
            'Impact': [85, 78, 72, 68, 65, 58, 45, 40]
        })
        fig = px.bar(feat_data, x='Impact', y='Factor', orientation='h', title="Feature Importance",
                     color='Impact', color_continuous_scale='Viridis')
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

        avg_d = df.groupby('domain')['demand_score'].mean().sort_values(ascending=False).head(12)
        fig = px.bar(x=avg_d.values, y=avg_d.index, orientation='h', title="Demand by Domain",
                     color=avg_d.values, color_continuous_scale='Plasma')
        fig.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

elif page == "📄 Resume Search":
    from resume_parser import ResumeParser, SkillMatcher
    st.markdown("# 📄 Resume-Based Search")
    st.markdown(f'<div class="live-badge"><div class="live-dot"></div> Matching against {len(df):,} listings</div>',
                unsafe_allow_html=True)

    tab1, tab2 = st.tabs(["📝 Paste Text", "📁 Upload File"])

    resume_text = ""
    with tab1:
        resume_text = st.text_area("Paste your resume here", height=250,
                                    placeholder="Paste your full resume text...")
        if st.button("📋 Load Sample Resume"):
            resume_text = """John Doe - Software Engineer
B.Tech Computer Science, IIT Delhi 2024
3 years of experience in software development

SKILLS: Python, JavaScript, React, Node.js, TypeScript, Django, Flask,
SQL, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Git,
Machine Learning, TensorFlow, PyTorch, Pandas, NumPy,
HTML/CSS, REST APIs, GraphQL, Agile, JIRA, Linux, CI/CD

PROJECTS:
- Built e-commerce platform using React, Node.js, MongoDB
- ML pipeline for sentiment analysis using Python, TensorFlow, NLP
- Deployed microservices on AWS using Docker, Kubernetes
- Data dashboard with Pandas, Plotly, Streamlit"""
            st.text_area("Resume", resume_text, height=250, key="sample_display")

    with tab2:
        uploaded = st.file_uploader("Upload Resume (PDF, DOCX, TXT)", type=['pdf', 'docx', 'txt'])
        if uploaded:
            if uploaded.name.endswith('.txt'):
                resume_text = uploaded.read().decode('utf-8', errors='ignore')
            elif uploaded.name.endswith('.pdf'):
                try:
                    import pdfplumber
                    import io
                    with pdfplumber.open(io.BytesIO(uploaded.read())) as pdf:
                        resume_text = '\n'.join(p.extract_text() or '' for p in pdf.pages)
                except ImportError:
                    st.error("Install pdfplumber: pip install pdfplumber")
            elif uploaded.name.endswith('.docx'):
                try:
                    import docx
                    import io
                    doc = docx.Document(io.BytesIO(uploaded.read()))
                    resume_text = '\n'.join(p.text for p in doc.paragraphs)
                except ImportError:
                    st.error("Install python-docx: pip install python-docx")
            if resume_text:
                st.success(f"Extracted {len(resume_text)} characters")

    if st.button("🔍 Extract Skills & Find Matches", use_container_width=True) and resume_text:
        parser = ResumeParser()
        result = parser.parse_text(resume_text)

        st.markdown("---")
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Skills Found", result['total_skills'])
        c2.metric("Experience", f"{result['experience_years']} yrs")
        c3.metric("Education", result['education'])
        c4.metric("Categories", len(result['skill_categories']))

        st.markdown("### 🎯 Extracted Skills")
        for cat, cat_skills in result['skill_categories'].items():
            tags = ' '.join(f'<span class="skill-tag">{s}</span>' for s in cat_skills)
            st.markdown(f"**{cat.replace('_', ' ').title()}:** {tags}", unsafe_allow_html=True)

        st.markdown("### 📊 Matched Internships")
        matcher = SkillMatcher(internships)
        matches = matcher.match(result, top_n=15)

        for i, m in enumerate(matches):
            intern = m['internship']
            match_score = m['match_score']
            color = '#34D399' if match_score >= 70 else ('#818CF8' if match_score >= 50 else '#FBBF24')
            is_live = intern.get('is_live', False)
            source = intern.get('source', 'Generated')
            live_html = f' <span class="live-badge" style="font-size:0.6rem"><div class="live-dot"></div>{source}</span>' if is_live else ''

            st.markdown(f"""
            <div style="background:#161B22; border:1px solid #30363D; border-radius:12px;
                        padding:1rem; margin:0.5rem 0; border-left:4px solid {color}">
                <div style="display:flex; justify-content:space-between">
                    <span style="color:#E6EDF3; font-weight:700">#{i+1} {intern['title']}
                        <span style="color:#818CF8">at {intern['company']}</span>{live_html}</span>
                    <span style="background:{color}20; color:{color}; padding:2px 12px;
                                border-radius:16px; font-weight:700">{match_score}%</span>
                </div>
                <div style="color:#8B949E; margin-top:4px">
                    📍 {intern['city']} • 💼 {intern['domain']} • 💰 ₹{intern['stipend']:,}/mo •
                    Skills: {m['skill_overlap']}
                </div>
            </div>
            """, unsafe_allow_html=True)

            tags = ''
            for sk in m['matched_skills']:
                tags += f'<span class="match-tag">✓ {sk}</span> '
            for sk in m['missing_skills'][:5]:
                tags += f'<span class="miss-tag">✗ {sk}</span> '
            st.markdown(tags, unsafe_allow_html=True)

        st.markdown("### 📈 Skill Gap Analysis")
        gaps = matcher.skill_gap(result)
        if gaps:
            import plotly.express as px
            gap_df = pd.DataFrame(gaps[:15], columns=['Skill', 'Demand'])
            fig = px.bar(gap_df, x='Demand', y='Skill', orientation='h', title="Top Skills to Learn",
                         color='Demand', color_continuous_scale='Reds')
            fig.update_layout(**DARK_LAYOUT)
            st.plotly_chart(fig, use_container_width=True)

elif page == "🔬 ML Pipeline":
    st.markdown("# 🔬 ML Pipeline")
    st.markdown(f"Run the complete ML pipeline on **{len(df):,}** internship records.")

    c1, c2, c3 = st.columns(3)

    with c1:
        st.markdown("### 🔬 EDA")
        st.markdown("11-phase exploratory analysis")
        if st.button("Run EDA", use_container_width=True):
            with st.spinner("Running EDA on 30K+ records..."):
                try:
                    from eda_process import InternshipEDA
                    eda = InternshipEDA()
                    report = eda.run_all(df)
                    st.success("EDA Complete!")
                    st.json(report['phases'].get('phase_1', {}).get('details', {}))
                except Exception as e:
                    st.error(f"Error: {e}")

    with c2:
        st.markdown("### 🔧 Preprocessing")
        st.markdown("14-phase data preprocessing")
        if st.button("Run Preprocessing", use_container_width=True):
            with st.spinner("Preprocessing 30K+ records..."):
                try:
                    from preprocessing import InternshipPreprocessor
                    prep = InternshipPreprocessor()
                    prep.run_all(df)
                    st.success("Preprocessing Complete! Output: preprocessing_output/")
                except Exception as e:
                    st.error(f"Error: {e}")

    with c3:
        st.markdown("### 🧠 Model Training")
        st.markdown("Train 8 ML models")
        if st.button("Train Models", use_container_width=True):
            with st.spinner("Training 8 models..."):
                try:
                    from model_training import ModelTrainer
                    trainer = ModelTrainer()
                    trainer.run_all()
                    st.success("Training Complete! Output: model_output/")
                except Exception as e:
                    st.error(f"Error: {e}")

    st.markdown("---")
    if st.button("🔮 Run Full Pipeline (EDA → Preprocess → Train)", use_container_width=True):
        with st.spinner("Running full pipeline on 30K+ records..."):
            try:
                from eda_process import InternshipEDA
                from preprocessing import InternshipPreprocessor
                from model_training import ModelTrainer

                st.write("Step 1/3: EDA...")
                InternshipEDA().run_all(df)

                st.write("Step 2/3: Preprocessing...")
                InternshipPreprocessor().run_all(df)

                st.write("Step 3/3: Model Training...")
                ModelTrainer().run_all()

                st.success("🎉 Full Pipeline Complete!")
            except Exception as e:
                st.error(f"Error: {e}")

    st.markdown("---")
    st.markdown("### 🔄 Fetch Fresh Live Data")
    if st.button("🌐 Fetch from APIs Now", use_container_width=True):
        with st.spinner("Fetching from 5 APIs..."):
            try:
                from live_data_fetcher import LiveDataFetcher
                fetcher = LiveDataFetcher()
                live_data = fetcher.fetch_all()
                status = fetcher.get_status()
                st.success(f"Fetched {len(live_data)} live listings!")
                for log in status['sources']:
                    icon = '✅' if log['status'] == 'success' else ('📦' if log['status'] == 'cached' else '❌')
                    st.write(f"{icon} **{log['source']}**: {log['count']} listings ({log['status']})")
                st.cache_data.clear()
                st.info("Click 'Refresh Live Data' in sidebar to reload with new data")
            except Exception as e:
                st.error(f"Error: {e}")

elif page == "📥 Export":
    st.markdown("# 📥 Export Data")
    st.markdown(f"**{len(df):,}** internships ({live_count} live + {gen_count} generated)")

    c1, c2 = st.columns(2)
    with c1:
        csv = df.to_csv(index=False)
        st.download_button("📄 Download Full CSV", csv, "internships_30k.csv", "text/csv",
                          use_container_width=True)
    with c2:
        json_str = df.head(1000).to_json(orient='records', indent=2)
        st.download_button("📋 Download JSON (1K sample)", json_str, "internships_sample.json",
                          "application/json", use_container_width=True)

    st.markdown("---")

    if 'source' in df.columns:
        st.markdown("### Export by Source")
        for source in df['source'].unique():
            src_df = df[df['source'] == source]
            src_csv = src_df.to_csv(index=False)
            is_live = source != 'Generated'
            icon = '🟢' if is_live else '⚪'
            st.download_button(f"{icon} Download {source} ({len(src_df):,})",
                             src_csv, f"internships_{source.lower().replace(' ','_')}.csv",
                             "text/csv", key=f"dl_{source}")

    st.markdown("---")
    st.markdown("### Data Preview")
    st.dataframe(df.head(100), use_container_width=True)