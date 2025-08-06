// Enhanced animation utilities that respect system settings
import { SystemSettings } from '../contexts/system-settings-context';

/**
 * Get animation classes based on system settings
 * @param animationClasses - The animation classes to apply
 * @param settings - System settings object
 * @param fallbackClasses - Classes to use when animations are disabled
 * @returns The appropriate classes based on settings
 */
export const getAnimationClasses = (
  animationClasses: string,
  settings?: SystemSettings,
  fallbackClasses: string = ''
): string => {
  // If animations are disabled, return fallback classes
  if (settings && !settings.animations) {
    return fallbackClasses;
  }
  
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return fallbackClasses;
    }
  }
  
  return animationClasses;
};

/**
 * Create a conditional animation style object
 * @param animationStyles - CSS animation styles
 * @param settings - System settings object
 * @returns Style object with animations conditionally applied
 */
export const getAnimationStyles = (
  animationStyles: React.CSSProperties,
  settings?: SystemSettings
): React.CSSProperties => {
  // If animations are disabled, remove animation properties
  if (settings && !settings.animations) {
    const { animation, transform, transition, ...otherStyles } = animationStyles;
    return otherStyles;
  }
  
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const { animation, transform, transition, ...otherStyles } = animationStyles;
      return otherStyles;
    }
  }
  
  return animationStyles;
};

/**
 * Conditional animation class helper for common animations
 */
export const animationClasses = {
  float: (settings?: SystemSettings) => 
    getAnimationClasses('animate-float', settings),
  
  bounceGentle: (settings?: SystemSettings) => 
    getAnimationClasses('animate-bounce-gentle', settings),
  
  shimmer: (settings?: SystemSettings) => 
    getAnimationClasses('animate-shimmer', settings),
  
  rainbow: (settings?: SystemSettings) => 
    getAnimationClasses('animate-rainbow', settings),
  
  pulse: (settings?: SystemSettings) => 
    getAnimationClasses('animate-pulse', settings),
  
  bounce: (settings?: SystemSettings) => 
    getAnimationClasses('animate-bounce', settings),
  
  spin: (settings?: SystemSettings) => 
    getAnimationClasses('animate-spin', settings),
  
  // Transition classes
  transition: (settings?: SystemSettings) => 
    getAnimationClasses('transition-all duration-200', settings),
  
  scaleHover: (settings?: SystemSettings) => 
    getAnimationClasses('hover:scale-105 transition-transform duration-200', settings),
  
  fadeIn: (settings?: SystemSettings) => 
    getAnimationClasses('animate-fade-in', settings),
};

/**
 * Hook for creating animation-aware setTimeout
 */
export const useAnimationTimeout = (
  callback: () => void,
  delay: number,
  settings?: SystemSettings
) => {
  const effectiveDelay = settings && !settings.animations ? 0 : delay;
  
  if (typeof window !== 'undefined') {
    return setTimeout(callback, effectiveDelay);
  }
  
  return null;
};

/**
 * Check if animations should be enabled
 */
export const shouldAnimate = (settings?: SystemSettings): boolean => {
  // Check system settings first
  if (settings && !settings.animations) {
    return false;
  }
  
  // Check browser reduced motion preference
  if (typeof window !== 'undefined') {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  return true;
};
