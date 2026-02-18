
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { AuthForms } from './components/AuthForms';
import { FileUploader } from './components/FileUploader';
import { AnalysisView } from './components/AnalysisView';
import { analyzeMedicalDocument } from './services/geminiService';
import { AnalysisState, User, MedicalAnalysis } from './types';
import { Loader2, AlertCircle, Sparkles, History, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cityTier, setCityTier] = useState<'Tier-1' | 'Tier-2' | 'Tier-3'>('Tier-1');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [state, setState] = useState<AnalysisState>({
    file: null, preview: null, isAnalyzing: false, result: null, error: null
  });
  const [history, setHistory] = useState<MedicalAnalysis[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('prescription_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadHistory(parsedUser.id);
    }
    setIsAuthLoading(false);
  }, []);

  const loadHistory = (userId: string) => {
    const storedHistory = localStorage.getItem(`prescription_history_${userId}`);
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  };

  const handleAnalyze = async () => {
    if (!state.preview || !state.file) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const base64Data = state.preview.split(',')[1];
      const mimeType = state.file.type;
      const analysisResult = await analyzeMedicalDocument(base64Data, mimeType, cityTier);
      
      setState(prev => ({ ...prev, isAnalyzing: false, result: analysisResult }));
      if (user) {
        const item = { ...analysisResult, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() };
        const updatedHistory = [item, ...history];
        setHistory(updatedHistory);
        localStorage.setItem(`prescription_history_${user.id}`, JSON.stringify(updatedHistory));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Analysis failed. Try a clearer image." }));
    }
  };

  const clearFile = () => {
    setState({
      file: null,
      preview: null,
      isAnalyzing: false,
      result: null,
      error: null
    });
  };

  const goHome = useCallback(() => {
    if (!user) {
      setAuthView('landing');
    } else {
      clearFile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!user && authView !== 'landing') return (
    <Layout 
      user={null} 
      onLogout={() => {}} 
      onLoginClick={() => setAuthView('login')}
      onLogoClick={goHome}
    >
      <div className="py-20 flex justify-center px-4">
        <AuthForms 
          type={authView as any} 
          onSubmit={async(d)=>{const u = {id:'1',...d}; setUser(u); localStorage.setItem('prescription_user',JSON.stringify(u)); setAuthView('landing')}} 
          onGoogleLogin={async()=>{}} 
          onSwitch={()=>setAuthView(authView==='login'?'signup':'login')} 
        />
      </div>
    </Layout>
  );
  if (!user) return <Layout user={null} onLogout={()=>{}} onLoginClick={()=>setAuthView('login')} onLogoClick={goHome} showLanding><LandingPage onGetStarted={()=>setAuthView('signup')} /></Layout>;

  return (
    <Layout user={user} onLogout={()=>{setUser(null); localStorage.removeItem('prescription_user')}} onLogoClick={goHome}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-6">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                 <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Location Context
               </h3>
               <select 
                 value={cityTier} 
                 onChange={(e) => setCityTier(e.target.value as any)}
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="Tier-1">Metro / Tier 1 (Mumbai, Delhi, BLR)</option>
                 <option value="Tier-2">Tier 2 (Pune, Jaipur, Lucknow)</option>
                 <option value="Tier-3">Tier 3 / Rural</option>
               </select>
               <p className="text-[10px] text-slate-400 mt-2 italic">*Benchmarks adjust based on city living costs.</p>
             </div>
             
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center"><History className="w-5 h-5 mr-2 text-blue-600" /> History</h3>
               <div className="space-y-3">
                 {history.map(h => (
                   <button key={h.id} onClick={() => setState(prev => ({ ...prev, result: h }))} className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                     <p className="text-[10px] font-bold text-blue-600 uppercase">{h.documentType}</p>
                     <p className="text-sm font-semibold truncate">{h.summary}</p>
                   </button>
                 ))}
               </div>
             </div>
          </div>

          <div className="lg:col-span-8">
            {state.isAnalyzing ? (
              <div className="bg-white p-20 rounded-[3rem] text-center">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold">Scanning Medical IQ...</h2>
                <p className="text-slate-500 mt-2">Checking medicine database and hospital price charts.</p>
                <div className="mt-8 flex justify-center items-center space-x-2 text-blue-600 text-sm font-medium">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Analyzing medical context...</span>
                </div>
              </div>
            ) : state.result ? (
              <div>
                <button onClick={() => setState(p => ({ ...p, result: null, file: null, preview: null }))} className="mb-4 text-blue-600 font-bold">&larr; New Scan</button>
                <AnalysisView analysis={state.result} />
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                <h2 className="text-2xl font-bold mb-6">Scan Prescription or Bill</h2>
                <FileUploader 
                  onFileSelect={(f) => {
                    const r = new FileReader();
                    r.onload = () => setState(p => ({ ...p, file: f, preview: r.result as string }));
                    r.readAsDataURL(f);
                  }} 
                  selectedFile={state.file} 
                  onClear={() => setState(p => ({ ...p, file: null, preview: null }))} 
                />
                {state.file && (
                  <button onClick={handleAnalyze} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Run Prescription IQ Scan</span>
                  </button>
                )}
                {state.error && (
                  <div className="mt-6 flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{state.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default App;