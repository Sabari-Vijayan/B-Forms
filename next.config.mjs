/** @type {import('next').NextConfig} */
const nextConfig = {
  // Speed up compilation by optimizing common large libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "@radix-ui/react-icons", "date-fns"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
