import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Assuming AI might return images from Google's user content storage
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      { // Placeholder for AI image generation if it uses this pattern
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      { // Placeholder for AI image generation if it uses this pattern from Gemini
        protocol: 'https',
        hostname: 'generativelanguage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Allow serving local images from public/images directory
    // This is not strictly needed for remotePatterns but good for consistency if
    // next/image is used with local static assets.
    // For local images, the path starts with `/` and Next.js handles it.
    // No specific config needed here for local /public images.
  },
};

export default nextConfig;
