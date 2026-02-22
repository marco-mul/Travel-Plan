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
  // Tell Next.js to include the Prisma engine binary from the custom output path
  outputFileTracingIncludes: {
    "**/*": ["./app/generated/prisma/**/*"],
  },
};

export default nextConfig;
