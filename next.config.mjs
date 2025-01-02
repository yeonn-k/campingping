/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gocamping.or.kr'],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          'https://kdt-react-node-1-team03.elicecoding.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
