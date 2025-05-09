/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['tsparticles', 'react-tsparticles'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-intersection-observer']
  }
};

module.exports = nextConfig; 