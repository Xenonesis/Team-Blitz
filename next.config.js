/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['tsparticles', 'react-tsparticles'],
  
  // Enable React Strict Mode for production
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-intersection-observer'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  webpack: (config, { isServer, dev }) => {
    // Fix for client-side libraries on server
    if (isServer) {
      config.externals = [...(config.externals || []), 'tsparticles', 'react-tsparticles'];
    }
    
    // Handle module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Fix for server-side modules in client bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'firebase-admin': false,
        'nodemailer': false,
        'node-cron': false,
        'bcryptjs': false,
        'jsonwebtoken': false,
      };
    }
    
    return config;
  },
  
  // Production-only configuration
  ...(process.env.NODE_ENV === 'production' && {
    poweredByHeader: false,
  }),
};

module.exports = nextConfig;
