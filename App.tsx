import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthForms } from './components/AuthForms.tsx';
import { FileUploader } from './components/FileUploader.tsx';
import { AnalysisView } from './components/AnalysisView.tsx';
import { analyzeMedicalDocument } from './services/geminiService.ts';
import { AnalysisState, User, MedicalAnalysis } from './types.ts';
import { Loader2, AlertCircle, Sparkles, History, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cityTier, setCityTier] = useState<'Tier-1' | 'Tier-2' | 'Tier-3'>('Tier-1');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [state, setState] = useState<AnalysisState>({
    file: null, 
    preview: null, 
    isAnalyzing: false, 
    result: null, 
    error: null
  });
  const [history, setHistory] = useState<MedicalAnalysis[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('prescription_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const storedHistory = localStorage.getItem(`history_${parsedUser.id}`);
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    }
    setIsAuthLoading(false);
  }, []);

  const handleAuthSubmit = async (data: any) => {
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: data.name || data.email.split('@')[0], 
      email: data.email,
      cityTier
    };
    setUser(newUser);
    localStorage.setItem('prescription_user', JSON.stringify(newUser));
    setAuthView('landing');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('prescription_user');
    setHistory([]);
    setAuthView('landing');
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setState(prev => ({ ...prev, file, preview: reader.result as string, error: null, result: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!state.preview || !state.file) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const base64Data = state.preview.split(',')[1];
      const result = await analyzeMedicalDocument(base64Data, state.file.type, cityTier);
      const enriched = { ...result, id: Date.now().toString(), timestamp: Date.now() };
      setState(prev => ({ ...prev, isAnalyzing: false, result: enriched }));
      if (user) {
        const newHistory = [enriched, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem(`history_${user.id}`, JSON.stringify(newHistory));
      }
    } catch (err) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Analysis failed. Please try a clearer photo." }));
    }
  };

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user && authView !== 'landing') {
    return (
      <Layout user={null} onLogout={() => {}} onLoginClick={() => setAuthView('login')} onLogoClick={() => setAuthView('landing')}>
        <div className="py-12"><AuthForms type={authView as any} onSubmit={handleAuthSubmit} onGoogleLogin={async () => {}} onSwitch={() => setAuthView(authView === 'login' ? 'signup' : 'login')} /></div>
      </Layout>
    );
  }

  if (!user) return <Layout user={null} onLogout={() => {}} onLoginClick={() => setAuthView('login')} showLanding><LandingPage onGetStarted={() => setAuthView('signup')} /></Layout>;

  return (
    <Layout user={user} onLogout={handleLogout} onLogoClick={() => setState(p => ({ ...p, result: null }))}>
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6 no-print">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold flex items-center mb-4"><MapPin className="w-5 h-5 mr-2 text-blue-600" /> City Tier</h3>
            <select value={cityTier} onChange={(e) => setCityTier(e.target.value as any)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none">
              <option value="Tier-1">Metro (Tier 1)</option>
              <option value="Tier-2">Tier 2 Cities</option>
              <option value="Tier-3">Tier 3 / Rural</option>
            </select>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold flex items-center mb-4"><History className="w-5 h-5 mr-2 text-blue-600" /> Recent Scans</h3>
            <div className="space-y-2">
              {history.map(h => (
                <button key={h.id} onClick={() => setState(p => ({ ...p, result: h }))} className={`w-full text-left p-3 rounded-xl border ${state.result?.id === h.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">{h.documentType}</p>
                  <p className="text-sm font-semibold truncate">{h.summary}</p>
                </button>
              ))}
              {history.length === 0 && <p className="text-xs text-slate-400 text-center">No history yet</p>}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8">
          {state.isAnalyzing ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-2xl font-bold">Scanning Document...</h2>
            </div>
          ) : state.result ? (
            <AnalysisView analysis={state.result} />
          ) : (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 text-center">
              <h2 className="text-3xl font-bold mb-6">Medical Document IQ</h2>
              <FileUploader onFileSelect={handleFileSelect} selectedFile={state.file} onClear={() => setState(p => ({ ...p, file: null, preview: null }))} />
              {state.file && (
                <button onClick={handleAnalyze} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-100">
                  <Sparkles className="w-5 h-5" /> <span>Analyze Now</span>
                </button>
              )}
              {state.error && <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-sm font-bold">{state.error}</div>}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default App;