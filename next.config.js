/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['tsparticles', 'react-tsparticles'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-intersection-observer']
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
    // Firebase config
    config.externals = [...(config.externals || []), { firebase: 'firebase' }];
    return config;
  },
};

module.exports = nextConfig; 