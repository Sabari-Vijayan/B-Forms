/** @type {import('next').NextConfig} */
const nextConfig = {
  // Speed up compilation by optimizing common large libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "@radix-ui/react-icons", "date-fns"],
  },
};

export default nextConfig;
