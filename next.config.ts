import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //we configure the image uploader to allow images from our uploadthing bucket
  images: {
    remotePatterns: [
      {
        hostname: "yuiipwjv67.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
