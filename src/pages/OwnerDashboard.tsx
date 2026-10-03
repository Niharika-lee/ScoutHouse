import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Plus, Edit2, Trash2, Home, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Property } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface OwnerDashboardProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function OwnerDashboard({ onNavigate }: OwnerDashboardProps) {
  const { user } = useUser();
  const { ownerProperties, deleteOwnerProperty, updateOwnerProperty } = useApp();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const myProps = ownerProperties.filter((p) => p.ownerId === user.id);

  const toggleAvailability = (p: Property) => {
    const updated: Property = {
      ...p,
      availability: p.availability === 'Available Now' ? 'Available Soon' : 'Available Now',
    };
    updateOwnerProperty(updated);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {myProps.length} {myProps.length === 1 ? 'property' : 'properties'} posted
          </p>
        </div>
        <button
          onClick={() => onNavigate('property-form')}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
        >
          <Plus className="h-4 w-4" />
          Post new property
        </button>
      </div>

      {myProps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <Home className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-base font-medium text-slate-600">No properties posted yet</p>
          <p className="mt-1 text-sm text-slate-400">Post your first property to start reaching students</p>
          <button
            onClick={() => onNavigate('property-form')}
            className="mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Post new property
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {myProps.map((p) => (
            <div key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative h-44 overflow-hidden">
                <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {p.type}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                      p.availability === 'Available Now' ? 'bg-teal-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {p.availability}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.area}, {p.city}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  ₹{p.rent.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-400"> /mo</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => onNavigate('property-form', { id: p.id })}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAvailability(p)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    {p.availability === 'Available Now' ? 'Mark unavailable' : 'Mark available'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('detail', { id: p.id })}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View details
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {confirmDelete === p.id && (
                <div className="border-t border-slate-100 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-xs font-medium text-red-700">Delete this property? This cannot be undone.</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { deleteOwnerProperty(p.id); setConfirmDelete(null); }}
                      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
