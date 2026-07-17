"""
InternMatch AI - Resume Parser & Skill Extraction
"""

import re
import os


class ResumeParser:
    SKILLS = {
        'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'go', 'rust', 'r',
                        'kotlin', 'swift', 'ruby', 'php', 'scala', 'dart', 'matlab',
                        'perl', 'typescript', 'shell', 'bash'],
        'web': ['react', 'angular', 'vue.js', 'vue', 'next.js', 'svelte', 'html',
                'css', 'html/css', 'jquery', 'bootstrap', 'tailwind', 'sass', 'redux'],
        'backend': ['node.js', 'django', 'flask', 'spring boot', 'express.js', 'fastapi',
                    'asp.net', 'rails', 'laravel', 'nestjs', 'graphql', 'rest api',
                    'rest apis', 'grpc'],
        'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
                     'firebase', 'dynamodb', 'cassandra', 'sqlite', 'oracle', 'neo4j'],
        'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
                  'ci/cd', 'ansible', 'nginx', 'linux', 'git', 'github', 'heroku', 'vercel'],
        'ml_ai': ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
                  'nlp', 'computer vision', 'opencv', 'scikit-learn', 'pandas', 'numpy',
                  'matplotlib', 'seaborn', 'plotly', 'transformers', 'bert', 'gpt', 'llm'],
        'mobile': ['flutter', 'react native', 'android', 'ios', 'swift', 'kotlin', 'xamarin'],
        'design': ['figma', 'adobe xd', 'sketch', 'photoshop', 'ui/ux', 'wireframing'],
        'tools': ['jira', 'agile', 'scrum', 'confluence', 'postman', 'swagger', 'trello'],
        'testing': ['selenium', 'jest', 'pytest', 'cypress', 'playwright', 'junit'],
        'blockchain': ['blockchain', 'solidity', 'web3', 'ethereum', 'smart contracts'],
    }

    EXP_PATTERNS = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)',
        r'experience\s*(?:of\s*)?(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:in|of|working)',
    ]

    EDU_PATTERNS = [
        (r'ph\.?d|doctorate', 'PhD'),
        (r'm\.?tech|m\.?s|master|mca|mba', 'Masters'),
        (r'b\.?tech|b\.?e|b\.?s|bachelor|bca|b\.?sc', 'Bachelors'),
        (r'diploma|polytechnic', 'Diploma'),
    ]

    def parse_text(self, text):
        text_lower = text.lower()
        found = {}
        for cat, skills in self.SKILLS.items():
            for skill in skills:
                pattern = r'\b' + re.escape(skill) + r'\b'
                matches = re.findall(pattern, text_lower)
                if matches:
                    count = len(matches)
                    conf = 'High' if count >= 3 else ('Medium' if count >= 2 else 'Low')
                    name = skill.title() if len(skill) > 3 else skill.upper()
                    found[name] = {'category': cat, 'count': count, 'confidence': conf}

        exp = 0
        for p in self.EXP_PATTERNS:
            m = re.findall(p, text_lower)
            if m:
                exp = max(int(x) for x in m)
                break

        edu = 'Not detected'
        for p, level in self.EDU_PATTERNS:
            if re.search(p, text_lower):
                edu = level
                break

        categories = {}
        for skill, info in found.items():
            cat = info['category']
            categories.setdefault(cat, []).append(skill)

        return {
            'skills': list(found.keys()),
            'skill_details': found,
            'experience_years': exp,
            'education': edu,
            'total_skills': len(found),
            'skill_categories': categories,
        }

    def parse_file(self, path):
        ext = os.path.splitext(path)[1].lower()
        if ext == '.txt':
            with open(path, 'r', errors='ignore') as f:
                return self.parse_text(f.read())
        elif ext == '.pdf':
            try:
                import pdfplumber
                with pdfplumber.open(path) as pdf:
                    text = '\n'.join(p.extract_text() or '' for p in pdf.pages)
                return self.parse_text(text)
            except ImportError:
                try:
                    import PyPDF2
                    with open(path, 'rb') as f:
                        reader = PyPDF2.PdfReader(f)
                        text = '\n'.join(p.extract_text() or '' for p in reader.pages)
                    return self.parse_text(text)
                except ImportError:
                    raise ImportError("Install: pip install pdfplumber")
        elif ext in ['.docx', '.doc']:
            try:
                import docx
                doc = docx.Document(path)
                text = '\n'.join(p.text for p in doc.paragraphs)
                return self.parse_text(text)
            except ImportError:
                raise ImportError("Install: pip install python-docx")
        raise ValueError(f"Unsupported: {ext}")


class SkillMatcher:
    def __init__(self, internships):
        self.internships = internships

    def match(self, parsed, top_n=20):
        student_skills = [s.lower() for s in parsed['skills']]
        results = []
        for intern in self.internships:
            i_skills = [s.strip().lower() for s in str(intern.get('skills', '')).split(', ') if s.strip()]
            if not i_skills:
                continue
            matched = [s for s in student_skills if any(s in i or i in s for i in i_skills)]
            missing = [s for s in i_skills if not any(s in ss or ss in s for ss in student_skills)]
            score = len(matched) / max(len(i_skills), 1) * 100
            if any(s in intern.get('domain', '').lower() for s in student_skills):
                score += 10
            if intern.get('type') == 'Remote':
                score += 5
            results.append({
                'internship': intern,
                'match_score': round(min(score, 100), 1),
                'matched_skills': matched,
                'missing_skills': missing,
                'skill_overlap': f"{len(matched)}/{len(i_skills)}",
            })
        results.sort(key=lambda x: x['match_score'], reverse=True)
        return results[:top_n]

    def skill_gap(self, parsed, domain=None):
        student = set(s.lower() for s in parsed['skills'])
        gaps = {}
        for i in self.internships:
            if domain and domain.lower() not in i.get('domain', '').lower():
                continue
            for s in str(i.get('skills', '')).split(', '):
                s = s.strip()
                if s and s.lower() not in student:
                    gaps[s] = gaps.get(s, 0) + 1
        return sorted(gaps.items(), key=lambda x: -x[1])[:20]


if __name__ == '__main__':
    sample = """
    John Doe - Software Engineer
    B.Tech Computer Science, IIT Delhi 2024
    3 years of experience in software development

    Skills: Python, JavaScript, React, Node.js, TypeScript, Django, Flask,
    SQL, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Git,
    Machine Learning, TensorFlow, PyTorch, Pandas, NumPy,
    HTML/CSS, REST APIs, GraphQL, Agile, JIRA
    """
    parser = ResumeParser()
    result = parser.parse_text(sample)
    print(f"Skills: {result['total_skills']}")
    print(f"Experience: {result['experience_years']} years")
    print(f"Education: {result['education']}")
    for cat, skills in result['skill_categories'].items():
        print(f"  {cat}: {', '.join(skills)}")

    try:
        from internship_data import generate_internships
        data = generate_internships(5000)
        matcher = SkillMatcher(data)
        matches = matcher.match(result, top_n=5)
        print(f"\nTop matches:")
        for m in matches:
            print(f"  {m['internship']['title']} at {m['internship']['company']} - {m['match_score']}%")
        gaps = matcher.skill_gap(result)
        print(f"\nSkill gaps:")
        for s, c in gaps[:10]:
            print(f"  {s}: needed in {c} listings")
    except ImportError:
        pass