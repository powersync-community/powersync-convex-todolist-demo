/** Seeded in demo mode when the local lists table is empty (see views/layout.tsx). */
export const DEMO_SEED_LIST_NAME = 'play around with demo';

/** Sets up the test DOM structure matching src/index.html. */
export function setupTestDOM() {
  document.body.innerHTML = `<div id="app"></div>`;
  return document.getElementById('app')!;
}

/** Enables demo mode the same way opening `/?demo=true` would in the browser. */
export function setupDemoModeURL() {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/?demo=true');
}
