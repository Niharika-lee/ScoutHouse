import { Compass, ShieldAlert } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 text-white">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-white">
              Scout<span className="text-teal-400">House</span>
            </span>
          </div>
          <p className="text-center text-sm text-slate-400 md:text-right">
            Know the cost. Know the place. Know the terms. Before you move.
          </p>
        </div>
        <div className="mt-8 flex items-start gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-xs leading-relaxed text-slate-400">
            ScoutHouse helps you compare and prepare. Always confirm details with the owner and read the agreement before paying.
            All property details are estimated or user-reported. ScoutHouse does not verify listings.
          </p>
        </div>
      </div>
    </footer>
  );
}
