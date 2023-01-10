const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = withSuperjson()({
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
});

module.exports = nextConfig;
