/** Prefix a `public/` file path with Vite's `base` URL (e.g. GitHub Pages subdirectory). */
export function publicAssetPath(assetPath: string): string {
  const path = assetPath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${path}`;
}
