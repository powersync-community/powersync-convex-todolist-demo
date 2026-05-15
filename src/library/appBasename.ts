/** React Router basename derived from Vite's `base` config (e.g. GitHub Pages subdirectory). */
export function appBasename(): string | undefined {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base || undefined;
}
