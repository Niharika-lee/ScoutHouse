import { useState } from 'react';
import {
  Wallet,
  Home,
  Camera,
  Sofa,
  Bus,
  ScrollText,
  Star,
  FileCheck,
  CheckSquare,
  Square,
  Check,
  X,
  Info,
  Clock,
  Zap,
  Droplets,
  Wifi,
  Utensils,
  MapPin,
  Users,
  Ban,
  CookingPot,
  Moon,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import type { Property, DataSource } from '@/types';
import { furnitureChecklistItems } from '@/data/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { useApp } from '@/context/AppContext';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface RentalRealityCheckProps {
  property: Property;
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

function SourceBadge({ source }: { source: DataSource }) {
  const styles: Record<DataSource, string> = {
    Estimated: 'bg-blue-100 text-blue-700',
    'User-reported': 'bg-teal-100 text-teal-700',
    'Owner-stated': 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[source]}`}>
      {source}
    </span>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Wallet;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-teal-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CostRow({ label, value, source }: { label: string; value: number; source: DataSource }) {
  if (value === 0) return null;
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">{label}</span>
        <SourceBadge source={source} />
      </div>
      <span className="text-sm font-semibold text-slate-800">₹{value.toLocaleString('en-IN')}</span>
    </div>
  );
}

function getPhotoFreshness(date: string) {
  const updated = new Date(date);
  const now = new Date('2026-10-03');
  const monthsDiff = (now.getFullYear() - updated.getFullYear()) * 12 + (now.getMonth() - updated.getMonth());
  if (monthsDiff < 1) return { color: 'green', label: 'Recent', dotClass: 'bg-green-500', textClass: 'text-green-600', bgClass: 'bg-green-50' };
  if (monthsDiff <= 6) return { color: 'yellow', label: 'Moderate', dotClass: 'bg-amber-500', textClass: 'text-amber-600', bgClass: 'bg-amber-50' };
  return { color: 'red', label: 'Outdated', dotClass: 'bg-red-500', textClass: 'text-red-600', bgClass: 'bg-red-50' };
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  );
}

export function RentalRealityCheck({ property, onNavigate }: RentalRealityCheckProps) {
  const { toggleShortlist, isShortlisted, toggleCompare, isInCompare, getAllProperties } = useApp();
  const [visitChecks, setVisitChecks] = useState<Record<string, boolean>>({});

  // Section 1: Real Monthly Cost
  const monthlyTotal =
    property.rent +
    property.maintenance +
    property.electricityEstimate +
    property.waterEstimate +
    property.internetCost +
    property.foodCost;

  // Section 2: Move-in Cost
  const moveInTotal = property.deposit + property.rent + property.brokerage;

  // Section 4: Furniture checklist
  const hasFurniture = (item: string): boolean => {
    const included = property.furnitureIncluded.map((f) => f.toLowerCase());
    const amenities = property.amenities.map((a) => a.toLowerCase());
    const itemLower = item.toLowerCase();
    return (
      included.some((f) => f.includes(itemLower) || itemLower.includes(f)) ||
      amenities.some((a) => a.includes(itemLower) || (itemLower === 'wi-fi' && a.includes('wi-fi'))) ||
      (itemLower === 'ac' && (included.some((f) => f.includes('ac')) || amenities.some((a) => a === 'ac' || a.includes(' air ')))) ||
      (itemLower === 'power backup' && amenities.some((a) => a.includes('power backup'))) ||
      (itemLower === 'parking' && amenities.some((a) => a.includes('parking'))) ||
      (itemLower === 'geyser' && amenities.some((a) => a.includes('hot water'))) ||
      (itemLower === 'fridge' && (included.some((f) => f.includes('fridge') || f.includes('refrigerator')) || amenities.some((a) => a.includes('refrigerator'))))
    );
  };

  // Section 6: House Rules
  const rules = [
    { icon: Users, label: 'Visitors', value: property.houseRules.visitors },
    { icon: Moon, label: 'Curfew', value: property.houseRules.curfew },
    { icon: Ban, label: 'Smoking & Alcohol', value: property.houseRules.smokingAlcohol },
    { icon: UserCheck, label: 'Pets', value: property.houseRules.pets },
    { icon: CookingPot, label: 'Cooking', value: property.houseRules.cooking },
    { icon: Home, label: 'Guest Stay', value: property.houseRules.guestStay },
  ];

  // Section 7: Tenant Reviews
  const avgRating = property.tenantReviews.length > 0
    ? (property.tenantReviews.reduce((sum, r) => sum + r.rating, 0) / property.tenantReviews.length).toFixed(1)
    : 'N/A';

  // Section 10: Similar Properties
  const similarProperties = property.similarPropertyIds
    .map((id) => getAllProperties().find((p) => p.id === id))
    .filter((p): p is Property => p !== undefined);

  // Photo freshness
  const photoFreshness = getPhotoFreshness(property.photosLastUpdated);

  const visitChecklistItems = [
    'Check water pressure in all taps',
    'Check all power sockets with a phone charger',
    'Test Wi-Fi signal strength in the room',
    'Visit the neighbourhood at night',
    'Ask for a copy of the rental agreement',
    'Take your own photos of the property',
  ];

  const agreementChecklist = [
    'Ask about deposit refund conditions',
    'Ask about rent increase terms',
    'Ask who pays for repairs',
    'Get everything in writing',
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Rental Reality Check</h2>
            <p className="text-sm text-blue-50">
              The full picture before you visit — real costs, conditions, terms, and tenant experiences.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Real Monthly Cost */}
      <SectionCard icon={Wallet} title="1. Real Monthly Cost">
        <div className="space-y-1">
          <CostRow label="Rent" value={property.rent} source="Owner-stated" />
          <CostRow label="Maintenance" value={property.maintenance} source="Owner-stated" />
          <CostRow label="Electricity" value={property.electricityEstimate} source="Estimated" />
          <CostRow label="Water" value={property.waterEstimate} source="Estimated" />
          <CostRow label="Internet / Wi-Fi" value={property.internetCost} source="Estimated" />
          <CostRow label="Food / Mess" value={property.foodCost} source="Estimated" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Estimated Total / Month</span>
            <SourceBadge source="Estimated" />
          </div>
          <span className="text-2xl font-bold text-blue-700">₹{monthlyTotal.toLocaleString('en-IN')}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5" />
          Estimated. Actual costs may vary based on usage and seasonal changes.
        </p>
      </SectionCard>

      {/* 2. Move-in Cost */}
      <SectionCard icon={Home} title="2. Move-in Cost">
        <div className="space-y-1">
          <CostRow label="Security Deposit" value={property.deposit} source="Owner-stated" />
          <CostRow label="First Month's Rent" value={property.rent} source="Owner-stated" />
          <CostRow label="Brokerage" value={property.brokerage} source="Estimated" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Total Upfront Cost</span>
            <SourceBadge source="Estimated" />
          </div>
          <span className="text-2xl font-bold text-teal-600">₹{moveInTotal.toLocaleString('en-IN')}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5" />
          Brokerage may be waived if you contact the owner directly.
        </p>
      </SectionCard>

      {/* 3. Property Condition and Photo Freshness */}
      <SectionCard icon={Camera} title="3. Property Condition & Photo Freshness">
        <div className={`flex items-center gap-3 rounded-xl ${photoFreshness.bgClass} p-4`}>
          <span className={`flex h-3 w-3 rounded-full ${photoFreshness.dotClass}`}>
            <span className={`absolute h-3 w-3 animate-ping rounded-full ${photoFreshness.dotClass} opacity-60`} />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Photos last updated: {property.photosLastUpdated}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${photoFreshness.bgClass} ${photoFreshness.textClass}`}>
                {photoFreshness.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Older photos may not show current condition.</p>
          </div>
          <SourceBadge source="Owner-stated" />
        </div>
      </SectionCard>

      {/* 4. Furniture and Facilities Included */}
      <SectionCard icon={Sofa} title="4. Furniture & Facilities Included">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {furnitureChecklistItems.map((item) => {
            const included = hasFurniture(item);
            return (
              <div
                key={item}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                  included ? 'border-teal-200 bg-teal-50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                {included ? (
                  <Check className="h-4 w-4 shrink-0 text-teal-600" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-slate-300" />
                )}
                <span className={`text-xs font-medium ${included ? 'text-slate-700' : 'text-slate-400'}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          <SourceBadge source="Owner-stated" /> Based on owner-reported furniture list. Confirm during your visit.
        </p>
      </SectionCard>

      {/* 5. Commute and Transport */}
      <SectionCard icon={Bus} title="5. Commute & Transport">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{property.nearestCollege}</p>
              <p className="text-xs text-slate-500">{property.distanceKm} km away</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700">{property.travelTimeEstimate}</span>
            </div>
          </div>
          <div className="space-y-2">
            {property.nearbyTransport.map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-slate-600">
                <Bus className="h-4 w-4 shrink-0 text-teal-500" />
                {t}
                <SourceBadge source="Estimated" />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* 6. House Rules */}
      <SectionCard icon={ScrollText} title="6. House Rules">
        <div className="grid gap-3 sm:grid-cols-2">
          {rules.map((rule) => (
            <div key={rule.label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <rule.icon className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{rule.label}</p>
                <p className="text-sm text-slate-700">{rule.value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2">
          <SourceBadge source="Owner-stated" />
          <span className="text-xs text-slate-400">Rules may change. Confirm with the owner before moving in.</span>
        </p>
      </SectionCard>

      {/* 7. Tenant Experiences */}
      <SectionCard icon={Star} title="7. Tenant Experiences">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-amber-50 p-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-amber-600">{avgRating}</span>
            <StarRating rating={Math.round(Number(avgRating))} size="lg" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">Average Rating</p>
            <p className="text-xs text-slate-500">Based on {property.tenantReviews.length} tenant review{property.tenantReviews.length !== 1 ? 's' : ''}</p>
          </div>
          <SourceBadge source="User-reported" />
        </div>
        <div className="space-y-3">
          {property.tenantReviews.map((review, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-xs font-bold text-white">
                    {review.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{review.initials}</p>
                    <p className="text-xs text-slate-400">Stayed: {review.stayDuration}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{review.comment}</p>
              <div className="mt-2">
                <SourceBadge source="User-reported" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 8. Rental Agreement Terms to Check */}
      <SectionCard icon={FileCheck} title="8. Rental Agreement Terms to Check">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Notice Period</p>
            <p className="mt-1 text-sm font-bold text-slate-800">{property.agreementTerms.noticePeriod}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Lock-in Period</p>
            <p className="mt-1 text-sm font-bold text-slate-800">{property.agreementTerms.lockInPeriod}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Agreement Type</p>
            <p className="mt-1 text-sm font-bold text-slate-800">{property.agreementTerms.agreementType}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Before you sign, ask about:</p>
          <div className="space-y-2">
            {agreementChecklist.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 shrink-0 text-amber-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2">
          <SourceBadge source="Owner-stated" />
          <span className="text-xs text-slate-400">Terms are owner-reported. Always read the agreement carefully.</span>
        </p>
      </SectionCard>

      {/* 9. Before You Visit Checklist */}
      <SectionCard icon={CheckSquare} title="9. Before You Visit Checklist">
        <div className="space-y-2">
          {visitChecklistItems.map((item) => {
            const checked = visitChecks[item] ?? false;
            return (
              <button
                key={item}
                onClick={() => setVisitChecks((prev) => ({ ...prev, [item]: !prev[item] }))}
                className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:bg-slate-50"
              >
                {checked ? (
                  <CheckSquare className="h-5 w-5 shrink-0 text-teal-600" />
                ) : (
                  <Square className="h-5 w-5 shrink-0 text-slate-300" />
                )}
                <span className={`text-sm ${checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Your checklist is not saved — it resets when you leave this page.
        </p>
      </SectionCard>

      {/* 10. Similar Alternatives */}
      <SectionCard icon={Home} title="10. Similar Alternatives">
        <p className="mb-4 text-sm text-slate-500">
          If this property is unavailable, consider these.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {similarProperties.map((p) => (
            <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', { id: p.id })} />
          ))}
        </div>
      </SectionCard>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-700">
            ScoutHouse shows estimated and user-reported information. Always confirm details with the owner before paying or signing.
          </p>
        </div>
      </div>
    </div>
  );
}
