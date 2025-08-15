import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'fly': 'fly 4s ease-in-out infinite',
        'trail': 'trail 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
        'progress-glow': 'progress-glow 2s ease-in-out infinite',
        'fly-across': 'fly-across 8s linear infinite',
        'globe-spin': 'globe-spin 20s linear infinite',
        'airplane-orbit': 'airplane-orbit 8s linear infinite',
        'orbit': 'orbit 12s linear infinite',
        'continent-drift': 'continent-drift 15s ease-in-out infinite',
        'cloud-drift': 'cloud-drift 20s linear infinite',
        'cloud-drift-reverse': 'cloud-drift-reverse 25s linear infinite',
        'radar-pulse': 'radar-pulse 3s ease-in-out infinite',
        'float-geometric': 'float-geometric 4s ease-in-out infinite',
        'path-draw': 'path-draw 3s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};

export default config;