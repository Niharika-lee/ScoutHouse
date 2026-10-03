import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { ListingsPage } from '@/pages/ListingsPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { ShortlistPage } from '@/pages/ShortlistPage';
import { ComparePage } from '@/pages/ComparePage';
import { CompareBar } from '@/components/CompareBar';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { TenantDashboard } from '@/pages/TenantDashboard';
import { OwnerDashboard } from '@/pages/OwnerDashboard';
import { PropertyForm } from '@/pages/PropertyForm';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'login' | 'signup' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

function AppContent() {
  const { shortlist, compareList, user, logout } = useApp();
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = (target: Page, p?: Record<string, string>) => {
    // Block owner pages for tenants
    if (target === 'owner-dashboard' && user?.role !== 'Owner') {
      setPage('home');
      return;
    }
    if (target === 'property-form' && user?.role !== 'Owner') {
      setPage('home');
      return;
    }
    // Block shortlist/compare for owners
    if ((target === 'shortlist' || target === 'compare' || target === 'tenant-dashboard') && user?.role === 'Owner') {
      setPage('owner-dashboard');
      return;
    }
    setParams(p ?? {});
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isOwner = user?.role === 'Owner';
  const showCompareBar = !isOwner && compareList.length > 0 && page !== 'compare';
  const isAuthPage = page === 'login' || page === 'signup';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        page={page}
        onNavigate={navigate}
        shortlistCount={shortlist.length}
        compareCount={compareList.length}
        user={user}
        onLogout={logout}
      />
      <main className={`flex-1 ${showCompareBar ? 'pb-20' : ''}`}>
        {page === 'home' && <LandingPage onNavigate={navigate} />}
        {page === 'listings' && <ListingsPage onNavigate={navigate} searchParams={params} />}
        {page === 'detail' && <PropertyDetailPage propertyId={params.id ?? ''} onNavigate={navigate} />}
        {page === 'shortlist' && <ShortlistPage onNavigate={navigate} />}
        {page === 'compare' && <ComparePage onNavigate={navigate} />}
        {page === 'login' && <LoginPage onNavigate={navigate} />}
        {page === 'signup' && <SignupPage onNavigate={navigate} />}
        {page === 'tenant-dashboard' && <TenantDashboard onNavigate={navigate} />}
        {page === 'owner-dashboard' && <OwnerDashboard onNavigate={navigate} />}
        {page === 'property-form' && <PropertyForm onNavigate={navigate} editId={params.id} />}
      </main>
      {showCompareBar && <CompareBar onNavigate={navigate} />}
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
