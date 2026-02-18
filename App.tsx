
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
    file: null, 
    preview: null, 
    isAnalyzing: false, 
    result: null, 
    error: null
  });
  const [history, setHistory] = useState<MedicalAnalysis[]>([]);

  useEffect(() => {
    const initApp = () => {
      try {
        const storedUser = localStorage.getItem('prescription_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            const storedHistory = localStorage.getItem(`prescription_history_${parsedUser.id}`);
            if (storedHistory) {
              setHistory(JSON.parse(storedHistory));
            }
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    initApp();
  }, []);

  const handleAuthSubmit = async (data: any) => {
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: data.name || data.email.split('@')[0], 
      email: data.email,
      cityTier: cityTier
    };
    setUser(newUser);
    localStorage.setItem('prescription_user', JSON.stringify(newUser));
    setAuthView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('prescription_user');
    setHistory([]);
    setAuthView('landing');
    clearFile();
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
      const mimeType = state.file.type;
      const analysisResult = await analyzeMedicalDocument(base64Data, mimeType, cityTier);
      
      const enrichedResult: MedicalAnalysis = {
        ...analysisResult,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };
      
      setState(prev => ({ ...prev, isAnalyzing: false, result: enrichedResult }));
      
      if (user) {
        const updatedHistory = [enrichedResult, ...history];
        setHistory(updatedHistory);
        localStorage.setItem(`prescription_history_${user.id}`, JSON.stringify(updatedHistory));
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: "We couldn't analyze the document. Please ensure the image is clear and try again." 
      }));
    }
  };

  const goHome = useCallback(() => {
    if (!user) {
      setAuthView('landing');
    } else {
      clearFile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user && authView !== 'landing') {
    return (
      <Layout 
        user={null} 
        onLogout={() => {}} 
        onLoginClick={() => setAuthView('login')}
        onLogoClick={goHome}
      >
        <div className="py-20 flex justify-center px-4">
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
      <Layout 
        user={null} 
        onLogout={handleLogout} 
        onLoginClick={() => setAuthView('login')} 
        onLogoClick={goHome}
        showLanding
      >
        <LandingPage onGetStarted={() => setAuthView('signup')} />
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} onLogoClick={goHome}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 no-print">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                 <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Location Context
               </h3>
               <select 
                 value={cityTier} 
                 onChange={(e) => setCityTier(e.target.value as any)}
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
               >
                 <option value="Tier-1">Metro / Tier 1 (Mumbai, Delhi, BLR)</option>
                 <option value="Tier-2">Tier 2 (Pune, Jaipur, Lucknow)</option>
                 <option value="Tier-3">Tier 3 / Rural Cities</option>
               </select>
             </div>
             
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                 <History className="w-5 h-5 mr-2 text-blue-600" /> Recent History
               </h3>
               <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                 {history.length > 0 ? history.map(h => (
                   <button 
                     key={h.id} 
                     onClick={() => setState(prev => ({ ...prev, result: h }))} 
                     className={`w-full text-left p-3 rounded-xl transition-all border ${state.result?.id === h.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                   >
                     <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{h.documentType.replace('_', ' ')}</p>
                     <p className="text-sm font-semibold truncate text-slate-800">{h.summary}</p>
                   </button>
                 )) : (
                   <p className="text-sm text-slate-400 text-center py-4">No scans yet.</p>
                 )}
               </div>
             </div>
          </div>

          <div className="lg:col-span-8">
            {state.isAnalyzing ? (
              <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 shadow-sm flex flex-col items-center">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-6" />
                <h2 className="text-2xl font-bold text-slate-800">Prescription IQ Scanning...</h2>
              </div>
            ) : state.result ? (
              <div className="space-y-4">
                <button 
                  onClick={() => setState(p => ({ ...p, result: null, file: null, preview: null }))} 
                  className="mb-2 text-blue-600 font-bold flex items-center space-x-1 no-print"
                >
                  <span>&larr; New Scan</span>
                </button>
                <AnalysisView analysis={state.result} />
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                <h2 className="text-3xl font-bold mb-4">Document Analyzer</h2>
                <p className="text-slate-600 mb-10">Upload your bill or prescription for a simple explanation.</p>
                <FileUploader 
                  onFileSelect={handleFileSelect} 
                  selectedFile={state.file} 
                  onClear={() => setState(p => ({ ...p, file: null, preview: null }))} 
                />
                {state.file && (
                  <button 
                    onClick={handleAnalyze} 
                    className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Run IQ Scan</span>
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
