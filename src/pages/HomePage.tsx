import {
  Sparkles,
  BarChart3,
  Search,
  TrendingUp,
  Users,
  ArrowRight,
  Brain,
  Target,
  Zap,
  Globe,
  BookOpen,
  Award,
  FileText,
  Radio,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  appliedCount?: number;
}

export function HomePage({ onNavigate, appliedCount = 0 }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168,85,247,0.3) 0%, transparent 50%)',
          }}
        />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Internship Intelligence Platform
            </div>

            {/* LIVE Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                LIVE DATA FROM 5+ APIs • REAL-TIME INTERNSHIPS
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Find Your{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Perfect
              </span>{' '}
              Internship
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Data-driven ML platform with <span className="text-emerald-400 font-bold">30,000+ live internships</span> fetched
              from real APIs. Predicts demand, matches students, and visualizes market trends across India.
            </p>

            {appliedCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                You've applied to {appliedCount} internships!
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('recommend')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                Get Recommendations
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <BarChart3 className="w-5 h-5" />
                View Dashboard
              </button>
              <button
                onClick={() => onNavigate('resume')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500/10 text-emerald-400 font-bold text-lg border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                Upload Resume
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '30,000+', label: 'Live Internships', icon: BookOpen, color: 'text-indigo-400' },
              { value: '100+', label: 'Top Companies', icon: Award, color: 'text-purple-400' },
              { value: '30+', label: 'Cities Covered', icon: Globe, color: 'text-emerald-400' },
              { value: '30', label: 'Industry Domains', icon: Target, color: 'text-amber-400' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Live Data Sources */}
          <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Data Sources</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { name: 'Internshala', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { name: 'Indeed India', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                { name: 'RemoteOK', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { name: 'Adzuna', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                { name: 'GitHub Jobs', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
              ].map((source, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${source.color}`}
                >
                  <Radio className="w-3 h-3" />
                  {source.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Powered by{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Machine Learning
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Advanced ML algorithms analyze 30,000+ live internship listings and provide actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Demand Prediction',
                desc: 'Classification/regression models predict internship popularity and application volume from stipend, domain, company, and skills.',
                color: 'from-indigo-500 to-blue-600',
                page: 'predict',
              },
              {
                icon: Target,
                title: 'Smart Matching',
                desc: 'Recommendation engine matches students to top internships based on skills, location, interests, and preferences.',
                color: 'from-purple-500 to-pink-600',
                page: 'recommend',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Interactive charts showing trends by domain, region, skills, demand growth, and real-time heatmaps.',
                color: 'from-emerald-500 to-teal-600',
                page: 'dashboard',
              },
              {
                icon: Search,
                title: 'Explore 30K+ Listings',
                desc: 'Browse and filter 30,000+ live internship listings with advanced search, sorting, and pagination.',
                color: 'from-orange-500 to-red-600',
                page: 'explore',
              },
              {
                icon: FileText,
                title: 'Resume-Based Search',
                desc: 'Upload your resume (PDF/DOCX/TXT) and our AI extracts 250+ skills to find perfectly matched internships.',
                color: 'from-cyan-500 to-blue-600',
                page: 'resume',
              },
              {
                icon: Zap,
                title: 'Live API Integration',
                desc: 'Real-time data from Internshala, Indeed, RemoteOK, Adzuna, and GitHub Jobs combined with ML predictions.',
                color: 'from-amber-500 to-orange-600',
                page: 'explore',
              },
              {
                icon: Users,
                title: 'Student Profiles',
                desc: 'Create your profile with skills and preferences to receive personalized AI-powered recommendations.',
                color: 'from-pink-500 to-rose-600',
                page: 'profile',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <button
                  key={i}
                  onClick={() => onNavigate(feature.page)}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-left hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-5`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-400">Three simple steps to find your ideal internship</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Profile or Upload Resume',
                desc: 'Enter your skills and interests, or simply upload your resume. Our AI extracts 250+ skills automatically.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Get AI Recommendations',
                desc: 'Our ML engine analyzes 30,000+ live listings from 5 APIs and ranks them by match score for you.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Apply & Track',
                desc: 'Review detailed insights, demand predictions, apply to your top matches, and track your applications.',
                icon: TrendingUp,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 text-center"
                >
                  <div className="text-6xl font-black bg-gradient-to-b from-indigo-400/30 to-transparent bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-indigo-500/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Find Your Dream Internship?
          </h2>
          <p className="text-lg text-indigo-200 mb-8">
            Join thousands of students using AI-powered insights from 30,000+ live listings to kickstart their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <Users className="w-5 h-5" />
              Create Your Profile
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('resume')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              Upload Resume
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">InternMatch AI</span>
              <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-bold">LIVE</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 InternMatch AI. 30,000+ live internships from 5 APIs for India's future workforce.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}