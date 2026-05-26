import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const apiOrigin = process.env.API_PROXY_TARGET ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
