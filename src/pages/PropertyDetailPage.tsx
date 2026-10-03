import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sofa,
  Bus,
  Wifi,
  Dumbbell,
  Car,
  Zap,
  Droplets,
  Camera,
  Phone,
  Heart,
  Scale,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AvailabilityBadge, InfoPill } from '@/components/ui';
import { RentalRealityCheck } from '@/components/RentalRealityCheck';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface PropertyDetailPageProps {
  propertyId: string;
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

const amenityIcons: Record<string, typeof Wifi> = {
  'Wi-Fi': Wifi,
  'Gym Access': Dumbbell,
  Parking: Car,
  'Power Backup': Zap,
  'Hot Water 24/7': Droplets,
  'Hot Water': Droplets,
  '24/7 Security': Camera,
  CCTV: Camera,
};

export function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const { role, toggleShortlist, isShortlisted, toggleCompare, isInCompare, getAllProperties } = useApp();
  const isOwner = role === 'Owner';
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const property = getAllProperties().find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-slate-700">Property not found</p>
        <button
          onClick={() => onNavigate('listings')}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const shortlisted = isShortlisted(property.id);
  const inCompare = isInCompare(property.id);
  const totalMonthly = property.rent + property.maintenance;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back */}
      <button
        onClick={() => onNavigate('listings')}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </button>

      {/* Title row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{property.title}</h1>
            <AvailabilityBadge availability={property.availability} />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {property.area}, {property.city}
          </p>
        </div>
        <div className="flex gap-2">
          {!isOwner && (
            <>
              <button
                onClick={() => toggleShortlist(property.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  shortlisted
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-red-200'
                }`}
              >
                <Heart className={`h-4 w-4 ${shortlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {shortlisted ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={() => toggleCompare(property.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  inCompare
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                }`}
              >
                <Scale className="h-4 w-4" />
                {inCompare ? 'Added' : 'Compare'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left column: gallery + sections */}
        <div className="lg:col-span-3">
          {/* Gallery */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="relative aspect-[16/10] bg-slate-100">
              <img
                src={property.images[activeImage]}
                alt={`${property.title} — image ${activeImage + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-2 p-3">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-24 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === i ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{property.description}</p>
          </section>

          {/* Amenities */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((a) => {
                const Icon = amenityIcons[a] || CheckCircle2;
                return (
                  <div key={a} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-teal-600" />
                    <span className="text-sm text-slate-700">{a}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Furniture included */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Furniture Included</h2>
            {property.furnitureIncluded.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {property.furnitureIncluded.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                  >
                    <Sofa className="h-3.5 w-3.5 text-blue-500" />
                    {f}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-400">No furniture provided — this is an unfurnished property.</p>
            )}
          </section>

          {/* Nearby transport */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Nearby Transport</h2>
            <div className="mt-3 space-y-2">
              {property.nearbyTransport.map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-slate-700">
                  <Bus className="h-4 w-4 shrink-0 text-blue-500" />
                  {t}
                </div>
              ))}
            </div>
          </section>

          {/* Rental Reality Check */}
          <RentalRealityCheck property={property} onNavigate={onNavigate} />

          {/* Visit scheduler placeholder */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Visit Scheduler</h2>
            <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-500">Schedule a Visit</p>
              <p className="mt-1 text-xs text-slate-400">Coming soon — you will be able to book a visit slot directly.</p>
            </div>
          </section>
        </div>

        {/* Right column: cost summary + contact */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-4">
            {/* Cost summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Cost Summary</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Monthly Rent</span>
                  <span className="text-sm font-semibold text-slate-800">₹{property.rent.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Maintenance</span>
                  <span className="text-sm font-semibold text-slate-800">₹{property.maintenance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm font-semibold text-slate-700">Total / month</span>
                  <span className="text-lg font-bold text-blue-700">₹{totalMonthly.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Deposit (one-time)</span>
                  <span className="text-sm font-semibold text-slate-800">₹{property.deposit.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                <Info className="h-4 w-4 shrink-0" />
                <span>Estimated or user-reported. Not verified. Confirm final amounts with the owner before signing.</span>
              </div>
            </div>

            {/* Quick facts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Quick Facts</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoPill label="Type" value={property.type} />
                <InfoPill label="Furnishing" value={property.furnished} />
                <InfoPill label="Gender" value={property.genderPreference} />
                <InfoPill label="Availability" value={property.availability} />
                <InfoPill label="Distance" value={`${property.distanceKm} km`} />
                <InfoPill label="Nearest College" value={property.nearestCollege} />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                Last updated: {property.lastUpdated}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Contact Owner</h2>
              {showContact ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xs text-slate-400">Phone number</p>
                    <p className="mt-1 text-lg font-bold text-slate-800">+91 98XXX XXXXX</p>
                    <p className="mt-1 text-xs text-slate-400">Email</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-700">owner@example.com</p>
                  </div>
                  <p className="text-center text-xs text-amber-600">
                    Contact details are placeholders. Always verify owner identity before sharing personal info.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowContact(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
                >
                  <Phone className="h-4 w-4" />
                  Show contact details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
