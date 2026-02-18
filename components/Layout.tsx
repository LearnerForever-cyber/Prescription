
import React from 'react';
import { Heart, ShieldCheck, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onLoginClick?: () => void;
  onLogoClick?: () => void;
  showLanding?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLoginClick, onLogoClick, showLanding }) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    } else if (showLanding) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={handleLogoClick}>
              <div className="p-2 bg-blue-600 rounded-xl transition-transform group-hover:scale-110">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-800">Prescrip<span className="text-blue-600">tion</span></span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {showLanding && (
                <>
                  <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it works</a>
                  <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                </>
              )}
              
              {user ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-100 rounded-full">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Log In / Join
                </button>
              )}
            </nav>

            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-bold tracking-tight text-white">Prescription</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6 leading-relaxed text-sm">
                Empowering Indian families with AI-driven medical document clarity. Secure, private, and jargon-free healthcare explanations.
              </p>
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-medium">
                <ShieldCheck className="w-5 h-5" />
                <span>HIPAA-inspired Security Standards</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onLogoClick ? onLogoClick() : window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Analyzer Tool</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500">&copy; 2024 Prescription AI India. Not a replacement for professional medical advice.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">Twitter</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">LinkedIn</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};