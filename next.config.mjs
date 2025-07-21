/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: `${process.env.NEXT_PUBLIC_CHAINLIT_BACKEND_URL}chat/ws/:path*`
      }
    ];
  }
};

export default nextConfig;