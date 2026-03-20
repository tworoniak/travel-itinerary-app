import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return null; // or a spinner if you have one

  if (!session) return <Navigate to='/login' replace />;

  return <>{children}</>;
}
