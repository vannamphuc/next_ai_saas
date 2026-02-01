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
      {
        hostname: '8unz9qmjur.ufs.sh',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
