import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (isServer) {
          config.externals = [...(config.externals || []), "ssh2"];
        }
        return config;
      },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // domains: [process.env?.IKON_DOMAIN || ""],
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    IKON_DOMAIN: process.env.IKON_DOMAIN,
    IKON_BASE_URL: process.env.IKON_BASE_URL,
    NEXT_PORT: process.env.NEXT_PORT,
    NEXT_BASE_PATH: process.env.NEXT_BASE_PATH,
  },
  //basePath: '/ikon-bms',
};

export default nextConfig;
