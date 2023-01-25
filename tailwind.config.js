const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      logo: ["Rammetto One", "sans-serif"],
    },
    colors: {
      "black-f": colors.black,
      black: colors.gray[900],
      white: colors.white,
      red: colors.red[500],
      "gray-1f": colors.gray[800],
      "gray-1": colors.gray[700],
      "gray-2f": colors.gray[500],
      "gray-2": colors.gray[400],
      "gray-3f": colors.gray[300],
      "gray-3": colors.gray[200],
      "gray-4f": colors.gray[100],
      "gray-4": colors.gray[50],
    },
    extend: {
      colors: {},
    },
  },
  plugins: [],
};
