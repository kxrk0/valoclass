/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.valorant-api.com', 'titles.trackercdn.com'],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
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
