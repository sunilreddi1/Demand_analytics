import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  Users,
  Briefcase,
  Filter,
  ChevronDown,
  ChevronUp,
  Wifi,
  Building2,
  ArrowUpDown,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  Send,
} from 'lucide-react';
import { type Internship, predictDemand } from '../data/internships';

interface ExplorePageProps {
  internships: Internship[];
  appliedIds: Set<number>;
  onToggleApply: (id: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

const ITEMS_PER_PAGE = 30;

export function ExplorePage({ internships, appliedIds, onToggleApply, onBack, canGoBack }: ExplorePageProps) {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState<'all' | 'applied' | 'not_applied'>('all');
  const [sortBy, setSortBy] = useState<'applications' | 'stipend' | 'rating' | 'demandScore'>('demandScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const domains = useMemo(() => [...new Set(internships.map(i => i.domain))].sort(), [internships]);
  const cities = useMemo(() => [...new Set(internships.map(i => i.city))].sort(), [internships]);

  const filtered = useMemo(() => {
    let result = [...internships];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        i => i.title.toLowerCase().includes(s) || i.company.toLowerCase().includes(s) ||
             i.skills.some(sk => sk.toLowerCase().includes(s)) || i.domain.toLowerCase().includes(s)
      );
    }
    if (domainFilter) result = result.filter(i => i.domain === domainFilter);
    if (cityFilter) result = result.filter(i => i.city === cityFilter);
    if (typeFilter) result = result.filter(i => i.type === typeFilter);
    if (appliedFilter === 'applied') result = result.filter(i => appliedIds.has(i.id));
    if (appliedFilter === 'not_applied') result = result.filter(i => !appliedIds.has(i.id));

    result.sort((a, b) => {
      const diff = a[sortBy] - b[sortBy];
      return sortOrder === 'desc' ? -diff : diff;
    });
    return result;
  }, [internships, search, domainFilter, cityFilter, typeFilter, appliedFilter, sortBy, sortOrder, appliedIds]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // Reset page when filters change
  useMemo(() => { setCurrentPage(1); }, [search, domainFilter, cityFilter, typeFilter, appliedFilter, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearch(''); setDomainFilter(''); setCityFilter(''); setTypeFilter(''); setAppliedFilter('all');
  };
  const hasFilters = search || domainFilter || cityFilter || typeFilter || appliedFilter !== 'all';

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const appliedInFiltered = filtered.filter(i => appliedIds.has(i.id)).length;

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
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Explore Internships</h1>
              <p className="text-slate-400 text-lg">
                Browse {internships.length.toLocaleString()} live internship listings across India
              </p>
            </div>
            {appliedIds.size > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">{appliedIds.size} Applied</span>
                {appliedInFiltered !== appliedIds.size && (
                  <span className="text-slate-500 text-sm">({appliedInFiltered} shown)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, company, skills, or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-lg"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters Toggle Row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-all cursor-pointer">
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Applied filter quick toggles */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {(['all', 'applied', 'not_applied'] as const).map((val) => (
              <button
                key={val}
                onClick={() => setAppliedFilter(val)}
                className={`px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                  appliedFilter === val
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {val === 'all' ? 'All' : val === 'applied' ? '✅ Applied' : '📋 Not Applied'}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-slate-500">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50">
              <option value="demandScore">Demand Score</option>
              <option value="applications">Applications</option>
              <option value="stipend">Stipend</option>
              <option value="rating">Rating</option>
            </select>
            <button onClick={() => setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'))} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer">
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Domain</label>
              <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500/50">
                <option value="">All Domains</option>
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500/50">
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Work Type</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500/50">
                <option value="">All Types</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Count + Pagination Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length.toLocaleString()} internships
          </p>
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages.toLocaleString()}
          </p>
        </div>

        {/* Internship Cards */}
        <div className="space-y-4">
          {paginatedItems.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">No internships found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
          {paginatedItems.map((internship) => {
            const demand = predictDemand(internship);
            const isExpanded = expandedId === internship.id;
            const isApplied = appliedIds.has(internship.id);
            return (
              <div
                key={internship.id}
                className={`bg-white/5 backdrop-blur-sm border rounded-2xl hover:bg-white/[0.07] transition-all duration-300 ${
                  isApplied ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'border-white/10 hover:border-indigo-500/20'
                }`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Company Logo */}
                    <div className="text-4xl w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {internship.companyLogo}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : internship.id)}>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white truncate">{internship.title}</h3>
                            {isApplied && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                          </div>
                          <p className="text-indigo-400 font-medium">{internship.company}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-start gap-3">
                          <div className="text-right hidden sm:block">
                            <div className="text-xl font-bold text-emerald-400">
                              ₹{internship.stipend.toLocaleString()}<span className="text-sm text-slate-500">/mo</span>
                            </div>
                            <div className={`text-sm font-semibold ${demand.color}`}>{demand.level} Demand</div>
                          </div>
                          {/* APPLY TOGGLE BUTTON */}
                          <button
                            onClick={(e) => { e.stopPropagation(); onToggleApply(internship.id); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer flex-shrink-0 ${
                              isApplied
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Applied</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span className="hidden sm:inline">Apply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{internship.domain}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{internship.city}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{internship.duration}</span>
                        <span className="flex items-center gap-1">
                          {internship.type === 'Remote' ? <Wifi className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                          {internship.type}
                        </span>
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{internship.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{internship.applications.toLocaleString()} apps</span>
                      </div>

                      {/* Mobile stipend + apply */}
                      <div className="flex items-center justify-between mt-3 sm:hidden">
                        <div className="text-lg font-bold text-emerald-400">₹{internship.stipend.toLocaleString()}/mo</div>
                        <div className={`text-sm font-semibold ${demand.color}`}>{demand.level}</div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {internship.skills.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">{skill}</span>
                        ))}
                      </div>

                      {/* Expand Toggle */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : internship.id)}
                        className="mt-3 text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? 'Show less' : 'Show details'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-white/5 pt-4">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{internship.description}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-400 mb-2">Demand Prediction Factors</h4>
                          <ul className="space-y-1.5">
                            {demand.factors.length > 0 ? demand.factors.map((f, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-indigo-400 mt-0.5">•</span>{f}
                              </li>
                            )) : (
                              <li className="text-sm text-slate-500">Standard demand level</li>
                            )}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1">Demand Score</div>
                            <div className="text-xl font-bold text-white">{internship.demandScore}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1">Growth Trend</div>
                            <div className={`text-xl font-bold ${internship.growthTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {internship.growthTrend >= 0 ? '+' : ''}{internship.growthTrend}%
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1">Openings</div>
                            <div className="text-xl font-bold text-white">{internship.openings}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1">Status</div>
                            <div className={`text-sm font-bold ${isApplied ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {isApplied ? '✅ Applied' : '📋 Not Applied'}
                            </div>
                          </div>
                        </div>

                        {/* Big Apply Button in Expanded */}
                        <button
                          onClick={() => onToggleApply(internship.id)}
                          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-300 cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                          }`}
                        >
                          {isApplied ? (
                            <><CheckCircle className="w-5 h-5" /> Applied — Click to Withdraw</>
                          ) : (
                            <><Send className="w-5 h-5" /> Apply to this Internship</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* First */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              {/* Prev */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, i) =>
                typeof page === 'string' ? (
                  <span key={`dots-${i}`} className="px-2 text-slate-600">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      page === currentPage
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Last */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {filtered.length.toLocaleString()} results • {totalPages.toLocaleString()} pages • {ITEMS_PER_PAGE} per page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
