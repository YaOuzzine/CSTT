// app/page.tsx
import { Suspense } from 'react';
import AuthWrapper from './auth/AuthWrapper';
import DashboardClient from './components/dashboard/DashboardClient';
import { LoadingSkeleton } from './components/dashboard/loading';

export default function Home() {
  return (
    <AuthWrapper>
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardClient />
      </Suspense>
    </AuthWrapper>
  );
}