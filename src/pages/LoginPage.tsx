import React, { useState } from 'react';
import { Mail, Lock, Loader2, BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loading, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signIn(email, password);
    console.log(response);
    if (response.error) {
      setError(response.error.message);
      return;
    }
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="flex items-center justify-center p-5 sm:p-15">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        {/* Left Side - Hero */}
        <div className="md:w-1/2 bg-indigo-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">VocabAI</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Master English Vocabulary Faster.
            </h2>
            <p className="text-indigo-100 leading-relaxed">
              Use AI-powered flashcards and spaced repetition to remember words forever. Join
              thousands of learners today.
            </p>
          </div>
          <div className="relative z-10 mt-12 md:mt-0">
            <div className="flex items-center gap-4 text-sm font-medium text-indigo-200">
              <div className="h-px bg-indigo-400 w-8"></div>
              Welcome Back
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute top-0 -left-10 w-40 h-40 bg-indigo-400 rounded-full opacity-30 blur-2xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Sign In</h3>
          <p className="text-slate-500 mb-8">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-in slide-in-from-left-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate({ to: '/signup' })}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
