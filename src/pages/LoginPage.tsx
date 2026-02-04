import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@context/AuthContext';
import Input from '@components/Input';
import LeftSideHero from '@components/LeftSideHero';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
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
        <LeftSideHero />

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Sign In</h3>
          <p className="text-slate-500 mb-8">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startIcon={<Mail size={18} className="text-slate-400" />}
                required
                placeholder="you@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                startIcon={<Lock size={18} className="text-slate-400" />}
                endIcon={
                  showPass ? (
                    <Eye size={18} className="text-slate-400" />
                  ) : (
                    <EyeOff size={18} className="text-slate-400" />
                  )
                }
                required
                placeholder="Enter your password"
                onEndIconClick={() => setShowPass(!showPass)}
              />
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
