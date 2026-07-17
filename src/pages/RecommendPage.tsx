import { useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  Star,
  Users,
  Briefcase,
  Wifi,
  Building2,
  Target,
  TrendingUp,
  AlertCircle,
  Check,
  ArrowLeft,
  Send,
  CheckCircle,
} from 'lucide-react';
import {
  type Internship,
  type StudentProfile,
  calculateMatchScore,
  predictDemand,
} from '../data/internships';

interface RecommendPageProps {
  internships: Internship[];
  studentProfile: StudentProfile;
  onNavigate: (page: string) => void;
  appliedIds: Set<number>;
  onToggleApply: (id: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function RecommendPage({ internships, studentProfile, onNavigate, appliedIds, onToggleApply, onBack, canGoBack }: RecommendPageProps) {
  const recommendations = useMemo(() => {
    if (!studentProfile.skills.length && !studentProfile.interests.length) return [];
    return internships
      .map(i => ({ internship: i, matchScore: calculateMatchScore(studentProfile, i) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);
  }, [internships, studentProfile]);

  const hasProfile = studentProfile.skills.length > 0 || studentProfile.interests.length > 0;

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button + Header */}
        <div className="mb-8">
          {canGoBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-4 cursor-pointer group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white">AI Recommendations</h1>
          </div>
          <p className="text-slate-400 text-lg">Personalized internship matches based on your profile</p>
        </div>

        {!hasProfile ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Profile Required</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">Please set up your student profile with skills and interests to get personalized recommendations.</p>
            <button onClick={() => onNavigate('profile')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:scale-105 transition-all cursor-pointer">
              <Users className="w-5 h-5" /> Set Up Profile
            </button>
          </div>
        ) : (
          <>
            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-3">Your Profile</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Name</div>
                  <div className="text-sm font-medium text-white">{studentProfile.name || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {studentProfile.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Interests</div>
                  <div className="flex flex-wrap gap-1">
                    {studentProfile.interests.map(i => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs">{i}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Preference</div>
                  <div className="text-sm font-medium text-white">
                    {studentProfile.preferredType} • {studentProfile.location || 'Any City'} • ₹{studentProfile.minStipend.toLocaleString()}+
                  </div>
                </div>
              </div>
              <button onClick={() => onNavigate('profile')} className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer">
                Edit Profile →
              </button>
            </div>

            {/* Top Matches */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Top {recommendations.length} Matches</h2>
              <div className="text-sm text-slate-500">Ranked by ML matching score</div>
            </div>

            <div className="space-y-4">
              {recommendations.map(({ internship, matchScore }, index) => {
                const demand = predictDemand(internship);
                const isApplied = appliedIds.has(internship.id);
                const matchedSkills = studentProfile.skills.filter(s =>
                  internship.skills.some(is => is.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(is.toLowerCase()))
                );

                return (
                  <div
                    key={internship.id}
                    className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-5 sm:p-6 hover:bg-white/[0.07] transition-all duration-300 ${
                      isApplied ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'border-white/10 hover:border-indigo-500/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
                          index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/10 text-slate-400'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold ${getMatchColor(matchScore)}`}>
                          {matchScore}%
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{internship.companyLogo}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-white">{internship.title}</h3>
                                {isApplied && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                              </div>
                              <p className="text-indigo-400 font-medium text-sm">{internship.company}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 flex-shrink-0">
                            <div className="hidden sm:block text-right">
                              <div className="text-xl font-bold text-emerald-400">
                                ₹{internship.stipend.toLocaleString()}<span className="text-sm text-slate-500">/mo</span>
                              </div>
                              <span className={`text-xs font-semibold ${getMatchColor(matchScore).split(' ')[0]}`}>{getMatchLabel(matchScore)}</span>
                            </div>
                            {/* APPLY TOGGLE */}
                            <button
                              onClick={() => onToggleApply(internship.id)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer flex-shrink-0 ${
                                isApplied
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105'
                              }`}
                            >
                              {isApplied ? (
                                <><CheckCircle className="w-4 h-4" /><span className="hidden sm:inline">Applied</span></>
                              ) : (
                                <><Send className="w-4 h-4" /><span className="hidden sm:inline">Apply</span></>
                              )}
                            </button>
                          </div>
                        </div>

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
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center justify-between mt-2 sm:hidden">
                          <div className="text-lg font-bold text-emerald-400">₹{internship.stipend.toLocaleString()}/mo</div>
                          <span className={`text-xs font-semibold ${getMatchColor(matchScore).split(' ')[0]}`}>{getMatchLabel(matchScore)}</span>
                        </div>

                        {/* Skill Match */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {internship.skills.map(skill => {
                            const isMatched = matchedSkills.some(ms =>
                              skill.toLowerCase().includes(ms.toLowerCase()) || ms.toLowerCase().includes(skill.toLowerCase())
                            );
                            return (
                              <span key={skill} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                isMatched ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}>
                                {isMatched && <Check className="w-3 h-3" />}{skill}
                              </span>
                            );
                          })}
                        </div>

                        {/* Factors */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Target className="w-3 h-3" />{matchedSkills.length}/{internship.skills.length} skills matched
                          </span>
                          <span className={`flex items-center gap-1 ${demand.color}`}>
                            <TrendingUp className="w-3 h-3" />{demand.level} demand
                          </span>
                          <span className={`flex items-center gap-1 ${internship.growthTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            <TrendingUp className="w-3 h-3" />{internship.growthTrend >= 0 ? '+' : ''}{internship.growthTrend}% growth
                          </span>
                          {isApplied && (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle className="w-3 h-3" />Applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
