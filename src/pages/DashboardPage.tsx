import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Star,
  BarChart3,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { type Internship } from '../data/internships';

const COLORS = [
  '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6',
  '#fb923c', '#fbbf24', '#34d399', '#22d3ee', '#60a5fa',
  '#f87171', '#4ade80', '#facc15', '#a3e635', '#2dd4bf',
];

interface DashboardPageProps {
  internships: Internship[];
  onBack: () => void;
  canGoBack: boolean;
}

export function DashboardPage({ internships, onBack, canGoBack }: DashboardPageProps) {
  const stats = useMemo(() => {
    const totalApps = internships.reduce((s, i) => s + i.applications, 0);
    const avgStipend = Math.round(internships.reduce((s, i) => s + i.stipend, 0) / internships.length);
    const avgRating = (internships.reduce((s, i) => s + i.rating, 0) / internships.length).toFixed(1);
    const remoteCount = internships.filter(i => i.type === 'Remote').length;
    return { totalApps, avgStipend, avgRating, remoteCount };
  }, [internships]);

  const domainData = useMemo(() => {
    const map = new Map<string, { count: number; apps: number; stipend: number }>();
    internships.forEach(i => {
      const d = map.get(i.domain) || { count: 0, apps: 0, stipend: 0 };
      d.count++;
      d.apps += i.applications;
      d.stipend += i.stipend;
      map.set(i.domain, d);
    });
    return Array.from(map.entries())
      .map(([domain, d]) => ({
        domain: domain.length > 15 ? domain.slice(0, 13) + '..' : domain,
        fullDomain: domain,
        count: d.count,
        applications: d.apps,
        avgStipend: Math.round(d.stipend / d.count),
      }))
      .sort((a, b) => b.count - a.count);
  }, [internships]);

  const cityData = useMemo(() => {
    const map = new Map<string, number>();
    internships.forEach(i => {
      map.set(i.city, (map.get(i.city) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [internships]);

  const typeData = useMemo(() => {
    const map = new Map<string, number>();
    internships.forEach(i => {
      map.set(i.type, (map.get(i.type) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [internships]);

  const stipendRanges = useMemo(() => {
    const ranges = [
      { range: '0-10K', min: 0, max: 10000, count: 0 },
      { range: '10K-20K', min: 10000, max: 20000, count: 0 },
      { range: '20K-30K', min: 20000, max: 30000, count: 0 },
      { range: '30K-50K', min: 30000, max: 50000, count: 0 },
      { range: '50K-80K', min: 50000, max: 80000, count: 0 },
      { range: '80K+', min: 80000, max: Infinity, count: 0 },
    ];
    internships.forEach(i => {
      const r = ranges.find(r => i.stipend >= r.min && i.stipend < r.max);
      if (r) r.count++;
    });
    return ranges.map(r => ({ range: r.range, count: r.count }));
  }, [internships]);

  const skillsData = useMemo(() => {
    const map = new Map<string, number>();
    internships.forEach(i => {
      i.skills.forEach(s => {
        map.set(s, (map.get(s) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [internships]);

  const growthData = useMemo(() => {
    const domains = [...new Set(internships.map(i => i.domain))].slice(0, 8);
    return domains.map(d => {
      const items = internships.filter(i => i.domain === d);
      const avgGrowth = items.reduce((s, i) => s + i.growthTrend, 0) / items.length;
      return {
        domain: d.length > 12 ? d.slice(0, 10) + '..' : d,
        growth: Math.round(avgGrowth * 10) / 10,
      };
    }).sort((a, b) => b.growth - a.growth);
  }, [internships]);

  const radarData = useMemo(() => {
    const topDomains = [...new Set(internships.map(i => i.domain))].slice(0, 6);
    return topDomains.map(d => {
      const items = internships.filter(i => i.domain === d);
      return {
        domain: d.length > 12 ? d.slice(0, 10) + '..' : d,
        demand: Math.round(items.reduce((s, i) => s + i.demandScore, 0) / items.length),
        stipend: Math.round(items.reduce((s, i) => s + i.stipend, 0) / items.length / 1000),
        openings: items.reduce((s, i) => s + i.openings, 0),
      };
    });
  }, [internships]);

  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, idx) => {
      const items = internships.filter(i => {
        const m = parseInt(i.postedDate.split('-')[1]);
        return m === idx + 1;
      });
      return {
        month,
        listings: items.length,
        applications: items.reduce((s, i) => s + i.applications, 0),
      };
    });
  }, [internships]);

  // Demand heatmap data: domain × city
  const heatmapData = useMemo(() => {
    const topDomains = domainData.slice(0, 6).map(d => d.fullDomain);
    const topCities = cityData.slice(0, 6).map(c => c.city);

    return topDomains.map(domain => {
      const row: Record<string, string | number> = { domain: domain.length > 14 ? domain.slice(0, 12) + '..' : domain };
      topCities.forEach(city => {
        const count = internships.filter(i => i.domain === domain && i.city === city).length;
        row[city] = count;
      });
      return row;
    });
  }, [internships, domainData, cityData]);

  const topCitiesForHeatmap = cityData.slice(0, 6).map(c => c.city);

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
          <h1 className="text-4xl font-black text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Real-time internship market insights across India
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Briefcase, label: 'Total Listings', value: internships.length.toString(), color: 'from-indigo-500 to-blue-600' },
            { icon: Users, label: 'Total Applications', value: stats.totalApps.toLocaleString(), color: 'from-purple-500 to-pink-600' },
            { icon: DollarSign, label: 'Avg Stipend', value: `₹${stats.avgStipend.toLocaleString()}`, color: 'from-emerald-500 to-teal-600' },
            { icon: Star, label: 'Avg Rating', value: stats.avgRating, color: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Domain Distribution */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Internships by Domain</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={domainData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="domain" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* City Distribution */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Internships by City</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="city" stroke="#94a3b8" fontSize={11} angle={-35} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {cityData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Work Type Distribution */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Work Type Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  stroke="none"
                >
                  {typeData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stipend Distribution */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Stipend Distribution (₹/month)</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stipendRanges}>
                <defs>
                  <linearGradient id="stipendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#818cf8"
                  fill="url(#stipendGrad)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Skills */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-white">Most In-Demand Skills</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={skillsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="skill" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {skillsData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Trends */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">Domain Growth Trends (%)</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="domain" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val) => `${val}%`}
                />
                <Bar dataKey="growth" radius={[6, 6, 0, 0]}>
                  {growthData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={_entry.growth >= 0 ? '#34d399' : '#f87171'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Width Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trend */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Monthly Listing Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="listings" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">Domain Comparison Radar</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Demand" dataKey="demand" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                <Radar name="Stipend (K)" dataKey="stipend" stroke="#f472b6" fill="#f472b6" fillOpacity={0.2} />
                <Legend />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-bold text-white">Demand Heatmap — Domain × City</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold text-slate-400 p-3">Domain</th>
                  {topCitiesForHeatmap.map(city => (
                    <th key={city} className="text-center text-sm font-semibold text-slate-400 p-3">
                      {city}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="text-sm font-medium text-slate-300 p-3">{row.domain as string}</td>
                    {topCitiesForHeatmap.map(city => {
                      const val = row[city] as number;
                      const maxVal = 5;
                      const intensity = Math.min(val / maxVal, 1);
                      const bg = val === 0
                        ? 'bg-slate-800/50'
                        : intensity < 0.3
                        ? 'bg-indigo-900/40'
                        : intensity < 0.6
                        ? 'bg-indigo-700/50'
                        : 'bg-indigo-500/60';
                      return (
                        <td key={city} className="p-2 text-center">
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} text-white font-bold text-lg transition-all hover:scale-110`}
                          >
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-xs text-slate-500">Low</span>
            <div className="flex gap-1">
              <div className="w-6 h-3 rounded bg-slate-800/50" />
              <div className="w-6 h-3 rounded bg-indigo-900/40" />
              <div className="w-6 h-3 rounded bg-indigo-700/50" />
              <div className="w-6 h-3 rounded bg-indigo-500/60" />
            </div>
            <span className="text-xs text-slate-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
