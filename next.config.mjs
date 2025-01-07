/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'gocamping.or.kr',
      'campingping-image.s3.ap-northeast-2.amazonaws.com',
    ],
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
