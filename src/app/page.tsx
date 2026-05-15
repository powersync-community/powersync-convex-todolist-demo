import React from 'react';
import { CircularProgress, Grid, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/library/demoMode';
import { useConvexAuth } from 'convex/react';
import { TODO_LISTS_ROUTE, AUTH_ROUTE } from './router';

/** Entry route that sends users to the todo app or auth page based on their Convex session. */
export default function EntryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isDemoMode } = useDemoMode();

  React.useEffect(() => {
    if (isLoading && !isDemoMode) {
      return;
    }

    if (isDemoMode || isAuthenticated) {
      navigate(TODO_LISTS_ROUTE);
    } else {
      navigate(AUTH_ROUTE);
    }
  }, [isAuthenticated, isDemoMode, isLoading, navigate]);

  return (
    <S.MainGrid container>
      <S.CenteredGrid item xs={12} md={6} lg={5}>
        <CircularProgress />
      </S.CenteredGrid>
    </S.MainGrid>
  );
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
