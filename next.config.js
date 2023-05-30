const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = withSuperjson()({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
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
