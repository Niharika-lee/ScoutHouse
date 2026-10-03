import { Heart, Scale, Mail, User as UserIcon, ArrowRight, Search } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/PropertyCard';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface TenantDashboardProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function TenantDashboard({ onNavigate }: TenantDashboardProps) {
  const { user } = useUser();
  const { shortlist, compareList, getAllProperties } = useApp();

  if (!user) {
    return null;
  }

  const allProps = getAllProperties();
  const savedProperties = allProps.filter((p) => shortlist.includes(p.id));
  const compareProperties = allProps.filter((p) => compareList.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <UserIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.fullName ?? user.firstName ?? 'Tenant'}</h1>
            <p className="flex items-center gap-1.5 text-sm text-blue-50">
              <Mail className="h-3.5 w-3.5" />
              {user.primaryEmailAddress?.emailAddress ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-slate-500">Saved properties</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{savedProperties.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-500">Comparing</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{compareProperties.length}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-1">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-medium text-slate-500">Account type</span>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">Tenant</p>
        </div>
      </div>

      {/* Compare selection */}
      {compareProperties.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Current compare selection</h2>
            <button
              onClick={() => onNavigate('compare')}
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View comparison
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compareProperties.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <img src={p.images[0]} alt={p.title} className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                  <p className="truncate text-xs text-slate-500">{p.area}, {p.city}</p>
                  <p className="text-sm font-bold text-blue-700">₹{p.rent.toLocaleString('en-IN')}/mo</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved properties */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Saved properties</h2>
          <button
            onClick={() => onNavigate('shortlist')}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {savedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Heart className="h-10 w-10 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-600">No saved properties yet</p>
            <p className="mt-1 text-xs text-slate-400">Tap the heart on any property to save it here</p>
            <button
              onClick={() => onNavigate('listings')}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Explore listings
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {savedProperties.slice(0, 6).map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', { id: p.id })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
