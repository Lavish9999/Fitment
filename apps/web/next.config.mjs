/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@fitment/domain",
    "@fitment/catalog",
    "@fitment/compatibility-engine",
  ],
  webpack(config) {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return config;
  },
};

export default nextConfig;
