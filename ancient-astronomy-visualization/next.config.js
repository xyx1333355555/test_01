/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
    unoptimized: true,
  },
  webpack(config) {
    return config;
  }
}

module.exports = nextConfig
