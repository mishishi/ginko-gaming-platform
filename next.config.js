/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Improve HMR stability in development
    if (dev && !isServer) {
      config.optimization.moduleIds = 'named'
      config.resolve.mainFields = ['browser', 'module', 'main']
    }
    return config
  },
}

module.exports = nextConfig
