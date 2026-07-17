import { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Users,
  Briefcase,
  Wifi,
  Building2,
  Check,
  X,
  Send,
  CheckCircle,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  Cloud,
  Brain,
  Smartphone,
  Palette,
  Wrench,
  Target,
  Loader2,
  Award,
  BookOpen,
  Layers,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { type Internship } from '../data/internships';

interface ResumeSearchPageProps {
  internships: Internship[];
  appliedIds: Set<number>;
  onToggleApply: (id: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

interface ExtractedSkill {
  name: string;
  category: string;
  confidence: 'High' | 'Medium' | 'Low';
}

interface MatchedInternship {
  internship: Internship;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const SKILL_DATABASE: Record<string, string[]> = {
  'Programming Languages': [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C\\+\\+', 'C#', 'Go', 'Rust', 'R',
    'Kotlin', 'Swift', 'Ruby', 'PHP', 'Scala', 'Dart', 'MATLAB', 'Perl', 'Lua',
    'Shell', 'Bash', 'PowerShell', 'Objective-C', 'Haskell', 'Elixir', 'Clojure',
  ],
  'Web & Frontend': [
    'React', 'Angular', 'Vue\\.js', 'Vue', 'Next\\.js', 'Svelte', 'HTML', 'CSS',
    'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind', 'Tailwind CSS', 'Sass', 'SCSS',
    'Redux', 'Webpack', 'Vite', 'Gatsby', 'Nuxt', 'Astro', 'Remix',
  ],
  'Backend & APIs': [
    'Node\\.js', 'Node', 'Django', 'Flask', 'Spring Boot', 'Spring', 'Express\\.js',
    'Express', 'FastAPI', 'ASP\\.NET', 'Rails', 'Ruby on Rails', 'Laravel', 'NestJS',
    'GraphQL', 'REST API', 'REST APIs', 'gRPC', 'Microservices', 'Gin', 'Fiber',
  ],
  'Databases': [
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Firebase',
    'DynamoDB', 'Cassandra', 'SQLite', 'Oracle', 'Neo4j', 'MariaDB', 'CouchDB',
    'InfluxDB', 'Supabase',
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
    'Jenkins', 'CI/CD', 'Ansible', 'Nginx', 'Apache', 'Linux', 'Git', 'GitHub',
    'GitHub Actions', 'GitLab', 'Heroku', 'Vercel', 'Netlify', 'DigitalOcean',
    'Prometheus', 'Grafana', 'Vagrant', 'Puppet', 'Chef',
  ],
  'ML & AI': [
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
    'Natural Language Processing', 'Computer Vision', 'Scikit-learn', 'Keras',
    'OpenCV', 'Pandas', 'NumPy', 'SciPy', 'Spark', 'Hadoop', 'LLM',
    'GPT', 'Transformers', 'BERT', 'Hugging Face', 'MLOps', 'Data Science',
    'Data Analysis', 'Data Analytics', 'Jupyter', 'Matplotlib', 'Seaborn',
    'Tableau', 'Power BI', 'Excel',
  ],
  'Mobile': [
    'Flutter', 'React Native', 'Android', 'iOS', 'SwiftUI', 'Xamarin',
    'Ionic', 'Capacitor', 'Expo',
  ],
  'Design': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
    'UI/UX', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Canva',
    'After Effects', 'Premiere Pro',
  ],
  'Tools & Methods': [
    'JIRA', 'Agile', 'Scrum', 'Confluence', 'Slack', 'Trello', 'Notion',
    'VS Code', 'IntelliJ', 'Postman', 'Swagger', 'Webpack',
  ],
  'Marketing': [
    'SEO', 'Google Analytics', 'Content Writing', 'Social Media',
    'Email Marketing', 'Digital Marketing', 'SEM', 'PPC', 'Copywriting',
  ],
  'Blockchain': [
    'Blockchain', 'Solidity', 'Web3', 'Ethereum', 'Smart Contract',
    'Smart Contracts', 'DeFi', 'NFT', 'Cryptocurrency', 'Hardhat', 'Truffle',
  ],
  'Other Technical': [
    'IoT', 'Embedded Systems', 'Robotics', 'AutoCAD', 'Simulink',
    'LabVIEW', 'FPGA', 'VHDL', 'Verilog', '3D Printing', 'ROS',
    'Cybersecurity', 'Penetration Testing', 'Network Security',
  ],
};

const CATEGORY_CONFIG: Record<string, { icon: typeof Code; color: string; bg: string }> = {
  'Programming Languages': { icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  'Web & Frontend': { icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  'Backend & APIs': { icon: Database, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  'Databases': { icon: Database, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  'Cloud & DevOps': { icon: Cloud, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  'ML & AI': { icon: Brain, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  'Mobile': { icon: Smartphone, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  'Design': { icon: Palette, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  'Tools & Methods': { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  'Marketing': { icon: Target, color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20' },
  'Blockchain': { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  'Other Technical': { icon: Wrench, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
};

const SAMPLE_RESUME = `RAHUL SHARMA
Full Stack Developer | Machine Learning Enthusiast
Email: rahul.sharma@email.com | Phone: +91-9876543210
Location: Bangalore, Karnataka, India
LinkedIn: linkedin.com/in/rahulsharma | GitHub: github.com/rahulsharma

EDUCATION
Bachelor of Technology (B.Tech) in Computer Science and Engineering
Indian Institute of Technology (IIT) Delhi — 2021–2025
CGPA: 8.9/10

SKILLS
Programming Languages: Python, JavaScript, TypeScript, Java, C++, SQL
Frontend: React, Next.js, Angular, HTML/CSS, Tailwind CSS, Redux
Backend: Node.js, Express.js, Django, Flask, FastAPI, REST APIs, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis, Firebase
Cloud & DevOps: AWS, Docker, Kubernetes, Git, GitHub Actions, CI/CD, Linux
ML/AI: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, NLP, Computer Vision, Deep Learning, Machine Learning
Mobile: Flutter, React Native
Tools: JIRA, Agile, Scrum, Figma, Postman, VS Code

EXPERIENCE
Software Development Intern — Google India (May 2024 – Aug 2024)
• Built microservices architecture using Node.js and Kubernetes
• Developed React dashboards for real-time data analytics
• Implemented ML pipeline for recommendation system using TensorFlow
• Deployed services on AWS with Docker containers

Data Science Intern — Flipkart (Jan 2024 – Apr 2024)
• Analyzed customer behavior data using Python, Pandas, and SQL
• Built predictive models using Scikit-learn and XGBoost
• Created Tableau dashboards for business stakeholders
• Improved recommendation accuracy by 23% using NLP techniques

PROJECTS
AI Resume Parser — Python, NLP, TensorFlow, Flask
• Built an NLP-based resume parsing system extracting skills, experience
• Used Named Entity Recognition for information extraction
• Deployed as REST API using Flask on AWS EC2

E-Commerce Platform — React, Node.js, MongoDB, Docker
• Full-stack e-commerce platform with 50K+ products
• Implemented payment gateway using Razorpay API
• Containerized with Docker and deployed on Kubernetes

Real-time Chat Application — React, Node.js, Socket.io, Redis
• Real-time messaging app supporting 10K concurrent users
• Used Redis for caching and session management
• WebSocket-based communication with Socket.io

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate
• Google TensorFlow Developer Certificate
• MongoDB Certified Developer
• Coursera Machine Learning Specialization (Andrew Ng)

ACHIEVEMENTS
• Winner, Smart India Hackathon 2023
• Top 5%, Google Code Jam 2023
• Published paper on NLP at IEEE Conference
• Open source contributor — 500+ GitHub contributions

INTERESTS
Machine Learning, Data Science, Web Development, Cloud Computing, Open Source
`;

function extractSkillsFromResume(text: string): ExtractedSkill[] {
  const found: ExtractedSkill[] = [];
  const textLower = text.toLowerCase();
  const seen = new Set<string>();

  for (const [category, skills] of Object.entries(SKILL_DATABASE)) {
    for (const skill of skills) {
      const cleanSkill = skill.replace(/\\/g, '');
      if (seen.has(cleanSkill.toLowerCase())) continue;

      try {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi');
        const matches = textLower.match(new RegExp(`\\b${skill.toLowerCase().replace(/\\/g, '')}\\b`, 'gi'));

        if (regex.test(text) || (matches && matches.length > 0)) {
          const count = matches ? matches.length : 1;
          let confidence: 'High' | 'Medium' | 'Low' = 'Low';

          if (count >= 3) confidence = 'High';
          else if (count >= 2) confidence = 'Medium';
          else {
            const inSkillsSection = /skills|technologies|tech stack|proficient/i.test(
              text.substring(Math.max(0, text.toLowerCase().indexOf(cleanSkill.toLowerCase()) - 200),
                text.toLowerCase().indexOf(cleanSkill.toLowerCase()) + 50)
            );
            if (inSkillsSection) confidence = 'High';
            else confidence = 'Medium';
          }

          seen.add(cleanSkill.toLowerCase());
          found.push({ name: cleanSkill, category, confidence });
        }
      } catch {
        if (textLower.includes(cleanSkill.toLowerCase())) {
          seen.add(cleanSkill.toLowerCase());
          found.push({ name: cleanSkill, category, confidence: 'Medium' });
        }
      }
    }
  }

  return found.sort((a, b) => {
    const confOrder = { High: 0, Medium: 1, Low: 2 };
    return confOrder[a.confidence] - confOrder[b.confidence];
  });
}

function extractExperience(text: string): string {
  const patterns = [
    /(\d+)\+?\s*years?\s*(of)?\s*(experience|exp)/i,
    /experience[:\s]*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*years?\s*(in|of)\s*(software|development|programming|coding)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const years = parseInt(m[1]);
      if (years <= 1) return 'Fresher';
      if (years <= 3) return `${years} Years (Junior)`;
      return `${years} Years (Mid)`;
    }
  }
  if (/intern|internship|fresher|student|undergraduate|b\.tech|btech/i.test(text)) return 'Fresher/Student';
  return 'Not Specified';
}

function extractEducation(text: string): string {
  if (/ph\.?d|doctorate/i.test(text)) return 'PhD';
  if (/m\.?tech|m\.?s\.?c|master|mca|m\.?e\./i.test(text)) return 'Post Graduate';
  if (/b\.?tech|b\.?e\.|b\.?s\.?c|bachelor|bca|b\.?eng/i.test(text)) return 'Under Graduate';
  if (/diploma|polytechnic/i.test(text)) return 'Diploma';
  if (/12th|higher secondary|hsc/i.test(text)) return '12th Pass';
  return 'Not Specified';
}

function matchInternships(
  skills: ExtractedSkill[],
  internships: Internship[]
): MatchedInternship[] {
  const skillNames = skills.map(s => s.name.toLowerCase());

  return internships
    .map(internship => {
      const matched: string[] = [];
      const missing: string[] = [];

      for (const reqSkill of internship.skills) {
        const reqLower = reqSkill.toLowerCase();
        const isMatch = skillNames.some(s =>
          s === reqLower ||
          s.includes(reqLower) ||
          reqLower.includes(s) ||
          (s === 'html/css' && (reqLower === 'html' || reqLower === 'css')) ||
          (s === 'html' && reqLower === 'html/css') ||
          (s === 'css' && reqLower === 'html/css') ||
          (s === 'node.js' && reqLower === 'node') ||
          (s === 'node' && reqLower === 'node.js') ||
          (s === 'vue.js' && reqLower === 'vue') ||
          (s === 'vue' && reqLower === 'vue.js') ||
          (s === 'next.js' && reqLower === 'next') ||
          (s === 'express.js' && reqLower === 'express') ||
          (s === 'react native' && reqLower === 'react') ||
          (s === 'rest apis' && reqLower === 'rest api') ||
          (s === 'rest api' && reqLower === 'rest apis')
        );
        if (isMatch) matched.push(reqSkill);
        else missing.push(reqSkill);
      }

      const totalSkills = internship.skills.length;
      if (totalSkills === 0) return null;

      const skillScore = (matched.length / totalSkills) * 60;
      const ratingBonus = (internship.rating / 5) * 15;
      const stipendBonus = Math.min((internship.stipend / 80000) * 15, 15);
      const typeBonus = internship.type === 'Remote' ? 10 : internship.type === 'Hybrid' ? 7 : 5;

      const matchScore = Math.min(Math.round((skillScore + ratingBonus + stipendBonus + typeBonus) * 10) / 10, 100);

      if (matched.length === 0) return null;

      return { internship, matchScore, matchedSkills: matched, missingSkills: missing };
    })
    .filter((m): m is MatchedInternship => m !== null)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function ResumeSearchPage({
  internships,
  appliedIds,
  onToggleApply,
  onBack,
  canGoBack,
}: ResumeSearchPageProps) {

  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [matches, setMatches] = useState<MatchedInternship[]>([]);
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const perPage = 10;

  const handleExtract = () => {
    if (!resumeText.trim()) return;
    setIsProcessing(true);
    setCurrentPage(1);
    setExpandedId(null);

    setTimeout(() => {
      const skills = extractSkillsFromResume(resumeText);
      const exp = extractExperience(resumeText);
      const edu = extractEducation(resumeText);
      const matched = matchInternships(skills, internships);

      setExtractedSkills(skills);
      setExperience(exp);
      setEducation(edu);
      setMatches(matched);
      setHasSearched(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setHasSearched(false);
    setExtractedSkills([]);
    setMatches([]);
    setExperience('');
    setEducation('');
    setCurrentPage(1);
    setExpandedId(null);
  };

  const handleClear = () => {
    setResumeText('');
    setExtractedSkills([]);
    setMatches([]);
    setExperience('');
    setEducation('');
    setHasSearched(false);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const totalPages = Math.ceil(matches.length / perPage);
  const paginatedMatches = matches.slice((currentPage - 1) * perPage, currentPage * perPage);

  const skillsByCategory = useMemo(() => {
    const groups: Record<string, ExtractedSkill[]> = {};
    extractedSkills.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [extractedSkills]);

  const topDomain = useMemo(() => {
    if (matches.length === 0) return 'N/A';
    const domainCount: Record<string, number> = {};
    matches.slice(0, 50).forEach(m => {
      domainCount[m.internship.domain] = (domainCount[m.internship.domain] || 0) + 1;
    });
    return Object.entries(domainCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [matches]);

  const getMatchColor = (score: number) => {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 55) return 'text-indigo-400';
    if (score >= 35) return 'text-amber-400';
    return 'text-slate-400';
  };

  const getMatchBg = (score: number) => {
    if (score >= 75) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 55) return 'bg-indigo-500/10 border-indigo-500/20';
    if (score >= 35) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-slate-500/10 border-slate-500/20';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 75) return 'Excellent Match';
    if (score >= 55) return 'Good Match';
    if (score >= 35) return 'Fair Match';
    return 'Low Match';
  };

  const getConfColor = (c: string) => {
    if (c === 'High') return 'text-emerald-400 bg-emerald-500/10';
    if (c === 'Medium') return 'text-amber-400 bg-amber-500/10';
    return 'text-slate-400 bg-slate-500/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        {canGoBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 group cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white">Resume-Based Search</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Paste your resume and our AI will extract skills and find matching internships from 20,000+ listings
          </p>
        </div>

        {/* Resume Input Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-400" />
              Paste Your Resume
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer"
              >
                📄 Load Sample Resume
              </button>
              {resumeText && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume text here... Include your skills, education, experience, projects, certifications, etc."
            rows={12}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm leading-relaxed font-mono resize-y"
          />

          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="text-sm text-slate-500">
              {resumeText.length > 0 ? `${resumeText.split(/\s+/).filter(Boolean).length} words • ${resumeText.length} characters` : 'Paste your resume to get started'}
            </div>
            <button
              onClick={handleExtract}
              disabled={!resumeText.trim() || isProcessing}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all cursor-pointer ${
                !resumeText.trim() || isProcessing
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Extract Skills & Find Internships
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing Animation */}
        {isProcessing && (
          <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-500/20 rounded-2xl p-12 mb-6 text-center">
            <Loader2 className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Resume...</h3>
            <p className="text-slate-400">Extracting skills, experience, education and matching against 20,000+ internships</p>
            <div className="mt-6 flex justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Code className="w-4 h-4 text-blue-400" /> Parsing skills...</span>
              <span className="flex items-center gap-1"><Brain className="w-4 h-4 text-pink-400" /> ML matching...</span>
              <span className="flex items-center gap-1"><Target className="w-4 h-4 text-green-400" /> Ranking results...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && !isProcessing && (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {[
                { icon: Code, label: 'Skills Found', value: extractedSkills.length.toString(), color: 'from-blue-500 to-cyan-600' },
                { icon: GraduationCap, label: 'Education', value: education, color: 'from-purple-500 to-pink-600' },
                { icon: Award, label: 'Experience', value: experience, color: 'from-emerald-500 to-teal-600' },
                { icon: Target, label: 'Top Domain', value: topDomain.length > 16 ? topDomain.slice(0, 14) + '..' : topDomain, color: 'from-orange-500 to-red-600' },
                { icon: BookOpen, label: 'Matches Found', value: matches.length.toString(), color: 'from-amber-500 to-yellow-600' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xl font-bold text-white truncate">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Extracted Skills */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                Extracted Skills ({extractedSkills.length})
              </h3>

              {Object.entries(skillsByCategory).length === 0 ? (
                <div className="text-center py-8">
                  <X className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No skills detected. Try pasting a more detailed resume.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(skillsByCategory).map(([category, skills]) => {
                    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other Technical'];
                    const CatIcon = config.icon;
                    return (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-2">
                          <CatIcon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-sm font-semibold ${config.color}`}>{category}</span>
                          <span className="text-xs text-slate-600">({skills.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <div
                              key={skill.name}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border ${config.bg}`}
                            >
                              <span className={config.color}>{skill.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-md ${getConfColor(skill.confidence)}`}>
                                {skill.confidence}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Matched Internships */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-400" />
                Matching Internships ({matches.length})
              </h2>
              {totalPages > 1 && (
                <span className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {matches.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400 mb-2">No Matches Found</h3>
                <p className="text-slate-500">Try pasting a more detailed resume with specific technical skills.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedMatches.map(({ internship, matchScore, matchedSkills, missingSkills }, index) => {
                  const isApplied = appliedIds.has(internship.id);
                  const isExpanded = expandedId === internship.id;
                  const rank = (currentPage - 1) * perPage + index + 1;

                  return (
                    <div
                      key={internship.id}
                      className={`bg-white/5 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:bg-white/[0.07] ${
                        isApplied ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'border-white/10 hover:border-orange-500/20'
                      }`}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Rank + Score */}
                          <div className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
                              rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/10 text-slate-400'
                            }`}>
                              #{rank}
                            </div>
                            <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold ${getMatchColor(matchScore)} ${getMatchBg(matchScore)}`}>
                              {matchScore}%
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{internship.companyLogo}</span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-bold text-white">{internship.title}</h3>
                                    {isApplied && (
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-semibold">✅ Applied</span>
                                    )}
                                  </div>
                                  <p className="text-indigo-400 font-medium text-sm">{internship.company}</p>
                                </div>
                              </div>

                              {/* Apply Button */}
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleApply(internship.id); }}
                                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                  isApplied
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105'
                                }`}
                              >
                                {isApplied ? (
                                  <><CheckCircle className="w-4 h-4" /> Applied</>
                                ) : (
                                  <><Send className="w-4 h-4" /> Apply</>
                                )}
                              </button>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{internship.domain}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{internship.city}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{internship.duration}</span>
                              <span className="flex items-center gap-1">
                                {internship.type === 'Remote' ? <Wifi className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                                {internship.type}
                              </span>
                              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{internship.rating}</span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{internship.applications.toLocaleString()}</span>
                              <span className="text-emerald-400 font-bold">₹{internship.stipend.toLocaleString()}/mo</span>
                            </div>

                            {/* Skill Match */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {matchedSkills.map(s => (
                                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                                  <Check className="w-3 h-3" />{s}
                                </span>
                              ))}
                              {missingSkills.map(s => (
                                <span key={s} className="px-2 py-1 rounded-lg bg-slate-500/10 text-slate-500 text-xs font-medium border border-slate-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>

                            {/* Match Summary */}
                            <div className="mt-2 flex items-center gap-4 text-xs">
                              <span className="text-slate-500">
                                {matchedSkills.length}/{matchedSkills.length + missingSkills.length} skills matched
                              </span>
                              <span className={getMatchColor(matchScore)}>
                                {getMatchLabel(matchScore)}
                              </span>
                            </div>

                            {/* Expand Toggle */}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : internship.id)}
                              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
                            >
                              {isExpanded ? '▲ Hide Details' : '▼ Show Details'}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/5 grid sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{internship.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-xs text-slate-500 mb-1">Demand Score</div>
                                <div className="text-xl font-bold text-white">{internship.demandScore}</div>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-xs text-slate-500 mb-1">Growth</div>
                                <div className={`text-xl font-bold ${internship.growthTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {internship.growthTrend >= 0 ? '+' : ''}{internship.growthTrend}%
                                </div>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-xs text-slate-500 mb-1">Openings</div>
                                <div className="text-xl font-bold text-white">{internship.openings}</div>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-xs text-slate-500 mb-1">Deadline</div>
                                <div className="text-sm font-bold text-white">{internship.deadline}</div>
                              </div>
                            </div>
                            <div className="sm:col-span-2">
                              <button
                                onClick={() => onToggleApply(internship.id)}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                  isApplied
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
                                }`}
                              >
                                {isApplied ? '✕ Withdraw Application' : '🚀 Apply for this Internship'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}

        {/* Help Section - shown before search */}
        {!hasSearched && !isProcessing && (
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              {
                icon: Upload,
                title: 'Step 1: Paste Resume',
                desc: 'Copy your full resume text and paste it in the text area above. Include skills, education, experience, projects.',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: Brain,
                title: 'Step 2: AI Analysis',
                desc: 'Our AI engine extracts 250+ technical skills, detects experience level, education, and categorizes everything.',
                color: 'from-purple-500 to-pink-600',
              },
              {
                icon: Target,
                title: 'Step 3: Get Matches',
                desc: 'Skills are matched against 20,000+ internships with weighted scoring. Apply directly to your top matches!',
                color: 'from-orange-500 to-red-600',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
