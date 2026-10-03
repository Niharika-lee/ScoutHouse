import { Heart, Search, ArrowRight, StickyNote } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/PropertyCard';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface ShortlistPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function ShortlistPage({ onNavigate }: ShortlistPageProps) {
  const { shortlist, toggleShortlist, notes, setNote } = useApp();
  const { getAllProperties } = useApp();
  const allProperties = getAllProperties();
  const savedProperties = allProperties.filter((p) => shortlist.includes(p.id));

  if (savedProperties.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <Heart className="h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">No saved properties yet.</p>
          <p className="mt-1 text-xs text-slate-400">Start exploring!</p>
          <button
            onClick={() => onNavigate('listings')}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Search className="h-4 w-4" />
            Explore listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Shortlist</h1>
        <p className="mt-1 text-sm text-slate-500">
          {savedProperties.length} saved propert{savedProperties.length === 1 ? 'y' : 'ies'} · Add personal notes to help you decide
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {savedProperties.map((p) => (
          <div key={p.id} className="flex flex-col gap-3">
            <PropertyCard property={p} onClick={() => onNavigate('detail', { id: p.id })} />
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <StickyNote className="h-3.5 w-3.5 text-blue-500" />
                Personal notes
              </label>
              <textarea
                value={notes[p.id] ?? ''}
                onChange={(e) => setNote(p.id, e.target.value)}
                placeholder="e.g. Visit on weekends, ask about AC, good backup option if p01 is taken..."
                rows={2}
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {notes[p.id]?.length ?? 0} characters
                </span>
                <button
                  onClick={() => toggleShortlist(p.id)}
                  className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
                >
                  <Heart className="h-3.5 w-3.5 fill-red-500" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
        <button
          onClick={() => onNavigate('listings')}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Continue exploring
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
