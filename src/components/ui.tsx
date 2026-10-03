export function AvailabilityBadge({ availability }: { availability: string }) {
  const isNow = availability === 'Available Now';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isNow ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isNow ? 'bg-teal-500' : 'bg-amber-500'}`} />
      {availability}
    </span>
  );
}

export function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function SectionPlaceholder({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}
