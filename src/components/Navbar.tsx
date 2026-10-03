import { useState } from 'react';
import { Compass, Heart, Home, ListFilter, Scale, Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import type { User } from '@/types';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

interface NavbarProps {
  page: Page;
  onNavigate: (page: Page, params?: Record<string, string>) => void;
  shortlistCount: number;
  compareCount: number;
  user: User | null;
  onLogout: () => void;
}

export function Navbar({ page, onNavigate, shortlistCount, compareCount, user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user?.role === 'Owner';

  const baseLinks: { key: Page; label: string; icon: typeof Home; count?: number }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'listings', label: 'Explore', icon: ListFilter },
    ...(isOwner ? [] : [
      { key: 'shortlist' as Page, label: 'Shortlist', icon: Heart, count: shortlistCount },
      { key: 'compare' as Page, label: 'Compare', icon: Scale, count: compareCount },
    ]),
  ];

  const dashboardPage: Page = isOwner ? 'owner-dashboard' : 'tenant-dashboard';

  const handleNav = (target: Page) => {
    onNavigate(target);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
            <Compass className="h-5 w-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Scout<span className="text-teal-600">House</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {baseLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNav(link.key)}
              className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                page === link.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.count !== undefined && link.count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                  {link.count}
                </span>
              )}
            </button>
          ))}
          {user ? (
            <>
              <button
                onClick={() => handleNav(dashboardPage)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  page === dashboardPage ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <div className="mx-1 h-6 w-px bg-slate-200" />
              <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
              <button
                onClick={() => { onLogout(); handleNav('home'); }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </button>
              <button
                onClick={() => handleNav('signup')}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-200"
              >
                Sign up
              </button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {baseLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNav(link.key)}
              className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium transition ${
                page === link.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.count !== undefined && link.count > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                  {link.count}
                </span>
              )}
            </button>
          ))}
          {user ? (
            <>
              <button
                onClick={() => handleNav(dashboardPage)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  page === dashboardPage ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <button
                  onClick={() => { onLogout(); handleNav('home'); }}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleNav('login')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-600"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </button>
              <button
                onClick={() => handleNav('signup')}
                className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 px-3 py-3 text-sm font-semibold text-white"
              >
                Sign up
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
