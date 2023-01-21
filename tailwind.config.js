const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      black: colors.black,
      "gray-1": colors.gray[700],
      "gray-2": colors.gray[400],
      "gray-3": colors.gray[100],
      white: colors.white,
    },
    extend: {
      colors: {
        // txt1: colors.black,
        // txt2: colors["gray-500"],
        // txt1: "#000000",
        // txt2: "#4A4A4A",
        // txt3: "#818181",
        // txtDark1: "#FFFFFF",
        // txtDark2: "#818181",
        // txtDark3: "#4A4A4A",
        // txtBtn: "#FFFFFF",
        // txtBtnDark: "#000000",
        // bg1: "#FFFFFF",
        // bgDark1: "#2C2C2C",
        // bg2: "#D9D9D9",
        // bgDark2: "#D9D9D9",
        // btn1: "#000000",
        // btnDark1: "#FFFFFF",
        // btn2: "#D9D9D9",
        // btnDark2: "#D9D9D9",
        // btnOverlay: "rgba(0, 0, 0, 0.75)",
        // btnOverlayDark: "rgba(255, 255, 255, 0.75)",
        // primary: "#3B4998",
        // red: "#EF4552",
        // orange: "#F7892B",
        // yellow: "#F7D733",
        // green: "#2EB87C",
        // blue: "#1BC0DB",
        // navy: "#0B4F92",
        // purple: "#602E84",
      },
    },
  },
  plugins: [],
};
