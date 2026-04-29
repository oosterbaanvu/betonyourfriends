/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        bone: "#F5F1E8",
        lime: "#C6FF3D",
        pink: "#FF3D8A",
        violet: "#7A3DFF",
        sun: "#FFD23D",
        ash: "#1C1C1C",
        chalk: "#FFFFFF",
      },
      fontFamily: {
        display: ["System"],
        mono: ["Courier"],
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
    },
  },
  plugins: [],
};
