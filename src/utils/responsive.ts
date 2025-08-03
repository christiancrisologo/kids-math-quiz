'use client';

import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isMobile;
};

export const useIsTablet = (): boolean => {
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isTablet;
};

export const getTouchTargetSize = (size: 'sm' | 'md' | 'lg'): string => {
  const sizes = {
    sm: '44px',  // Minimum touch target (Apple HIG)
    md: '56px',  // Comfortable touch target
    lg: '72px'   // Large touch target
  };
  return sizes[size];
};

export const getResponsiveSpacing = (size: 'xs' | 'sm' | 'md' | 'lg'): string => {
  const spacing = {
    xs: '8px',   // Minimal spacing
    sm: '16px',  // Standard spacing
    md: '24px',  // Comfortable spacing
    lg: '32px'   // Generous spacing
  };
  return spacing[size];
};
