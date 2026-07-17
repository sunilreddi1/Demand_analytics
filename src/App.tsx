import { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { RecommendPage } from './pages/RecommendPage';
import { PredictPage } from './pages/PredictPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResumeSearchPage } from './pages/ResumeSearchPage';
import { AppliedPage } from './pages/AppliedPage';
import { generateInternships, type StudentProfile } from './data/internships';

export function App() {
  const [activePage, setActivePage] = useState('home');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(() => {
    // start with empty set; we'll fetch persisted applied IDs from the backend on mount
    return new Set<number>();
  });
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('internmatch_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { name: '', skills: [], location: '', interests: [], experience: 'Beginner', preferredType: 'Any' as const, minStipend: 0 };
  });

  const internships = useMemo(() => generateInternships(), []);

  useEffect(() => {
    localStorage.setItem('internmatch_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    // keep a local copy for fast UI, but also persist to backend when toggling
    localStorage.setItem('internmatch_applied', JSON.stringify([...appliedIds]));
  }, [appliedIds]);

  const handleNavigate = useCallback((page: string) => {
    setPageHistory(prev => [...prev, page]);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setPageHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      const previousPage = newHistory[newHistory.length - 1];
      setActivePage(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newHistory;
    });
  }, []);

  const toggleApply = useCallback((id: number) => {
    setAppliedIds(prev => {
      const next = new Set(prev);
      const adding = !next.has(id);
      if (adding) next.add(id); else next.delete(id);
      // send update to backend (best-effort)
      fetch('http://localhost:5000/api/applied', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: adding ? 'add' : 'remove' }),
      }).catch(() => { /* ignore network errors */ });
      return next;
    });
  }, []);

  // load persisted applied IDs from backend once on mount
  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:5000/api/applied')
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data && Array.isArray(data.applied)) setAppliedIds(new Set(data.applied));
      }).catch(() => {
        // fallback to localStorage if backend not reachable
        const saved = localStorage.getItem('internmatch_applied');
        if (saved) {
          try { setAppliedIds(new Set(JSON.parse(saved) as number[])); } catch {}
        }
      });
    return () => { mounted = false; };
  }, []);

  const canGoBack = pageHistory.length > 1;

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} appliedCount={appliedIds.size} />;
      case 'dashboard':
        return <DashboardPage internships={internships} onBack={handleBack} canGoBack={canGoBack} />;
      case 'explore':
        return <ExplorePage internships={internships} appliedIds={appliedIds} onToggleApply={toggleApply} onBack={handleBack} canGoBack={canGoBack} />;
      case 'recommend':
        return <RecommendPage internships={internships} studentProfile={studentProfile} onNavigate={handleNavigate} appliedIds={appliedIds} onToggleApply={toggleApply} onBack={handleBack} canGoBack={canGoBack} />;
      case 'predict':
        return <PredictPage internships={internships} onBack={handleBack} canGoBack={canGoBack} />;
      case 'profile':
        return <ProfilePage studentProfile={studentProfile} onUpdateProfile={setStudentProfile} onNavigate={handleNavigate} onBack={handleBack} canGoBack={canGoBack} />;
      case 'applied':
        return <AppliedPage internships={internships} appliedIds={appliedIds} onToggleApply={toggleApply} onBack={handleBack} canGoBack={canGoBack} />;
      case 'resume':
        return <ResumeSearchPage internships={internships} appliedIds={appliedIds} onToggleApply={toggleApply} onBack={handleBack} canGoBack={canGoBack} />;
      default:
        return <HomePage onNavigate={handleNavigate} appliedCount={appliedIds.size} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar activePage={activePage} onNavigate={handleNavigate} appliedCount={appliedIds.size} />
      {renderPage()}
    </div>
  );
}
