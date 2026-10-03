import { X, SlidersHorizontal } from 'lucide-react';
import type { Filters as FiltersType } from '@/types';
import { propertyTypes, furnishedOptions, genderOptions, availabilityOptions, maxBudgetDefault, maxDistanceDefault } from '@/data/properties';

interface FiltersPanelProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersPanel({ filters, onChange, isOpen, onClose }: FiltersPanelProps) {
  const toggleArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const panel = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
          Filters
        </h2>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Budget */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Max Budget: ₹{filters.budgetMax.toLocaleString('en-IN')}/mo
        </label>
        <input
          type="range"
          min={5000}
          max={maxBudgetDefault}
          step={500}
          value={filters.budgetMax}
          onChange={(e) => onChange({ ...filters, budgetMax: Number(e.target.value) })}
          className="w-full accent-blue-600"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>₹5,000</span>
          <span>₹{maxBudgetDefault.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Property Type</p>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...filters, types: toggleArray(filters.types, t) })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.types.includes(t)
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Furnishing</p>
        <div className="flex flex-wrap gap-2">
          {furnishedOptions.map((f) => (
            <button
              key={f}
              onClick={() => onChange({ ...filters, furnished: toggleArray(filters.furnished, f) })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.furnished.includes(f)
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Max Distance: {filters.maxDistance} km from college
        </label>
        <input
          type="range"
          min={0.5}
          max={maxDistanceDefault}
          step={0.5}
          value={filters.maxDistance}
          onChange={(e) => onChange({ ...filters, maxDistance: Number(e.target.value) })}
          className="w-full accent-teal-600"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>0.5 km</span>
          <span>{maxDistanceDefault} km</span>
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Gender Preference</p>
        <div className="flex flex-wrap gap-2">
          {(['Any', ...genderOptions.filter((g) => g !== 'Any')] as const).map((g) => (
            <button
              key={g}
              onClick={() => onChange({ ...filters, gender: g })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.gender === g
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Availability</p>
        <div className="flex flex-wrap gap-2">
          {(['Any', ...availabilityOptions] as const).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ ...filters, availability: a })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.availability === a
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            Filters
          </h2>
          {panel}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl">
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
