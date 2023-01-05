/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
