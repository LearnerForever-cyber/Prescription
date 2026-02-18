
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
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const storedHistory = localStorage.getItem(`history_${parsedUser.id}`);
        if (storedHistory) setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Auth parsing error", e);
      }
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
      setState(prev => ({ 
        ...prev, 
        file, 
        preview: reader.result as string, 
        error: null, 
        result: null 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!state.preview || !state.file) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const base64Data = state.preview.split(',')[1];
      const result = await analyzeMedicalDocument(base64Data, state.file.type, cityTier);
      const enriched = { 
        ...result, 
        id: Date.now().toString(), 
        timestamp: Date.now() 
      };
      setState(prev => ({ ...prev, isAnalyzing: false, result: enriched }));
      if (user) {
        const newHistory = [enriched, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem(`history_${user.id}`, JSON.stringify(newHistory));
      }
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: "IQ Analysis failed. Please ensure the document is clearly visible and try again." 
      }));
    }
  };

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  if (!user && authView !== 'landing') {
    return (
      <Layout user={null} onLogout={() => {}} onLoginClick={() => setAuthView('login')} onLogoClick={() => setAuthView('landing')}>
        <div className="py-12">
          <AuthForms 
            type={authView as any} 
            onSubmit={handleAuthSubmit} 
            onGoogleLogin={async () => {}} 
            onSwitch={() => setAuthView(authView === 'login' ? 'signup' : 'login')} 
          />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout user={null} onLogout={() => {}} onLoginClick={() => setAuthView('login')} showLanding>
        <LandingPage onGetStarted={() => setAuthView('signup')} />
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} onLogoClick={() => setState(p => ({ ...p, result: null, file: null, preview: null }))}>
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6 no-print">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold flex items-center mb-4"><MapPin className="w-5 h-5 mr-2 text-blue-600" /> Healthcare Location</h3>
            <select 
              value={cityTier} 
              onChange={(e) => setCityTier(e.target.value as any)} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="Tier-1">Metro / Tier 1 (Mumbai, Delhi, BLR)</option>
              <option value="Tier-2">Tier 2 (Pune, Jaipur, Lucknow)</option>
              <option value="Tier-3">Tier 3 / Smaller Towns</option>
            </select>
            <p className="mt-3 text-[10px] text-slate-400 font-medium leading-relaxed">
              We use this to benchmark hospital charges and insurance expectations for your region.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <h3 className="font-bold flex items-center mb-4"><History className="w-5 h-5 mr-2 text-blue-600" /> Recent Scans</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {history.map(h => (
                <button 
                  key={h.id} 
                  // Fix: Use state update parameter 'p' instead of 'prev' which was not defined in this scope.
                  onClick={() => setState(p => ({ ...p, result: h }))} 
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${state.result?.id === h.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                >
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{h.documentType.replace('_', ' ')}</p>
                  <p className="text-sm font-semibold truncate text-slate-800">{h.summary}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(h.timestamp || 0).toLocaleDateString()}</p>
                </button>
              ))}
              {history.length === 0 && <p className="text-xs text-slate-400 text-center py-8">Your recent analysis history will appear here.</p>}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8">
          {state.isAnalyzing ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 flex flex-col items-center">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-8" />
              <h2 className="text-2xl font-bold text-slate-900">Running Medical IQ Scan...</h2>
              <p className="text-slate-500 mt-4 max-w-sm">Our AI is decoding handwriting, checking costs, and simplifying jargon for you.</p>
            </div>
          ) : state.result ? (
            <div className="space-y-4">
               <button 
                onClick={() => setState(p => ({ ...p, result: null, file: null, preview: null }))}
                className="no-print text-sm font-bold text-blue-600 flex items-center space-x-1 hover:text-blue-700"
              >
                <span>&larr; Analyze Another Document</span>
              </button>
              <AnalysisView analysis={state.result} />
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Medical Document Explainer</h2>
              <p className="text-slate-500 mb-10 max-w-md mx-auto">Upload a prescription, bill, or lab report to get a simplified explanation in plain English.</p>
              
              <FileUploader 
                onFileSelect={handleFileSelect} 
                selectedFile={state.file} 
                onClear={() => setState(p => ({ ...p, file: null, preview: null }))} 
              />
              
              {state.file && (
                <button 
                  onClick={handleAnalyze} 
                  className="w-full mt-8 bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-100 active:scale-[0.98]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze IQ</span>
                </button>
              )}
              
              {state.error && (
                <div className="mt-6 flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-bold">{state.error}</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default App;
