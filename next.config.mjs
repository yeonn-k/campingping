/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/list',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'gocamping.or.kr',
      'campingping-image.s3.ap-northeast-2.amazonaws.com',
    ],
  },
  trailingSlash: true,
  // output: 'export',
};

export default nextConfig;
