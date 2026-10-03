import { Scale, X, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface CompareBarProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function CompareBar({ onNavigate }: CompareBarProps) {
  const { compareList, clearCompare, getAllProperties } = useApp();
  const compareProperties = getAllProperties().filter((p) => compareList.includes(p.id));

  if (compareProperties.length === 0) return null;

  const canCompare = compareProperties.length >= 2;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-lg shadow-slate-300/30">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Scale className="h-5 w-5 shrink-0 text-blue-600" />
            <span className="shrink-0 text-sm font-semibold text-slate-700">
              {compareProperties.length} selected
            </span>
            <div className="flex gap-2">
              {compareProperties.map((p) => (
                <div key={p.id} className="relative shrink-0">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="h-10 w-14 rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={clearCompare}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
            >
              Clear
            </button>
            <button
              onClick={() => canCompare && onNavigate('compare')}
              disabled={!canCompare}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                canCompare
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:shadow-lg hover:shadow-blue-200'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              Compare now
              {canCompare && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
            {!canCompare && (
              <span className="hidden text-xs text-slate-400 sm:inline">
                Select 2 or more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
