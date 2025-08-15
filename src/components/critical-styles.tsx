'use client';

export default function CriticalStyles() {
  return (
    <style jsx global>{`
      /* Critical above-the-fold styles */
      body {
        margin: 0;
        padding: 0;
        font-family: var(--font-poppins), system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Prevent layout shift for hero section */
      .hero-container {
        min-height: 682px;
        background: linear-gradient(to bottom, #0ABAB5, #84DDDA, #F0FBFA);
      }
      
      /* Prevent layout shift for navbar */
      .navbar-container {
        height: 80px;
        position: relative;
        z-index: 50;
      }
      
      /* Prevent layout shift for form container */
      .form-container {
        min-height: 120px;
        background: white;
        border-radius: 9999px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      
      /* Logo container fixed dimensions */
      .logo-container {
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 80px;
      }
      
      /* Avatar placeholder to prevent layout shift */
      .avatar-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Prevent cumulative layout shift */
      img {
        max-width: 100%;
        height: auto;
      }
      
      /* Loading state to prevent layout shift */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `}</style>
  )
}