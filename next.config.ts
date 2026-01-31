import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'avatar.vercel.sh',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
