import { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Compass, AlertCircle, UserCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface SignupPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const { signup } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Tenant');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your full name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Please enter a password';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = signup(name.trim(), email.trim(), password, role);
    if (!result.ok) {
      setErrors({ email: result.error ?? 'Signup failed' });
      return;
    }
    onNavigate(role === 'Owner' ? 'owner-dashboard' : 'tenant-dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join ScoutHouse to find and compare rentals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {errors.form && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.form}
            </div>
          )}

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <User className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Lock className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Lock className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Tenant', 'Owner'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    role === r
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <UserCircle className="h-4 w-4" />
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
          >
            Create account
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button type="button" onClick={() => onNavigate('login')} className="font-semibold text-blue-600 hover:text-blue-700">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
