/**
 * Utility functions for handling GitHub Pages deployment paths
 */

// Get the base path for GitHub Pages
export const getBasePath = (): string => {
  return process.env.NODE_ENV === 'production' ? '/kids-math-quiz' : '';
};

// Get the asset prefix for GitHub Pages
export const getAssetPrefix = (): string => {
  return process.env.NODE_ENV === 'production' ? '/kids-math-quiz' : '';
};

// Helper function to prefix paths for GitHub Pages
export const withBasePath = (path: string): string => {
  const basePath = getBasePath();
  
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return the path with base path if in production
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
};

// Helper function for static assets
export const withAssetPrefix = (assetPath: string): string => {
  const assetPrefix = getAssetPrefix();
  
  // Remove leading slash from asset path if it exists
  const cleanAssetPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  // Return the asset path with prefix if in production
  return assetPrefix ? `${assetPrefix}/${cleanAssetPath}` : `/${cleanAssetPath}`;
};

// Check if we're in GitHub Pages production environment
export const isGitHubPages = (): boolean => {
  return process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 
         window.location.hostname === 'christiancrisologo.github.io';
};

// Get the full URL for the app
export const getAppUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin + getBasePath();
  }
  
  // Fallback for SSR
  return process.env.NODE_ENV === 'production' 
    ? 'https://christiancrisologo.github.io/kids-math-quiz'
    : 'http://localhost:3000';
};
