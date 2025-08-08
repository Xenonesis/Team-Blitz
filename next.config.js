/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['tsparticles', 'react-tsparticles'],
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.15:3000',
    "*"
  ],
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-intersection-observer'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...(config.externals || []), { firebase: 'firebase' }];
    return config;
  },
};

module.exports = nextConfig;
