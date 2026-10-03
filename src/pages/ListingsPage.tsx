import { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { maxBudgetDefault, maxDistanceDefault } from '@/data/properties';
import type { Filters as FiltersType, SortOption, Property } from '@/types';
import { FiltersPanel } from '@/components/FiltersPanel';
import { PropertyCard } from '@/components/PropertyCard';
import { useApp } from '@/context/AppContext';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface ListingsPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
  searchParams?: Record<string, string>;
}

const defaultFilters: FiltersType = {
  budgetMax: maxBudgetDefault,
  types: [],
  furnished: [],
  maxDistance: maxDistanceDefault,
  gender: 'Any',
  availability: 'Any',
};

export function ListingsPage({ onNavigate, searchParams }: ListingsPageProps) {
  const { getAllProperties } = useApp();
  const allProperties = getAllProperties();
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('price-low');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchBudget, setSearchBudget] = useState('');

  useEffect(() => {
    if (searchParams?.search) setSearchText(searchParams.search);
    if (searchParams?.budget) {
      setSearchBudget(searchParams.budget);
      setFilters((f) => ({ ...f, budgetMax: Math.min(Number(searchParams.budget), maxBudgetDefault) }));
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result: Property[] = [...allProperties];

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.area.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.nearestCollege.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => {
      const totalMonthly = p.rent + p.maintenance;
      if (totalMonthly > filters.budgetMax) return false;
      if (filters.types.length > 0 && !filters.types.includes(p.type)) return false;
      if (filters.furnished.length > 0 && !filters.furnished.includes(p.furnished)) return false;
      if (p.distanceKm > filters.maxDistance) return false;
      if (filters.gender !== 'Any' && p.genderPreference !== filters.gender && p.genderPreference !== 'Any') return false;
      if (filters.availability !== 'Any' && p.availability !== filters.availability) return false;
      return true;
    });

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.rent + a.maintenance - (b.rent + b.maintenance));
        break;
      case 'price-high':
        result.sort((a, b) => b.rent + b.maintenance - (a.rent + a.maintenance));
        break;
      case 'nearest':
        result.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
    }

    return result;
  }, [filters, sort, searchText, allProperties]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchText('');
    setSearchBudget('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile filter toggle + search */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Browse Rentals</h1>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by college, area, or city..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            {searchText && (
              <button onClick={() => setSearchText('')} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="nearest">Nearest First</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{filtered.length}</span> propert{filtered.length === 1 ? 'y' : 'ies'} found
            </p>
            <button onClick={resetFilters} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              Reset all
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
              <Search className="h-10 w-10 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">No properties match your filters</p>
              <p className="mt-1 text-xs text-slate-400">Try widening your budget or distance range</p>
              <button onClick={resetFilters} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', { id: p.id })} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
