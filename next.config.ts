import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('porto/internal', 'accounts');
    return config;
  },
};

export default nextConfig;
