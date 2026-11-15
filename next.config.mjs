/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: Vercel serves it as a fast static site. No server needed.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
};
export default nextConfig;
