/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@fitment/domain",
    "@fitment/catalog",
    "@fitment/compatibility-engine",
  ],
};

export default nextConfig;
