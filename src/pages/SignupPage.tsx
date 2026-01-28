import React, { useState } from 'react';
import { Mail, Lock, Loader2, BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@context/AuthContext';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loading, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      setError('The confirm password does not match!');
      return;
    }
    const response = await signUp(email, password);
    console.log(response);
    if (response.error) {
      setError(response.error.message);
      return;
    }
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="flex items-center justify-center p-5 sm:p-15">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse animate-in fade-in zoom-in duration-300">
        {/* Right Side - Hero (Reversed) */}
        <div className="md:w-1/2 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">VocabAI</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Start Your Journey.</h2>
            <p className="text-slate-400 leading-relaxed">
              Create an account to save your progress, access your flashcards from anywhere, and
              track your learning milestones.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <div className="h-px bg-slate-700 w-8"></div>
              Join for free
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-10 -right-10 w-64 h-64 bg-indigo-900 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-10 left-10 w-40 h-40 bg-indigo-600 rounded-full opacity-20 blur-2xl"></div>
        </div>

        {/* Left Side - Form */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h3>
          <p className="text-slate-500 mb-8">It's free and takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Confirm the password"
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
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="text-indigo-600 font-bold hover:underline"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
