import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Compass, UserCircle, ArrowRight, Check } from 'lucide-react';
import type { UserRole } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface OnboardingPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  const { user } = useUser();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setSaving(true);
    try {
      await user.update({ unsafeMetadata: { role: selected } });
      onNavigate(selected === 'Owner' ? 'owner-dashboard' : 'tenant-dashboard');
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Welcome to ScoutHouse</h1>
          <p className="mt-1 text-sm text-slate-500">Tell us how you'll be using the app</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-3">
            {(['Tenant', 'Owner'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setSelected(r)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-6 text-sm font-medium transition ${
                  selected === r
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <UserCircle className="h-8 w-8" />
                {r}
                {selected === r && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400">
            {selected === 'Tenant'
              ? 'You can save and compare properties, and manage your shortlist.'
              : selected === 'Owner'
              ? 'You can post and manage your own rental listings.'
              : 'Choose a role to continue.'}
          </p>

          <button
            onClick={handleContinue}
            disabled={!selected || saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
