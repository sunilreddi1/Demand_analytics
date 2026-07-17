import { CheckCircle, ArrowLeft, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { type Internship } from '../data/internships';

interface AppliedPageProps {
  internships: Internship[];
  appliedIds: Set<number>;
  onToggleApply: (id: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function AppliedPage({ internships, appliedIds, onToggleApply, onBack, canGoBack }: AppliedPageProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const applied = useMemo(() => internships.filter(i => appliedIds.has(i.id)), [internships, appliedIds]);

  const exportCsv = () => {
    const rows = [
      ['id', 'title', 'company', 'domain', 'city', 'stipend', 'applications', 'rating', 'apply_url'],
      ...applied.map(i => [i.id, i.title, i.company, i.domain, i.city, i.stipend, i.applications, i.rating, i.url || '']),
    ];
    const csv = rows.map(r => r.map(String).map(v => '"' + v.replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applied_internships_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          {canGoBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-4 cursor-pointer group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">Applied Internships</h1>
              <p className="text-slate-400 mt-1">You have applied to {applied.length} internships</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={exportCsv} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Export CSV</button>
            </div>
          </div>
        </div>

        {applied.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No applied internships yet. Explore and click Apply to save listings here.</div>
        ) : (
          <div className="space-y-3">
            {applied.map(i => {
              const isExpanded = expandedId === i.id;
              return (
                <div key={i.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-5 flex items-start justify-between hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : i.id)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-white">{i.title}</div>
                        <div className="text-sm text-slate-400">@ {i.company}</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{i.domain} • {i.city} • ₹{i.stipend.toLocaleString()}/mo • {i.applications.toLocaleString()} apps</div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleApply(i.id); }} 
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium"
                      >
                        Withdraw
                      </button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t border-white/5 px-5 py-4 bg-white/[0.02]">
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{i.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">Duration</div>
                          <div className="text-sm font-bold text-white">{i.duration}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">Rating</div>
                          <div className="text-sm font-bold text-amber-400">⭐ {i.rating}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">Openings</div>
                          <div className="text-sm font-bold text-white">{i.openings}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">Type</div>
                          <div className="text-sm font-bold text-white">{i.type}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {i.skills.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <a href={i.url || '#'} target="_blank" rel="noreferrer" className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-center text-sm font-medium">Apply Now</a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
