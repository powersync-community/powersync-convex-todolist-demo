import { useAuthToken } from '@convex-dev/auth/react';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { DEMO_USER_ID, useDemoMode } from '../demoMode';

interface ConvexJwtPayload {
  sub: string;
}

export function useUserId(): string | null {
  const { isDemoMode } = useDemoMode();
  const token = useAuthToken();

  return React.useMemo(() => {
    if (isDemoMode) return DEMO_USER_ID;
    if (!token) return null;
    try {
      const decoded = jwtDecode<ConvexJwtPayload>(token);
      const userId = decoded.sub.split('|')[0]; // just the user _id
      return userId;
    } catch {
      return null;
    }
  }, [isDemoMode, token]);
}
