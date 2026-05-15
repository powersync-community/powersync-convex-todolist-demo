import { screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEMO_SEED_LIST_NAME, setupDemoModeURL, setupTestDOM } from './test-setup';

declare global {
  interface Window {
    _powersync: import('@powersync/web').PowerSyncDatabase;
  }
}

describe('Demo mode smoke', () => {
  let root: Root | null = null;
  let container: HTMLElement;

  beforeEach(async () => {
    setupDemoModeURL();
    container = setupTestDOM();

    const { App } = await import('../src/app/App');
    await renderAppAndWaitForDemoList(App);
  }, 60_000);

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root!.unmount();
      });
      root = null;
    }

    if (window._powersync) {
      try {
        await window._powersync.disconnectAndClear();
      } catch {
        // Ignore errors during cleanup
      }
    }

    window.sessionStorage.clear();
  });

  async function renderAppAndWaitForDemoList(App: () => React.JSX.Element) {
    await act(async () => {
      root = createRoot(container);
      root.render(<App />);
    });

    await waitFor(
      () => {
        expect(window._powersync).toBeDefined();
      },
      { timeout: 15_000 }
    );

    await waitFor(
      () => {
        expect(screen.getByText('Todo Lists')).toBeTruthy();
        expect(screen.getByText(DEMO_SEED_LIST_NAME)).toBeTruthy();
      },
      { timeout: 30_000 }
    );
  }

  it('shows the seeded demo list when opened with ?demo=true', async () => {
    expect(screen.getByText(DEMO_SEED_LIST_NAME)).toBeTruthy();
  });
});
