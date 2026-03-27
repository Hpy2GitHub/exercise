// Utility functions for building URLs to static assets

export const getBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const viteBase = (import.meta as any).env.BASE_URL;
    if (viteBase) return viteBase.replace(/\/+$/, ''); // strip trailing slash
  }
  return '';
};

export const getPublicUrl = (filename: string): string => {
  const base = getBaseUrl();
  const cleanFile = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${base}/${cleanFile}`;
};


/**
 * Get the base URL for static assets
 */
export const old_getBaseUrl = (): string => {
  // In Vite, we can use import.meta.env
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const viteBase = (import.meta as any).env.BASE_URL;
    if (viteBase) return viteBase;
  }
  
  // Fallback for development
  return '';
};

/**
 * Build a URL for an image
 */
export const getImageUrl = (filename: string): string => {
  const base = getBaseUrl();
  return `${base}/images/${filename}`;
};

/**
 * Build a URL for a thumbnail image
 */
export const getThumbnailUrl = (filename: string): string => {
  const base = getBaseUrl();
  return `${base}/images/thumbnails/${filename}`;
};

/**
 * Build a URL for a video
 */
export const getVideoUrl = (filename: string): string => {
  const base = getBaseUrl();
  return `${base}/videos/${filename}`;
};

export const old_getPublicUrl = (filename: string): string => {
  const base = getBaseUrl();
  return `${base}/`;
};


/**
 * Build a URL for any static asset
 */
export const getStaticUrl = (path: string): string => {
  const base = getBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
};
