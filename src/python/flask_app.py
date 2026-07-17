"""InternMatch AI - Flask REST API with Live Data"""

import json
import os
from flask import Flask, request, jsonify
try:
    from flask_cors import CORS
    has_cors = True
except ImportError:
    has_cors = False

from internship_data import generate_internships
from ml_models import DemandPredictor, RecommendationEngine, AnalyticsEngine
from resume_parser import ResumeParser, SkillMatcher

app = Flask(__name__)
if has_cors:
    CORS(app)

print("Loading 30,000+ internships (live + generated)...")
internships = generate_internships(30000, include_live=True)
predictor = DemandPredictor()
recommender = RecommendationEngine()
analytics = AnalyticsEngine()
parser = ResumeParser()
matcher = SkillMatcher(internships)

# Persist applied applications to a JSON file so users' applied lists survive restarts
applied_file = os.path.join(os.path.dirname(__file__), 'applied_applications.json')
try:
    if os.path.exists(applied_file):
        with open(applied_file, 'r', encoding='utf-8') as f:
            applied_ids = set(json.load(f))
    else:
        applied_ids = set()
except Exception:
    applied_ids = set()

def save_applied():
    try:
        with open(applied_file, 'w', encoding='utf-8') as f:
            json.dump(list(applied_ids), f)
    except Exception:
        pass

live_count = len([i for i in internships if i.get('is_live', False)])
gen_count = len(internships) - live_count
print(f"Ready! {len(internships)} internships ({live_count} live + {gen_count} generated)")


@app.route('/')
def home():
    return jsonify({
        'status': 'InternMatch AI API',
        'total': len(internships),
        'live': live_count,
        'generated': gen_count,
    })


@app.route('/api/internships')
def get_internships():
    page = int(request.args.get('page', 1))
    per = int(request.args.get('per_page', 30))
    domain = request.args.get('domain', '')
    city = request.args.get('city', '')
    source = request.args.get('source', '')
    search = request.args.get('search', '').lower()
    live_only = request.args.get('live_only', '').lower() == 'true'
    data = internships
    if live_only: data = [i for i in data if i.get('is_live', False)]
    if domain: data = [i for i in data if i['domain'] == domain]
    if city: data = [i for i in data if i['city'] == city]
    if source: data = [i for i in data if i.get('source', '') == source]
    if search: data = [i for i in data if search in i['title'].lower() or
                       search in i['company'].lower() or search in str(i['skills']).lower()]
    total = len(data)
    start = (page - 1) * per
    return jsonify({'data': data[start:start + per], 'total': total, 'page': page})


@app.route('/api/predict', methods=['POST'])
def predict():
    d = request.get_json()
    return jsonify({'score': predictor.predict(d), 'factors': predictor.get_factors(d)})


@app.route('/api/recommend', methods=['POST'])
def recommend():
    s = request.get_json()
    r = recommender.recommend(s, internships, 20)
    return jsonify({'recommendations': [{'internship': x['internship'], 'score': x['score']} for x in r]})


@app.route('/api/analytics')
def get_analytics():
    summary = analytics.summarize(internships)
    summary['live_count'] = live_count
    summary['generated_count'] = gen_count
    return jsonify(summary)


@app.route('/api/resume/parse', methods=['POST'])
def parse_resume():
    return jsonify(parser.parse_text(request.get_json().get('text', '')))


@app.route('/api/resume/search', methods=['POST'])
def resume_search():
    parsed = parser.parse_text(request.get_json().get('text', ''))
    matches = matcher.match(parsed, 20)
    return jsonify({'parsed': parsed, 'matches': matches})


@app.route('/api/domains')
def domains():
    return jsonify(sorted(set(i['domain'] for i in internships)))


@app.route('/api/cities')
def cities():
    return jsonify(sorted(set(i['city'] for i in internships)))


@app.route('/api/skills')
def skills():
    s = set()
    for i in internships:
        for sk in str(i['skills']).split(', '):
            if sk.strip(): s.add(sk.strip())
    return jsonify(sorted(s))


@app.route('/api/applied', methods=['GET'])
def get_applied():
    return jsonify({'applied': sorted(list(applied_ids))})


@app.route('/api/applied', methods=['POST'])
def modify_applied():
    try:
        d = request.get_json() or {}
        item_id = int(d.get('id'))
        action = d.get('action', 'add')
        if action == 'add':
            applied_ids.add(item_id)
        elif action == 'remove':
            applied_ids.discard(item_id)
        save_applied()
        return jsonify({'status': 'ok', 'applied': sorted(list(applied_ids))})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 400


@app.route('/api/sources')
def sources():
    src = {}
    for i in internships:
        s = i.get('source', 'Unknown')
        src[s] = src.get(s, 0) + 1
    return jsonify(src)


@app.route('/api/live/fetch')
def fetch_live():
    try:
        from live_data_fetcher import LiveDataFetcher
        fetcher = LiveDataFetcher()
        data = fetcher.fetch_all()
        return jsonify({'fetched': len(data), 'status': fetcher.get_status()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/live/status')
def live_status():
    return jsonify({
        'total': len(internships),
        'live': live_count,
        'generated': gen_count,
        'sources': dict(sorted(
            {i.get('source', 'Unknown'): 0 for i in internships}.items()
        ))
    })


if __name__ == '__main__':
    host_ip = os.environ.get('FLASK_RUN_HOST', '192.168.1.123')  # set to your specific interface
    port = int(os.environ.get('FLASK_RUN_PORT', 5000))
    app.run(debug=True, host=host_ip, port=port)