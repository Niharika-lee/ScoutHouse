import { useState, useEffect } from 'react';
import { useUser, useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { ListingsPage } from '@/pages/ListingsPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { ShortlistPage } from '@/pages/ShortlistPage';
import { ComparePage } from '@/pages/ComparePage';
import { CompareBar } from '@/components/CompareBar';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { TenantDashboard } from '@/pages/TenantDashboard';
import { OwnerDashboard } from '@/pages/OwnerDashboard';
import { PropertyForm } from '@/pages/PropertyForm';

type Page = 'home' | 'listings' | 'detail' | 'shortlist' | 'compare' | 'sign-in' | 'sign-up' | 'onboarding' | 'tenant-dashboard' | 'owner-dashboard' | 'property-form';

function AppContent() {
  const { shortlist, compareList, role } = useApp();
  const { isLoaded, isSignedIn, user } = useUser();
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = (target: Page, p?: Record<string, string>) => {
    setParams(p ?? {});
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Redirect logic after auth state changes
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      const userRole = user.unsafeMetadata?.role as string | undefined;
      // If on auth pages, redirect to onboarding or dashboard
      if (page === 'sign-in' || page === 'sign-up') {
        if (!userRole) {
          setPage('onboarding');
        } else {
          setPage(userRole === 'Owner' ? 'owner-dashboard' : 'tenant-dashboard');
        }
      }
      // If on onboarding and already has role, go to dashboard
      if (page === 'onboarding' && userRole) {
        setPage(userRole === 'Owner' ? 'owner-dashboard' : 'tenant-dashboard');
      }
    }
  }, [isLoaded, isSignedIn, user, page]);

  // Block owner pages for tenants
  if (isLoaded && isSignedIn && role === 'Tenant' && (page === 'owner-dashboard' || page === 'property-form')) {
    setPage('tenant-dashboard');
  }
  // Block tenant pages for owners
  if (isLoaded && isSignedIn && role === 'Owner' && (page === 'shortlist' || page === 'compare' || page === 'tenant-dashboard')) {
    setPage('owner-dashboard');
  }
  // Block dashboards and protected pages for signed-out visitors
  if (isLoaded && !isSignedIn && (page === 'tenant-dashboard' || page === 'owner-dashboard' || page === 'property-form' || page === 'shortlist')) {
    return <RedirectToSignIn />;
  }

  const isOwner = role === 'Owner';
  const showCompareBar = !isOwner && compareList.length > 0 && page !== 'compare';
  const isAuthPage = page === 'sign-in' || page === 'sign-up' || page === 'onboarding';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        page={page}
        onNavigate={navigate}
        shortlistCount={shortlist.length}
        compareCount={compareList.length}
        role={role}
      />
      <main className={`flex-1 ${showCompareBar ? 'pb-20' : ''}`}>
        {page === 'home' && <LandingPage onNavigate={navigate} />}
        {page === 'listings' && <ListingsPage onNavigate={navigate} searchParams={params} />}
        {page === 'detail' && <PropertyDetailPage propertyId={params.id ?? ''} onNavigate={navigate} />}
        {page === 'shortlist' && <ShortlistPage onNavigate={navigate} />}
        {page === 'compare' && <ComparePage onNavigate={navigate} />}
        {page === 'sign-in' && <SignInPage />}
        {page === 'sign-up' && <SignUpPage />}
        {page === 'onboarding' && <OnboardingPage onNavigate={navigate} />}
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
