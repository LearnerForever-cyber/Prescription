
import React from 'react';
import { Heart, ShieldCheck, Zap, BarChart3, Clock, ArrowRight, ShieldAlert } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>Trusted by 10,000+ Indian Families</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                Understand your <span className="text-blue-600">Medical Journey</span> clearly.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Prescription uses advanced AI to simplify complex hospital bills, decode doctors' handwriting, and explain lab reports in plain language.
              </p>
              <div className="flex flex-col sm:sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center group"
                >
                  Start Analyzing Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#how-it-works" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all text-center">
                  How it works
                </a>
              </div>
              <div className="mt-10 flex items-center space-x-6 grayscale opacity-60">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">As Seen On</span>
                <span className="font-bold text-lg">HealthTimes</span>
                <span className="font-bold text-lg">DailyPulse</span>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 relative">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase">Alert Detected</p>
                      <p className="text-sm font-semibold">"Consumables" charge of ₹4,500 flagged</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl translate-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-700 uppercase">AI Explanation</p>
                      <p className="text-sm font-semibold">TDS means 3 times a day (after meals)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Three simple steps to clarify your medical documents.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
              <h3 className="font-bold text-lg">Secure Upload</h3>
              <p className="text-slate-500">Take a photo of your medical document. Your data is encrypted and private.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
              <h3 className="font-bold text-lg">AI Analysis</h3>
              <p className="text-slate-500">Our Gemini-powered AI scans handwriting, medical codes, and bill items.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
              <h3 className="font-bold text-lg">Plain Language Result</h3>
              <p className="text-slate-500">Get a simplified report flagging overcharges and explaining jargon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why thousands of families use Prescription</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Billing Transparency</h3>
              <p className="text-slate-600 leading-relaxed">
                We scan hospital bills to find hidden charges, excessive consumable fees, and billing errors that insurance often rejects.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Jargon-Free Reports</h3>
              <p className="text-slate-600 leading-relaxed">
                Confused by "CBC" or "HbA1c"? Get simple, contextual explanations that help you prepare for your next doctor visit.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Secure History</h3>
              <p className="text-slate-600 leading-relaxed">
                Keep all your medical document explanations in one secure place. Accessible anytime, anywhere for your whole family.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};