/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      rubik: ['"Rubik"', "sans-serif"],
    },
    extend: {
      colors: {
        bgBlue: "#0b131e",
        highlightBlue: "#0561a5",
        midBlue: "#202b3b",
        textBright: "#dde0e4",
        primary: "#9399a2",
      },
      backgroundImage: {
        custom_02: "url(../sunny.png)",
      },
    },
  },
  plugins: [],
};
