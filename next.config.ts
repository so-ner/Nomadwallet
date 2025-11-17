import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // 보안: X-Powered-By 제거
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'developers.google.com',
      },
    ],
  },
};

export default nextConfig;
