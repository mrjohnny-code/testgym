/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/testgym' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/testgym/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: false
};
export default nextConfig;