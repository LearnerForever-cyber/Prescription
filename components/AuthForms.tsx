
import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

interface AuthFormsProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onSwitch: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ type, onSubmit, onGoogleLogin, onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      await onGoogleLogin();
    } catch (err) {
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-500 mt-2">
          {type === 'login' ? 'Manage your medical records securely.' : 'Join Prescription to simplify your healthcare.'}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={handleGoogleClick}
          disabled={googleLoading || loading}
          className="w-full py-4 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 bg-white shadow-sm"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or with email</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'signup' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-100"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span>{type === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={onSwitch}
            className="text-blue-600 font-bold hover:underline"
          >
            {type === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};