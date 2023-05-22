/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        default: "#061b1e",
        primary: "#44acc1",
        secondary: "00eeff",
        tertiary: "#a0a0a0",
        text: "",
        subtext: "",
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      fontSize: {
        xxxs: [ "0.5rem",{ lineHeight: "0.6rem" } ],
        xxs: [ "0.6rem",{ lineHeight: "0.75rem" } ],
      }
    },
  },
  plugins: [],
};
