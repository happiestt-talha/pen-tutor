'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import Loader from '@/components/shared/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  useEffect(() => {
    console.log('User changed in ProtectedRoute:', user);
  }, [user]);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(user.role === 'teacher' ? '/tutor/dashboard' : '/student/dashboard');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Loader />;
  }

  return children;
};

export default ProtectedRoute;
