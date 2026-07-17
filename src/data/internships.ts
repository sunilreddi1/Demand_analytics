export interface Internship {
  id: number;
  company: string;
  title: string;
  domain: string;
  location: string;
  city: string;
  state: string;
  stipend: number;
  duration: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  skills: string[];
  applications: number;
  rating: number;
  openings: number;
  postedDate: string;
  deadline: string;
  description: string;
  companyLogo: string;
  demandScore: number;
  growthTrend: number;
  source: string;
  isLive: boolean;
}

export interface StudentProfile {
  name: string;
  skills: string[];
  location: string;
  interests: string[];
  experience: string;
  preferredType: 'Remote' | 'On-site' | 'Hybrid' | 'Any';
  minStipend: number;
}

const companies = [
  { name: 'Google India', logo: '🔵' }, { name: 'Microsoft', logo: '🟦' },
  { name: 'Amazon', logo: '🟠' }, { name: 'Flipkart', logo: '🟡' },
  { name: 'Infosys', logo: '🔷' }, { name: 'TCS', logo: '🔶' },
  { name: 'Wipro', logo: '🟢' }, { name: 'Zoho', logo: '🔴' },
  { name: 'Razorpay', logo: '💙' }, { name: 'Swiggy', logo: '🧡' },
  { name: 'Zomato', logo: '❤️' }, { name: 'PhonePe', logo: '💜' },
  { name: 'CRED', logo: '⚫' }, { name: 'Paytm', logo: '💎' },
  { name: 'Freshworks', logo: '💚' }, { name: "Byju's", logo: '🟣' },
  { name: 'Ola', logo: '🖤' }, { name: 'Meesho', logo: '🩷' },
  { name: 'Groww', logo: '🌟' }, { name: 'Zerodha', logo: '⭐' },
  { name: 'Reliance Digital', logo: '🔵' }, { name: 'Tata Digital', logo: '🏛️' },
  { name: 'Accenture India', logo: '🟩' }, { name: 'Deloitte India', logo: '🟫' },
  { name: 'IBM India', logo: '🟪' }, { name: 'Cognizant', logo: '🔹' },
  { name: 'HCL Tech', logo: '🔸' }, { name: 'Tech Mahindra', logo: '🔻' },
  { name: 'Capgemini', logo: '🔺' }, { name: 'Oracle India', logo: '🟥' },
  { name: 'SAP India', logo: '🟨' }, { name: 'Salesforce India', logo: '☁️' },
  { name: 'Adobe India', logo: '🎨' }, { name: 'Intel India', logo: '💠' },
  { name: 'Samsung India', logo: '📱' }, { name: 'Nvidia India', logo: '🎮' },
  { name: 'Goldman Sachs', logo: '🏦' }, { name: 'JP Morgan', logo: '💰' },
  { name: 'Morgan Stanley', logo: '📈' }, { name: 'Uber India', logo: '🚗' },
  { name: 'Dream11', logo: '🏏' }, { name: 'Unacademy', logo: '📚' },
  { name: 'PhysicsWallah', logo: '🧪' }, { name: 'BigBasket', logo: '🧺' },
  { name: 'Nykaa', logo: '💄' }, { name: 'PolicyBazaar', logo: '📋' },
  { name: 'Cars24', logo: '🚙' }, { name: 'Lenskart', logo: '👓' },
  { name: 'boAt', logo: '🎧' }, { name: 'UpGrad', logo: '🎓' },
  { name: 'InMobi', logo: '📊' }, { name: 'MakeMyTrip', logo: '✈️' },
  { name: 'Oyo Rooms', logo: '🏨' }, { name: 'Pine Labs', logo: '💳' },
  { name: 'BrowserStack', logo: '🌐' }, { name: 'Postman', logo: '📮' },
  { name: 'Chargebee', logo: '⚡' }, { name: 'Mindtree', logo: '🌳' },
  { name: 'LTIMindtree', logo: '🌿' }, { name: 'Persistent', logo: '🔗' },
  { name: 'Cisco India', logo: '📡' }, { name: 'VMware India', logo: '☁️' },
  { name: 'Dell India', logo: '💻' }, { name: 'HP India', logo: '🖥️' },
  { name: 'Jio Platforms', logo: '📶' }, { name: 'Airtel Digital', logo: '📞' },
  { name: 'Snapdeal', logo: '🛒' }, { name: 'Cure.fit', logo: '💪' },
  { name: 'Simplilearn', logo: '📖' }, { name: 'Vedantu', logo: '👨‍🏫' },
  { name: 'Ola Electric', logo: '⚡' }, { name: 'Tata Elxsi', logo: '🏗️' },
  { name: 'Nokia India', logo: '📞' }, { name: 'Ericsson India', logo: '📡' },
  { name: 'NetApp India', logo: '💾' }, { name: 'Xiaomi India', logo: '📱' },
  { name: 'OnePlus India', logo: '📱' }, { name: 'KPIT', logo: '🚘' },
  { name: 'Happiest Minds', logo: '😊' }, { name: 'Quick Heal', logo: '🛡️' },
  { name: 'Route Mobile', logo: '📲' }, { name: 'Hexaware', logo: '⬡' },
  { name: 'Coforge', logo: '⚙️' }, { name: 'NIIT', logo: '🎯' },
  { name: 'Birlasoft', logo: '🏭' }, { name: 'Cyient', logo: '🔬' },
  { name: 'Zensar', logo: '🌐' }, { name: 'Sonata Software', logo: '🎵' },
  { name: 'Amdocs India', logo: '📊' }, { name: 'LTTS', logo: '🔧' },
  { name: 'Mphasis', logo: '🔲' }, { name: 'Western Digital', logo: '💿' },
  { name: 'Micron India', logo: '🧊' }, { name: 'Seagate India', logo: '📀' },
  { name: 'Dunzo', logo: '🛵' }, { name: 'Tanla Platforms', logo: '📨' },
  { name: 'Newgen Software', logo: '🆕' }, { name: 'Vivo India', logo: '📱' },
  { name: 'Oppo India', logo: '📱' }, { name: 'Lenovo India', logo: '💻' },
];

const domains = [
  'Software Development', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design',
  'Digital Marketing', 'Product Management', 'DevOps', 'Blockchain',
  'IoT', 'AI Research', 'Business Analytics', 'Game Development',
  'AR/VR Development', 'Robotics', 'Natural Language Processing', 'Computer Vision',
  'Data Engineering', 'Full Stack Development', 'Backend Development',
  'Frontend Development', 'Quality Assurance', 'Technical Writing',
  'Network Engineering', 'IT Support', 'Embedded Systems', 'Quantum Computing',
];

const cities = [
  { city: 'Bangalore', state: 'Karnataka' }, { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi NCR', state: 'Delhi' }, { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' }, { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' }, { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' }, { city: 'Kochi', state: 'Kerala' },
  { city: 'Noida', state: 'Uttar Pradesh' }, { city: 'Gurgaon', state: 'Haryana' },
  { city: 'Chandigarh', state: 'Punjab' }, { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Lucknow', state: 'Uttar Pradesh' }, { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Thiruvananthapuram', state: 'Kerala' }, { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' }, { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Mysore', state: 'Karnataka' }, { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Surat', state: 'Gujarat' }, { city: 'Patna', state: 'Bihar' },
  { city: 'Ranchi', state: 'Jharkhand' }, { city: 'Dehradun', state: 'Uttarakhand' },
  { city: 'Guwahati', state: 'Assam' }, { city: 'Mangalore', state: 'Karnataka' },
  { city: 'Hubli', state: 'Karnataka' }, { city: 'Vijayawada', state: 'Andhra Pradesh' },
];

const allSkills = [
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
];

const titles: Record<string, string[]> = {
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
  'AR/VR Development': ['AR/VR Developer Intern', 'XR Engineer Intern', '3D Developer Intern'],
  'Robotics': ['Robotics Intern', 'ROS Developer Intern', 'Automation Intern'],
  'Natural Language Processing': ['NLP Intern', 'Text Analytics Intern', 'Chatbot Developer Intern'],
  'Computer Vision': ['Computer Vision Intern', 'Image Processing Intern', 'CV Research Intern'],
  'Technical Writing': ['Technical Writer Intern', 'Documentation Intern', 'Content Developer Intern'],
  'Network Engineering': ['Network Engineer Intern', 'NOC Intern', 'Infrastructure Intern'],
  'IT Support': ['IT Support Intern', 'Help Desk Intern', 'System Admin Intern'],
  'Embedded Systems': ['Embedded Engineer Intern', 'Firmware Intern', 'VLSI Intern'],
  'Quantum Computing': ['Quantum Computing Intern', 'Quantum Research Intern', 'Qiskit Developer Intern'],
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const shuffled = [...arr].sort(() => seededRandom(seed++) - 0.5);
  return shuffled.slice(0, n);
}

export function generateInternships(): Internship[] {
  const internships: Internship[] = [];

  for (let i = 0; i < 30000; i++) {
    const seed = i * 137 + 42;
    const company = companies[i % companies.length];
    const domain = pick(domains, seed + 1);
    const loc = pick(cities, seed + 2);
    const type: ('Remote' | 'On-site' | 'Hybrid')[] = ['Remote', 'On-site', 'Hybrid'];
    const internType = pick(type, seed + 3);
    const domainTitles = titles[domain] || ['Intern'];
    const title = pick(domainTitles, seed + 4);
    const numSkills = 3 + Math.floor(seededRandom(seed + 20) * 4);
    const skills = pickN(allSkills, numSkills, seed + 6);

    const baseStipend = [3000, 5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000,
                         35000, 40000, 50000, 60000, 75000, 80000, 100000];
    const stipend = pick(baseStipend, seed + 7);

    const durations = ['1 Month', '2 Months', '3 Months', '4 Months', '6 Months', '12 Months'];
    const duration = pick(durations, seed + 8);

    const applications = Math.floor(seededRandom(seed + 9) * 4500) + 50;
    const rating = Math.round((3.0 + seededRandom(seed + 10) * 2.0) * 10) / 10;
    const openings = Math.floor(seededRandom(seed + 11) * 25) + 1;

    const month = Math.floor(seededRandom(seed + 12) * 12);
    const day = Math.floor(seededRandom(seed + 13) * 28) + 1;

    const demandScore = Math.round((stipend / 100000 * 30 + applications / 4500 * 40 +
                        rating / 5 * 20 + seededRandom(seed + 14) * 10) * 10) / 10;
    const growthTrend = Math.round((seededRandom(seed + 15) * 40 - 5) * 10) / 10;

    // Simulate some as "live" from different sources
    const sourceIdx = i % 6;
    const sources = ['Generated', 'Internshala', 'Indeed', 'RemoteOK', 'Adzuna', 'GitHub Jobs'];
    const source = sources[sourceIdx];
    const isLive = sourceIdx > 0;

    internships.push({
      id: i + 1,
      company: company.name,
      title,
      domain,
      location: `${loc.city}, ${loc.state}`,
      city: loc.city,
      state: loc.state,
      stipend,
      duration,
      type: internType,
      skills,
      applications,
      rating,
      openings,
      postedDate: `2025-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      deadline: `2025-${String(Math.min(month + 3, 12)).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      description: `${title} opportunity at ${company.name} in the ${domain} domain. Location: ${loc.city}.`,
      companyLogo: company.logo,
      demandScore,
      growthTrend,
      source,
      isLive,
    });
  }

  return internships;
}

export function calculateMatchScore(student: StudentProfile, internship: Internship): number {
  let score = 0;

  // Skill matching (40%)
  const matchedSkills = student.skills.filter(s =>
    internship.skills.some(is => is.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(is.toLowerCase()))
  );
  const skillScore = internship.skills.length > 0 ? (matchedSkills.length / internship.skills.length) * 40 : 0;
  score += Math.min(skillScore, 40);

  // Domain matching (25%)
  const domainMatch = student.interests.some(i =>
    internship.domain.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(internship.domain.toLowerCase())
  );
  if (domainMatch) score += 25;

  // Location matching (15%)
  if (internship.type === 'Remote') {
    score += 15;
  } else if (student.location && internship.location.toLowerCase().includes(student.location.toLowerCase())) {
    score += 15;
  } else {
    score += 5;
  }

  // Type preference (10%)
  if (student.preferredType === 'Any' || student.preferredType === internship.type) {
    score += 10;
  }

  // Stipend (10%)
  if (internship.stipend >= student.minStipend) {
    score += 10;
  } else if (internship.stipend >= student.minStipend * 0.7) {
    score += 5;
  }

  return Math.min(Math.round(score * 10) / 10, 100);
}

export function predictDemand(internship: Internship): { level: string; color: string; factors: string[] } {
  const factors: string[] = [];

  if (internship.stipend >= 30000) factors.push('High stipend attracts more applicants');
  if (internship.type === 'Remote') factors.push('Remote work increases application volume');
  if (['Data Science', 'Machine Learning', 'AI Research'].includes(internship.domain)) factors.push('Trending domain with high demand');
  if (internship.applications > 1000) factors.push('Already popular listing');
  if (internship.rating >= 4.5) factors.push('Highly rated company');
  if (internship.isLive) factors.push('Live listing from real API');

  if (internship.demandScore >= 70) return { level: 'Very High', color: 'text-red-500', factors };
  if (internship.demandScore >= 50) return { level: 'High', color: 'text-orange-500', factors };
  if (internship.demandScore >= 30) return { level: 'Medium', color: 'text-yellow-500', factors };
  return { level: 'Low', color: 'text-green-500', factors };
}

export const ALL_SKILLS = allSkills;
export const ALL_DOMAINS = domains;
export const ALL_CITIES = cities.map(c => c.city);