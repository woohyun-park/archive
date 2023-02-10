const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      "black-f": colors.black,
      black: colors.gray[900],
      white: colors.white,
      "gray-1f": colors.gray[800],
      "gray-1": colors.gray[700],
      "gray-2f": colors.gray[500],
      "gray-2": colors.gray[400],
      "gray-3f": colors.gray[300],
      "gray-3": colors.gray[200],
      "gray-4f": colors.gray[100],
      "gray-4": colors.gray[50],
      red: colors.red[500],
      orange: colors.orange[500],
      amber: colors.amber[500],
      yellow: colors.yellow[500],
      lime: colors.lime[500],
      green: colors.green[500],
      emerald: colors.emerald[500],
      teal: colors.teal[500],
      cyan: colors.cyan[500],
      sky: colors.sky[500],
      blue: colors.blue[500],
      indigo: colors.indigo[500],
      violet: colors.violet[500],
      purple: colors.purple[500],
      fuchsia: colors.fuchsia[500],
      pink: colors.pink[500],
    },
    extend: {
      colors: {},
    },
  },
  plugins: [],
};
