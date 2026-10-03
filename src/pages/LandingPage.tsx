import { Search, Compass, Eye, Scale, MapPin, Wallet, ShieldCheck, ArrowRight, Home, CheckSquare, Star, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/PropertyCard';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface LandingPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { getAllProperties } = useApp();
  const [searchLoc, setSearchLoc] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const featured = getAllProperties().slice(0, 4);

  const handleSearch = () => {
    onNavigate('listings', { search: searchLoc, budget: searchBudget });
  };

  const steps = [
    { icon: Compass, label: 'Discover', desc: 'Find rentals near your college or workplace' },
    { icon: Eye, label: 'Check', desc: 'See the real cost, condition, and terms' },
    { icon: Scale, label: 'Compare', desc: 'Shortlist and compare side by side' },
    { icon: MapPin, label: 'Visit', desc: 'Visit only the properties worth your time' },
    { icon: ShieldCheck, label: 'Review', desc: 'Share your experience to help other students' },
  ];

  const whyCards = [
    {
      icon: Wallet,
      title: 'Real Monthly Cost',
      desc: 'Rent, maintenance, electricity, water, internet, and food — all broken down so you know what you will actually pay each month.',
    },
    {
      icon: Home,
      title: 'Move-in Cost',
      desc: 'Deposit, first month rent, and brokerage added up front. Know exactly how much you need before you get the keys.',
    },
    {
      icon: CheckSquare,
      title: 'Before-You-Visit Checklist',
      desc: 'A practical checklist of things to verify in person — water pressure, power sockets, Wi-Fi signal, and more.',
    },
    {
      icon: Star,
      title: 'Tenant Experiences',
      desc: 'Read what previous tenants say about the property, the owner, and the neighbourhood before you commit.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <Compass className="h-3.5 w-3.5" />
              Built for students, by students
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Scout<span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">House</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 sm:text-xl">
              Know the cost. Know the place. Know the terms. Before you move.
            </p>
          </div>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter college, university, or area name"
                  value={searchLoc}
                  onChange={(e) => setSearchLoc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                <Wallet className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="number"
                  placeholder="Max budget"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-28 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">
              Try "Christ University" or "Bengaluru" — all details are estimated or user-reported.
            </p>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="border-y border-slate-100 bg-slate-50 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">The problem students face</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Students struggle to compare rentals because rent, deposit, real monthly cost, condition, and terms
            are scattered or unclear. Listings show attractive prices but hide maintenance charges, electricity bills,
            food costs, and restrictive house rules — until it is too late.
          </p>
        </div>
      </section>

      {/* How it works — journey strip */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 flex flex-col items-stretch gap-6 sm:flex-row sm:justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="relative flex flex-1 flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 ring-1 ring-blue-100">
                  <step.icon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{step.label}</p>
                <p className="mt-1 max-w-[140px] text-xs text-slate-500">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="absolute left-full top-7 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-blue-200 to-teal-200 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ScoutHouse */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Why ScoutHouse</h2>
            <p className="mt-2 text-sm text-slate-500">
              Four things that make comparing rentals honest and practical
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((h) => (
              <div
                key={h.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white transition group-hover:scale-110">
                  <h.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured properties</h2>
              <p className="mt-1 text-sm text-slate-500">A hand-picked selection of student-friendly rentals</p>
            </div>
            <button
              onClick={() => onNavigate('listings')}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => onNavigate('detail', { id: p.id })} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
