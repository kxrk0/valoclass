/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack
  experimental: {
    turbo: {
      rules: {
        '*.scss': {
          loaders: ['sass-loader'],
          as: '*.css',
        },
      },
    },
  },
  images: {
    domains: ['media.valorant-api.com', 'titles.trackercdn.com'],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: '@import "variables";',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
