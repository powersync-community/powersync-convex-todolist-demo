import React from 'react';

const DEMO_MODE_STORAGE_KEY = 'powersync-convex-demo-mode';

export const DEMO_USER_ID = 'demo-user';

type DemoModeContextValue = {
  isDemoMode: boolean;
  disableDemoMode: () => void;
};

const DemoModeContext = React.createContext<DemoModeContextValue>({
  isDemoMode: false,
  disableDemoMode: () => {}
});

function readInitialDemoMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') === 'false') {
    window.sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    return false;
  }

  if (params.get('demo') === 'true') {
    window.sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
    return true;
  }

  return window.sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
}

/** Provides a local-only demo mode for static hosting without auth or PowerSync services. */
export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = React.useState(readInitialDemoMode);
  const disableDemoMode = React.useCallback(() => {
    window.sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    setIsDemoMode(false);
  }, []);

  return <DemoModeContext.Provider value={{ isDemoMode, disableDemoMode }}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  return React.useContext(DemoModeContext);
}
