/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable compression
  compress: true,
  
  // Font optimization is enabled by default in Next.js 13+
  // SWC minification is enabled by default in Next.js 12+
  
  // Enable source maps for better debugging
  productionBrowserSourceMaps: true,
  
  // Bundle analyzer (only in development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer')({
          enabled: true,
        }))()
      )
      return config
    },
  }),
  
  // Remove unused CSS in production
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config, { isServer }) => {
      // Ignore known noisy warnings from certain deps
      config.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
      ]

      // Optionally enable analyzer in production when ANALYZE=true
      if (process.env.ANALYZE === 'true') {
        config.plugins.push(
          new (require('@next/bundle-analyzer')({ enabled: true }))()
        )
      }

      if (!isServer) {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        }
      }
      return config
    },
  }),
}

export default nextConfig