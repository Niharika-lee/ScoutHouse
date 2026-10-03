import { SignUp } from '@clerk/clerk-react';

export function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              card: 'rounded-2xl border border-slate-200 shadow-sm',
              headerTitle: 'text-slate-900 font-bold',
              headerSubtitle: 'text-slate-500',
              formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-lg text-sm font-semibold',
              footerActionLink: 'text-blue-600 hover:text-blue-700',
            },
          }}
        />
      </div>
    </div>
  );
}
