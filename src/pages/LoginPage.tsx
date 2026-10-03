import { useState } from 'react';
import { Mail, Lock, ArrowRight, Compass, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface LoginPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }
    const result = login(email.trim(), password);
    if (!result.ok) {
      setError(result.error ?? 'Login failed');
      return;
    }
    const role: UserRole | undefined = result.role;
    onNavigate(role === 'Owner' ? 'owner-dashboard' : 'tenant-dashboard');
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to your ScoutHouse account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Lock className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
          >
            Log in
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-700">Demo accounts</p>
            <div className="mt-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('student@demo.com')}
                className="text-left text-xs text-blue-600 hover:underline"
              >
                Tenant: student@demo.com / demo123
              </button>
              <button
                type="button"
                onClick={() => fillDemo('owner@demo.com')}
                className="text-left text-xs text-blue-600 hover:underline"
              >
                Owner: owner@demo.com / demo123
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            No account?{' '}
            <button type="button" onClick={() => onNavigate('signup')} className="font-semibold text-blue-600 hover:text-blue-700">
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
