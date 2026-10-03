import { useState } from 'react';
import { Heart, MapPin, BedDouble, Sofa, Ruler, Calendar } from 'lucide-react';
import type { Property } from '@/types';
import { useApp } from '@/context/AppContext';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const { user, toggleShortlist, isShortlisted, toggleCompare, isInCompare, compareLimitReached } = useApp();
  const isOwner = user?.role === 'Owner';
  const [showLimitMsg, setShowLimitMsg] = useState(false);
  const shortlisted = isShortlisted(property.id);
  const inCompare = isInCompare(property.id);
  const totalMonthly = property.rent + property.maintenance;

  const handleCompareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!inCompare && compareLimitReached) {
      setShowLimitMsg(true);
      setTimeout(() => setShowLimitMsg(false), 2500);
      return;
    }
    toggleCompare(property.id);
  };

  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg hover:shadow-slate-200/60"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {property.type}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
              property.availability === 'Available Now'
                ? 'bg-teal-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {property.availability}
          </span>
          {property.isOwnerPosted && (
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Owner-posted
            </span>
          )}
        </div>
        {!isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleShortlist(property.id);
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
            aria-label="Shortlist"
          >
            <Heart
              className={`h-5 w-5 ${shortlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {property.area}, {property.city}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5 text-blue-500" />
            {property.distanceKm} km to {property.nearestCollege}
          </span>
          <span className="flex items-center gap-1">
            <Sofa className="h-3.5 w-3.5 text-teal-500" />
            {property.furnished}
          </span>
          {property.genderPreference !== 'Any' && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-purple-500" />
              {property.genderPreference}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              ₹{property.rent.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400"> /mo</span>
            </p>
            <p className="text-xs text-slate-400">
              Deposit ₹{property.deposit.toLocaleString('en-IN')} · Maint. ₹{totalMonthly - property.rent}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-amber-500">
              Estimated or user-reported. Not verified.
            </p>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="h-3 w-3" />
            {property.lastUpdated}
          </span>
        </div>

        {!isOwner && (
          <div className="mt-3">
            <label
              className="flex items-center gap-2 text-sm text-slate-600"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={inCompare}
                onChange={handleCompareChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Add to compare
            </label>
            {showLimitMsg && (
              <p className="mt-1.5 text-xs font-medium text-amber-600">
                You can compare up to 3 properties.
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
