import { AUTH_ROUTE } from '@/app/router';
import { useDemoMode } from '@/library/demoMode';
import { CircularProgress, Grid, styled } from '@mui/material';
import { useConvexAuth } from 'convex/react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type AuthenticatedRouteProps = {
  children: React.ReactNode;
};

/** Guards authenticated app routes, while allowing local-only demo mode. */
export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isDemoMode } = useDemoMode();
  const location = useLocation();

  if (isLoading && !isDemoMode) {
    return (
      <S.MainGrid container>
        <S.CenteredGrid item xs={12}>
          <CircularProgress />
        </S.CenteredGrid>
      </S.MainGrid>
    );
  }

  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to={AUTH_ROUTE} replace state={{ from: location }} />;
  }

  return children;
}

namespace S {
  export const CenteredGrid = styled(Grid)`
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  export const MainGrid = styled(CenteredGrid)`
    min-height: 100vh;
  `;
}
