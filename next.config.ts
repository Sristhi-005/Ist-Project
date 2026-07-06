import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: "/Ist-Project/",
  basePath: "/Ist-Project",
};

export default nextConfig;
