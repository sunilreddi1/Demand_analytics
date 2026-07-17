"""
InternMatch AI - Internship Data Generator
Combines LIVE API data + generated data = 30,000+ listings
Skills stored as comma-separated strings (NOT lists)
"""

import math
import random
import os
import json
from datetime import datetime


COMPANIES = [
    'Google India', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Zoho',
    'Razorpay', 'Swiggy', 'Zomato', 'PhonePe', 'CRED', 'Paytm', 'Freshworks', "Byju's",
    'Ola', 'Meesho', 'Groww', 'Zerodha', 'Reliance Digital', 'Tata Digital', 'Accenture India',
    'Deloitte India', 'IBM India', 'Cognizant', 'HCL Tech', 'Tech Mahindra', 'Capgemini',
    'Oracle India', 'SAP India', 'Salesforce India', 'Adobe India', 'Intel India', 'Samsung India',
    'Nvidia India', 'Qualcomm India', 'Goldman Sachs', 'JP Morgan', 'Morgan Stanley',
    'Uber India', 'Dream11', 'Unacademy', 'PhysicsWallah', 'BigBasket', 'Nykaa',
    'PolicyBazaar', 'Cars24', 'Lenskart', 'boAt', 'UpGrad', 'InMobi', 'MakeMyTrip',
    'Oyo Rooms', 'Pine Labs', 'BrowserStack', 'Postman', 'Chargebee', 'Mindtree',
    'Mphasis', 'LTIMindtree', 'Persistent Systems', 'Coforge', 'NIIT', 'Hexaware',
    'Zensar', 'Birlasoft', 'Cyient', 'KPIT', 'Happiest Minds', 'Tata Elxsi',
    'Ericsson India', 'Nokia India', 'Cisco India', 'VMware India', 'Dell India',
    'HP India', 'Lenovo India', 'Jio Platforms', 'Airtel Digital', 'Snapdeal',
    'Dunzo', 'Cure.fit', 'Simplilearn', 'Vedantu', 'Ola Electric',
    'Route Mobile', 'Quick Heal', 'NetApp India', 'Micron India', 'Seagate India',
    'Western Digital', 'Xiaomi India', 'OnePlus India', 'Oppo India', 'Vivo India',
    'Sonata Software', 'Newgen Software', 'Tanla Platforms', 'Amdocs India', 'LTTS',
]

DOMAINS = [
    'Software Development', 'Data Science', 'Machine Learning', 'Web Development',
    'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design',
    'Digital Marketing', 'Product Management', 'DevOps', 'Blockchain',
    'IoT', 'AI Research', 'Business Analytics', 'Game Development',
    'AR/VR Development', 'Robotics', 'Natural Language Processing', 'Computer Vision',
    'Data Engineering', 'Full Stack Development', 'Backend Development',
    'Frontend Development', 'Quality Assurance', 'Technical Writing',
    'Network Engineering', 'IT Support', 'Embedded Systems', 'Quantum Computing',
]

CITIES = [
    ('Bangalore', 'Karnataka'), ('Mumbai', 'Maharashtra'), ('Delhi NCR', 'Delhi'),
    ('Hyderabad', 'Telangana'), ('Pune', 'Maharashtra'), ('Chennai', 'Tamil Nadu'),
    ('Kolkata', 'West Bengal'), ('Ahmedabad', 'Gujarat'), ('Jaipur', 'Rajasthan'),
    ('Kochi', 'Kerala'), ('Noida', 'Uttar Pradesh'), ('Gurgaon', 'Haryana'),
    ('Chandigarh', 'Punjab'), ('Indore', 'Madhya Pradesh'), ('Lucknow', 'Uttar Pradesh'),
    ('Coimbatore', 'Tamil Nadu'), ('Thiruvananthapuram', 'Kerala'),
    ('Bhubaneswar', 'Odisha'), ('Visakhapatnam', 'Andhra Pradesh'),
    ('Nagpur', 'Maharashtra'), ('Mysore', 'Karnataka'), ('Vadodara', 'Gujarat'),
    ('Surat', 'Gujarat'), ('Patna', 'Bihar'), ('Ranchi', 'Jharkhand'),
    ('Dehradun', 'Uttarakhand'), ('Guwahati', 'Assam'), ('Mangalore', 'Karnataka'),
    ('Hubli', 'Karnataka'), ('Vijayawada', 'Andhra Pradesh'),
]

ALL_SKILLS = [
    'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch', 'Figma', 'Adobe XD',
    'Git', 'REST APIs', 'GraphQL', 'TypeScript', 'Flutter', 'Swift', 'Kotlin',
    'Go', 'Rust', 'R', 'Tableau', 'Power BI', 'Excel', 'Spark', 'Hadoop',
    'Linux', 'Agile', 'Scrum', 'JIRA', 'HTML/CSS', 'Angular', 'Vue.js',
    'Django', 'Flask', 'Spring Boot', 'PostgreSQL', 'Redis', 'Elasticsearch',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Blockchain',
    'Solidity', 'SEO', 'Google Analytics', 'Selenium', 'Jest', 'Pytest',
    'CI/CD', 'Terraform', 'Ansible', 'Nginx', 'FastAPI', 'Express.js',
    'Next.js', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Pandas',
    'NumPy', 'Scikit-learn', 'Keras', 'OpenCV', 'Matplotlib', 'Seaborn',
    'Plotly', 'Airflow', 'Kafka', 'Firebase', 'Azure', 'GCP',
    'Jenkins', 'GitHub Actions', 'Postman', 'Cypress', 'Playwright',
    'Unity', 'Unreal Engine', 'MATLAB', 'Arduino', 'Raspberry Pi',
    'Content Writing', 'Sass', 'Webpack', 'Vite', 'RabbitMQ',
]

TITLES = {
    'Software Development': ['Software Engineer Intern', 'Backend Developer Intern', 'Full Stack Intern'],
    'Data Science': ['Data Science Intern', 'Data Analyst Intern', 'BI Analyst Intern'],
    'Machine Learning': ['ML Engineer Intern', 'AI Intern', 'Deep Learning Intern'],
    'Web Development': ['Frontend Developer Intern', 'React Developer Intern', 'Web Developer Intern'],
    'Mobile Development': ['Android Developer Intern', 'iOS Developer Intern', 'Flutter Developer Intern'],
    'Cloud Computing': ['Cloud Engineer Intern', 'AWS Solutions Intern', 'Cloud Architect Intern'],
    'Cybersecurity': ['Security Analyst Intern', 'Cybersecurity Intern', 'SOC Analyst Intern'],
    'UI/UX Design': ['UI/UX Designer Intern', 'Product Designer Intern', 'Visual Designer Intern'],
    'Digital Marketing': ['Digital Marketing Intern', 'SEO Specialist Intern', 'Growth Intern'],
    'Product Management': ['Product Manager Intern', 'APM Intern', 'Business Analyst Intern'],
    'DevOps': ['DevOps Engineer Intern', 'SRE Intern', 'Platform Engineer Intern'],
    'Blockchain': ['Blockchain Developer Intern', 'Web3 Developer Intern', 'Smart Contract Intern'],
    'IoT': ['IoT Engineer Intern', 'Embedded Systems Intern', 'Hardware Intern'],
    'AI Research': ['AI Research Intern', 'NLP Engineer Intern', 'CV Engineer Intern'],
    'Business Analytics': ['Business Analyst Intern', 'Analytics Intern', 'Strategy Intern'],
    'Game Development': ['Game Developer Intern', 'Unity Developer Intern', 'Game Designer Intern'],
    'Data Engineering': ['Data Engineer Intern', 'ETL Developer Intern', 'Pipeline Engineer Intern'],
    'Full Stack Development': ['Full Stack Developer Intern', 'MERN Stack Intern', 'MEAN Stack Intern'],
    'Backend Development': ['Backend Developer Intern', 'API Developer Intern', 'Server Engineer Intern'],
    'Frontend Development': ['Frontend Developer Intern', 'UI Developer Intern', 'React Intern'],
    'Quality Assurance': ['QA Engineer Intern', 'Test Automation Intern', 'SDET Intern'],
}

STIPENDS = [3000, 5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000,
            30000, 35000, 40000, 50000, 60000, 75000, 80000, 100000]
DURATIONS = ['1 Month', '2 Months', '3 Months', '4 Months', '6 Months', '12 Months']
TYPES = ['Remote', 'On-site', 'Hybrid']


def _sr(seed):
    x = math.sin(seed) * 10000
    return x - math.floor(x)


def _pick(arr, seed):
    return arr[int(_sr(seed) * len(arr))]


def _load_live_data():
    """Load cached live data if available."""
    cache_path = os.path.join('live_data', 'all_combined_cache.json')
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"  Loaded {len(data)} live listings from cache")
            return data
        except Exception:
            pass
    return []


def generate_internships(count=30000, include_live=True):
    """Generate internship data. Combines live + generated to reach count."""

    all_data = []

    # Step 1: Load live data
    live_count = 0
    if include_live:
        live_data = _load_live_data()
        if live_data:
            all_data.extend(live_data)
            live_count = len(live_data)

    # Step 2: Try fetching fresh live data if none cached
    if live_count == 0 and include_live:
        try:
            from live_data_fetcher import LiveDataFetcher
            fetcher = LiveDataFetcher()
            live_data = fetcher.fetch_all()
            if live_data:
                all_data.extend(live_data)
                live_count = len(live_data)
        except Exception:
            pass

    # Step 3: Generate remaining to reach target count
    remaining = max(count - len(all_data), 0)
    start_id = max((d.get('id', 0) for d in all_data), default=0) + 1

    for i in range(remaining):
        seed = (start_id + i) * 137 + 42
        company = COMPANIES[(start_id + i) % len(COMPANIES)]
        domain = _pick(DOMAINS, seed + 1)
        city, state = CITIES[int(_sr(seed + 2) * len(CITIES))]
        work_type = _pick(TYPES, seed + 3)
        domain_titles = TITLES.get(domain, [f'{domain} Intern'])
        title = _pick(domain_titles, seed + 4)

        num_skills = 3 + int(_sr(seed + 5) * 4)
        skill_set = set()
        for j in range(num_skills + 3):
            idx = int(_sr(seed + 10 + j) * len(ALL_SKILLS))
            skill_set.add(ALL_SKILLS[idx])
            if len(skill_set) >= num_skills:
                break
        skills_str = ', '.join(sorted(skill_set))

        stipend = _pick(STIPENDS, seed + 6)
        duration = _pick(DURATIONS, seed + 7)
        applications = int(_sr(seed + 8) * 4500) + 50
        rating = round(3.0 + _sr(seed + 9) * 2.0, 1)
        openings = int(_sr(seed + 11) * 25) + 1
        month = int(_sr(seed + 12) * 12) + 1
        day = int(_sr(seed + 13) * 28) + 1
        demand_score = round(
            stipend / 100000 * 30 + applications / 4500 * 40 +
            rating / 5 * 20 + _sr(seed + 14) * 10, 1)
        growth_trend = round(_sr(seed + 15) * 40 - 5, 1)

        all_data.append({
            'id': start_id + i,
            'company': company,
            'title': title,
            'domain': domain,
            'city': city,
            'state': state,
            'location': f'{city}, {state}',
            'type': work_type,
            'stipend': stipend,
            'duration': duration,
            'skills': skills_str,
            'applications': applications,
            'rating': rating,
            'openings': openings,
            'posted_date': f'2025-{month:02d}-{day:02d}',
            'deadline': f'2025-{min(month + 2, 12):02d}-{day:02d}',
            'demand_score': demand_score,
            'growth_trend': growth_trend,
            'source': 'Generated',
            'is_live': False,
        })

    print(f"  Total: {len(all_data)} internships ({live_count} live + {remaining} generated)")
    return all_data


if __name__ == '__main__':
    data = generate_internships()
    print(f"Generated {len(data)} internships")
    print(f"Companies: {len(set(d['company'] for d in data))}")
    print(f"Domains: {len(set(d['domain'] for d in data))}")
    print(f"Cities: {len(set(d['city'] for d in data))}")
    sources = {}
    for d in data:
        src = d.get('source', 'Unknown')
        sources[src] = sources.get(src, 0) + 1
    print(f"Sources: {sources}")
    print(f"Skills type: {type(data[0]['skills'])}")
    print(f"Sample: {data[0]}")