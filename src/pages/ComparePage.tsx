import { Scale, X, ArrowRight, Info, Check, Star } from 'lucide-react';
import { furnitureChecklistItems } from '@/data/properties';
import { useApp } from '@/context/AppContext';
import type { Property } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface ComparePageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

function getPhotoFreshness(date: string) {
  const updated = new Date(date);
  const now = new Date('2026-10-03');
  const monthsDiff = (now.getFullYear() - updated.getFullYear()) * 12 + (now.getMonth() - updated.getMonth());
  if (monthsDiff < 1) return { dotClass: 'bg-green-500', textClass: 'text-green-600', label: 'Recent' };
  if (monthsDiff <= 6) return { dotClass: 'bg-amber-500', textClass: 'text-amber-600', label: 'Moderate' };
  return { dotClass: 'bg-red-500', textClass: 'text-red-600', label: 'Outdated' };
}

function getMonthlyTotal(p: Property) {
  return p.rent + p.maintenance + p.electricityEstimate + p.waterEstimate + p.internetCost + p.foodCost;
}

function getMoveInTotal(p: Property) {
  return p.deposit + p.rent + p.brokerage;
}

function getAvgRating(p: Property): number {
  if (p.tenantReviews.length === 0) return 0;
  return p.tenantReviews.reduce((s, r) => s + r.rating, 0) / p.tenantReviews.length;
}

function hasFurniture(p: Property, item: string): boolean {
  const included = p.furnitureIncluded.map((f) => f.toLowerCase());
  const amenities = p.amenities.map((a) => a.toLowerCase());
  const itemLower = item.toLowerCase();
  return (
    included.some((f) => f.includes(itemLower) || itemLower.includes(f)) ||
    amenities.some((a) => a.includes(itemLower) || (itemLower === 'wi-fi' && a.includes('wi-fi'))) ||
    (itemLower === 'ac' && (included.some((f) => f.includes('ac')) || amenities.some((a) => a === 'ac'))) ||
    (itemLower === 'power backup' && amenities.some((a) => a.includes('power backup'))) ||
    (itemLower === 'parking' && amenities.some((a) => a.includes('parking'))) ||
    (itemLower === 'geyser' && amenities.some((a) => a.includes('hot water'))) ||
    (itemLower === 'fridge' && (included.some((f) => f.includes('fridge') || f.includes('refrigerator')) || amenities.some((a) => a.includes('refrigerator'))))
  );
}

function getTravelMinutes(p: Property): number {
  const match = p.travelTimeEstimate.match(/(\d+)/);
  return match ? parseInt(match[1]) : 999;
}

interface RowDef {
  label: string;
  getValues: (props: Property[]) => (string | number)[];
  getNumeric?: (p: Property) => number;
  lowerIsBetter?: boolean;
}

export function ComparePage({ onNavigate }: ComparePageProps) {
  const { compareList, removeFromCompare, clearCompare, getAllProperties } = useApp();
  const compareProperties = getAllProperties().filter((p) => compareList.includes(p.id));

  if (compareProperties.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <Scale className="h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">No properties selected for comparison</p>
          <p className="mt-1 text-xs text-slate-400">Select properties from the listings page to compare them side by side.</p>
          <button
            onClick={() => onNavigate('listings')}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Explore listings
          </button>
        </div>
      </div>
    );
  }

  if (compareProperties.length === 1) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <Scale className="h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">Select at least 2 properties to compare</p>
          <button
            onClick={() => onNavigate('listings')}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add more properties
          </button>
        </div>
      </div>
    );
  }

  const props = compareProperties;
  const n = props.length;

  const numericRows: RowDef[] = [
    {
      label: 'Monthly Rent',
      getValues: (ps) => ps.map((p) => `₹${p.rent.toLocaleString('en-IN')}`),
      getNumeric: (p) => p.rent,
      lowerIsBetter: true,
    },
    {
      label: 'Deposit',
      getValues: (ps) => ps.map((p) => `₹${p.deposit.toLocaleString('en-IN')}`),
      getNumeric: (p) => p.deposit,
      lowerIsBetter: true,
    },
    {
      label: 'Est. Total Monthly Cost',
      getValues: (ps) => ps.map((p) => `₹${getMonthlyTotal(p).toLocaleString('en-IN')}`),
      getNumeric: (p) => getMonthlyTotal(p),
      lowerIsBetter: true,
    },
    {
      label: 'Move-in Cost',
      getValues: (ps) => ps.map((p) => `₹${getMoveInTotal(p).toLocaleString('en-IN')}`),
      getNumeric: (p) => getMoveInTotal(p),
      lowerIsBetter: true,
    },
    {
      label: 'Distance to College',
      getValues: (ps) => ps.map((p) => `${p.distanceKm} km`),
      getNumeric: (p) => p.distanceKm,
      lowerIsBetter: true,
    },
    {
      label: 'Travel Time',
      getValues: (ps) => ps.map((p) => p.travelTimeEstimate),
      getNumeric: (p) => getTravelMinutes(p),
      lowerIsBetter: true,
    },
    {
      label: 'Avg Tenant Rating',
      getValues: (ps) => ps.map((p) => getAvgRating(p).toFixed(1)),
      getNumeric: (p) => getAvgRating(p),
      lowerIsBetter: false,
    },
  ];

  const textRows: { label: string; getValues: (ps: Property[]) => string[] }[] = [
    { label: 'Property Type', getValues: (ps) => ps.map((p) => p.type) },
    { label: 'Furnished Status', getValues: (ps) => ps.map((p) => p.furnished) },
    { label: 'Nearby Transport', getValues: (ps) => ps.map((p) => p.nearbyTransport.join(', ')) },
    { label: 'Availability', getValues: (ps) => ps.map((p) => p.availability) },
    { label: 'Notice Period', getValues: (ps) => ps.map((p) => p.agreementTerms.noticePeriod) },
    { label: 'Lock-in Period', getValues: (ps) => ps.map((p) => p.agreementTerms.lockInPeriod) },
    { label: 'Agreement Type', getValues: (ps) => ps.map((p) => p.agreementTerms.agreementType) },
    {
      label: 'House Rules Summary',
      getValues: (ps) => ps.map((p) =>
        `Visitors: ${p.houseRules.visitors}; Curfew: ${p.houseRules.curfew}; Pets: ${p.houseRules.pets}; Cooking: ${p.houseRules.cooking}`
      ),
    },
  ];

  const getBestIndex = (row: RowDef): number => {
    if (!row.getNumeric) return -1;
    const values = props.map(row.getNumeric);
    const best = row.lowerIsBetter ? Math.min(...values) : Math.max(...values);
    return values.indexOf(best);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare Properties</h1>
          <p className="mt-1 text-sm text-slate-500">Side-by-side comparison of {n} properties</p>
        </div>
        <button
          onClick={clearCompare}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          {/* Header row with photos and titles */}
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-10 w-40 bg-white p-4 text-left text-xs font-semibold text-slate-400">
                Property
              </th>
              {props.map((p) => (
                <th key={p.id} className="p-4 text-left align-top">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="mb-2 h-28 w-full rounded-xl object-cover"
                    />
                    <p className="text-sm font-semibold leading-snug text-slate-900">{p.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{p.area}, {p.city}</p>
                    <button
                      onClick={() => onNavigate('detail', { id: p.id })}
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View details
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Numeric rows with best-value highlighting */}
            {numericRows.map((row) => {
              const bestIdx = getBestIndex(row);
              const values = row.getValues(props);
              return (
                <tr key={row.label} className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 text-xs font-semibold text-slate-500">
                    {row.label}
                  </td>
                  {values.map((v, i) => (
                    <td
                      key={i}
                      className={`px-4 py-3 ${
                        i === bestIdx
                          ? 'bg-green-50 font-bold text-green-700'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {v}
                        {i === bestIdx && (
                          <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-bold text-green-700">
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Photo freshness row */}
            <tr className="hover:bg-slate-50/50">
              <td className="sticky left-0 z-10 bg-white px-4 py-3 text-xs font-semibold text-slate-500">
                Photo Last Updated
              </td>
              {props.map((p) => {
                const freshness = getPhotoFreshness(p.photosLastUpdated);
                return (
                  <td key={p.id} className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${freshness.dotClass}`} />
                      <span className="text-slate-700">{p.photosLastUpdated}</span>
                    </div>
                    <span className={`text-[10px] font-semibold ${freshness.textClass}`}>
                      {freshness.label}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Text rows */}
            {textRows.map((row) => (
              <tr key={row.label} className="hover:bg-slate-50/50">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 text-xs font-semibold text-slate-500">
                  {row.label}
                </td>
                {row.getValues(props).map((v, i) => (
                  <td key={i} className="px-4 py-3 text-xs text-slate-700">
                    {v}
                  </td>
                ))}
              </tr>
            ))}

            {/* Furniture checklist rows */}
            {furnitureChecklistItems.map((item) => (
              <tr key={item} className="hover:bg-slate-50/50">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 text-xs font-semibold text-slate-500">
                  {item}
                </td>
                {props.map((p) => {
                  const included = hasFurniture(p, item);
                  return (
                    <td key={p.id} className="px-4 py-3">
                      {included ? (
                        <Check className="h-4 w-4 text-teal-600" />
                      ) : (
                        <X className="h-4 w-4 text-slate-300" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Star rating row */}
            <tr className="hover:bg-slate-50/50">
              <td className="sticky left-0 z-10 bg-white px-4 py-3 text-xs font-semibold text-slate-500">
                Tenant Rating Stars
              </td>
              {props.map((p) => (
                <td key={p.id} className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= Math.round(getAvgRating(p))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-4">
        <Info className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-700">
          Based on estimated and user-reported information. Always confirm details with the owner before paying or signing.
        </p>
      </div>
    </div>
  );
}
