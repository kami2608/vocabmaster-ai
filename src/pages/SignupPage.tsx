import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@context/AuthContext';
import RightSideHero from '@components/RightSideHero';
import Input from '@components/Input';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loading, signUp } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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
        <RightSideHero />

        {/* Left Side - Form */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h3>
          <p className="text-slate-500 mb-8">It's free and takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                startIcon={<Mail className=" text-slate-400" size={18} />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <Input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                startIcon={<Lock className=" text-slate-400" size={18} />}
                endIcon={
                  showPass ? (
                    <Eye size={18} className="text-slate-400" />
                  ) : (
                    <EyeOff size={18} className="text-slate-400" />
                  )
                }
                onEndIconClick={() => setShowPass(!showPass)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>
              <Input
                type={showConfirmPass ? 'text' : 'password'}
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Confirm your password"
                required
                startIcon={<Lock className=" text-slate-400" size={18} />}
                endIcon={
                  showConfirmPass ? (
                    <Eye size={18} className="text-slate-400" />
                  ) : (
                    <EyeOff size={18} className="text-slate-400" />
                  )
                }
                onEndIconClick={() => setShowConfirmPass(!showConfirmPass)}
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
