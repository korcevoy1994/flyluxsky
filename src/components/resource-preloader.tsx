'use client';

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  images?: string[];
  fonts?: string[];
  scripts?: string[];
}

export default function ResourcePreloader({ images = [], fonts = [], scripts = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload critical images
    images.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    fonts.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = src;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload scripts
    scripts.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      document.head.appendChild(link);
    });
  }, [images, fonts, scripts]);

  return null;
}