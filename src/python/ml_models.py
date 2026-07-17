"""
InternMatch AI - ML Inference Engines
"""


class DemandPredictor:
    def predict(self, internship):
        score = 50
        s = internship.get('stipend', 0)
        if s >= 50000: score += 20
        elif s >= 30000: score += 12
        elif s >= 15000: score += 5
        if internship.get('type') == 'Remote': score += 10
        elif internship.get('type') == 'Hybrid': score += 7
        high = ['Data Science', 'Machine Learning', 'AI Research', 'Web Development']
        if internship.get('domain') in high: score += 15
        top = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad']
        if internship.get('city') in top: score += 8
        if internship.get('rating', 0) >= 4.5: score += 5
        return min(score, 100)

    def get_factors(self, internship):
        f = []
        if internship.get('stipend', 0) >= 30000: f.append('High stipend')
        if internship.get('type') == 'Remote': f.append('Remote work')
        if internship.get('domain') in ['Data Science', 'Machine Learning']: f.append('Trending domain')
        if internship.get('rating', 0) >= 4.5: f.append('Top rated')
        return f


class RecommendationEngine:
    def recommend(self, student, internships, top_n=20):
        results = []
        for i in internships:
            score = self._score(student, i)
            results.append({'internship': i, 'score': score})
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_n]

    def _score(self, student, intern):
        score = 0
        s_skills = [s.lower() for s in student.get('skills', [])]
        i_skills_str = intern.get('skills', '')
        i_skills = [s.strip().lower() for s in i_skills_str.split(', ') if s.strip()]
        matched = sum(1 for s in s_skills if any(s in i or i in s for i in i_skills))
        if i_skills: score += (matched / len(i_skills)) * 40
        interests = [i.lower() for i in student.get('interests', [])]
        if any(i in intern.get('domain', '').lower() for i in interests): score += 25
        if intern.get('type') == 'Remote': score += 15
        elif student.get('location', '').lower() in intern.get('city', '').lower(): score += 15
        pt = student.get('preferredType', 'Any')
        if pt == 'Any' or pt == intern.get('type'): score += 10
        if intern.get('stipend', 0) >= student.get('minStipend', 0): score += 10
        return min(round(score, 1), 100)


class AnalyticsEngine:
    def summarize(self, internships):
        total = len(internships)
        apps = sum(i.get('applications', 0) for i in internships)
        avg_s = sum(i.get('stipend', 0) for i in internships) / max(total, 1)
        domains, cities, skills = {}, {}, {}
        for i in internships:
            d = i.get('domain', '')
            domains[d] = domains.get(d, 0) + 1
            c = i.get('city', '')
            cities[c] = cities.get(c, 0) + 1
            for s in str(i.get('skills', '')).split(', '):
                s = s.strip()
                if s: skills[s] = skills.get(s, 0) + 1
        return {
            'total': total, 'applications': apps, 'avg_stipend': round(avg_s),
            'top_domains': dict(sorted(domains.items(), key=lambda x: -x[1])[:10]),
            'top_cities': dict(sorted(cities.items(), key=lambda x: -x[1])[:10]),
            'top_skills': dict(sorted(skills.items(), key=lambda x: -x[1])[:15]),
        }


if __name__ == '__main__':
    from internship_data import generate_internships
    data = generate_internships(1000)
    p = DemandPredictor()
    print(f"Demand: {p.predict(data[0])}")
    e = RecommendationEngine()
    student = {'skills': ['Python', 'React', 'SQL'], 'interests': ['Data Science'],
               'location': 'Bangalore', 'preferredType': 'Remote', 'minStipend': 10000}
    recs = e.recommend(student, data, 5)
    for r in recs:
        print(f"  {r['internship']['title']} - {r['score']}%")
    a = AnalyticsEngine()
    print(f"Analytics: {a.summarize(data)['total']} listings")