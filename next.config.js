/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Improve HMR stability in development
    if (dev && !isServer) {
      config.optimization.moduleIds = 'named'
      config.resolve.mainFields = ['browser', 'module', 'main']

      // Improve cache stability with persistent filesystem cache
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: require('path').resolve('.next', 'webpack-cache'),
      }
    }
    return config
  },
}

module.exports = nextConfig
