import { useState } from 'react';
import {
  Users,
  Plus,
  X,
  Save,
  Sparkles,
  MapPin,
  Briefcase,
  Code,
  Heart,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { type StudentProfile, ALL_SKILLS, ALL_DOMAINS, ALL_CITIES } from '../data/internships';

interface ProfilePageProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onNavigate: (page: string) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function ProfilePage({ studentProfile, onUpdateProfile, onNavigate, onBack, canGoBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<StudentProfile>({ ...studentProfile });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [interestSuggestions, setInterestSuggestions] = useState<string[]>([]);

  const handleSkillInput = (val: string) => {
    setSkillInput(val);
    if (val.length >= 1) {
      const suggestions = ALL_SKILLS.filter(
        s => s.toLowerCase().includes(val.toLowerCase()) && !profile.skills.includes(s)
      ).slice(0, 6);
      setSkillSuggestions(suggestions);
    } else {
      setSkillSuggestions([]);
    }
  };

  const handleInterestInput = (val: string) => {
    setInterestInput(val);
    if (val.length >= 1) {
      const suggestions = ALL_DOMAINS.filter(
        d => d.toLowerCase().includes(val.toLowerCase()) && !profile.interests.includes(d)
      ).slice(0, 6);
      setInterestSuggestions(suggestions);
    } else {
      setInterestSuggestions([]);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
    setSkillInput('');
    setSkillSuggestions([]);
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const addInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: [...profile.interests, interest] });
    }
    setInterestInput('');
    setInterestSuggestions([]);
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) });
  };

  const handleSave = () => {
    onUpdateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const quickSkills = ['Python', 'JavaScript', 'React', 'Java', 'SQL', 'Machine Learning', 'TensorFlow', 'Docker', 'AWS', 'Git', 'Node.js', 'TypeScript'];
  const quickInterests = ALL_DOMAINS.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button + Header */}
        <div className="mb-8">
          {canGoBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-4 cursor-pointer group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white">Student Profile</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Set up your profile to get personalized internship recommendations
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Basic Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Experience Level</label>
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Beginner">Beginner (0-1 years)</option>
                  <option value="Intermediate">Intermediate (1-2 years)</option>
                  <option value="Advanced">Advanced (2+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Preferences */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              Location & Preferences
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Preferred City</label>
                <select
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="">Any City</option>
                  {ALL_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Work Type</label>
                <select
                  value={profile.preferredType}
                  onChange={(e) => setProfile({ ...profile, preferredType: e.target.value as StudentProfile['preferredType'] })}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Any">Any</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Min Stipend: ₹{profile.minStipend.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={5000}
                  value={profile.minStipend}
                  onChange={(e) => setProfile({ ...profile, minStipend: Number(e.target.value) })}
                  className="w-full accent-indigo-500 mt-3"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>₹0</span>
                  <span>₹50,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              Skills
            </h3>
            
            {/* Selected Skills */}
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 text-indigo-300 text-sm font-medium border border-indigo-500/20"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Skill Input */}
            <div className="relative">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => handleSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && skillInput) {
                    addSkill(skillInput);
                  }
                }}
                placeholder="Type a skill to add..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
              {skillSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl">
                  {skillSuggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-500/20 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-2 text-indigo-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Skills */}
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2">Quick add:</div>
              <div className="flex flex-wrap gap-2">
                {quickSkills.filter(s => !profile.skills.includes(s)).map(skill => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-indigo-500/20 hover:text-indigo-300 transition-all border border-white/5 hover:border-indigo-500/20 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Domain Interests
            </h3>

            {/* Selected Interests */}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.interests.map(interest => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 text-sm font-medium border border-purple-500/20"
                  >
                    {interest}
                    <button onClick={() => removeInterest(interest)} className="hover:text-red-400 transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Interest Input */}
            <div className="relative">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => handleInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && interestInput) {
                    addInterest(interestInput);
                  }
                }}
                placeholder="Type a domain interest..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
              {interestSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl">
                  {interestSuggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => addInterest(s)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-2 text-purple-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Interests */}
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2">Quick add:</div>
              <div className="flex flex-wrap gap-2">
                {quickInterests.filter(i => !profile.interests.includes(i)).map(interest => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-purple-500/20 hover:text-purple-300 transition-all border border-white/5 hover:border-purple-500/20 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Profile Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
            <button
              onClick={() => {
                handleSave();
                onNavigate('recommend');
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              Save & Get Recommendations
            </button>
          </div>

          {/* Profile Summary */}
          {(profile.skills.length > 0 || profile.interests.length > 0) && (
            <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Profile Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-white">{profile.skills.length}</div>
                  <div className="text-xs text-slate-500">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{profile.interests.length}</div>
                  <div className="text-xs text-slate-500">Interests</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">{profile.location || 'Any'}</div>
                  <div className="text-xs text-slate-500">City</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">{profile.preferredType}</div>
                  <div className="text-xs text-slate-500">Work Type</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
