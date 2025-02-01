import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
};

const nextConfigFunction = async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWAPlugin = (await import('@ducanh2912/next-pwa')).default({
      dest: 'public',
      maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 5MB로 설정
    });
    return withPWAPlugin(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;
