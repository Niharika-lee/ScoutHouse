import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to your .env file.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#0d9488',
          colorText: '#334155',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputBorder: '#e2e8f0',
          borderRadius: '0.75rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-lg text-sm font-semibold',
          card: 'rounded-2xl border border-slate-200 shadow-sm',
          headerTitle: 'text-slate-900 font-bold',
          headerSubtitle: 'text-slate-500',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
