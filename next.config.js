const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = withSuperjson()({
  // reactStrictMode: true,
  reactStrictMode: false,
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
  // async headers() {
  //   return [
  //     {
  //       source: "/feed",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
});

module.exports = nextConfig;
