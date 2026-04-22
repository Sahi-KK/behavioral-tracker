/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brutalist: {
          black: "#000000",
          white: "#FFFFFF",
          yellow: "#FFFF00",
          blue: "#0000FF",
          red: "#FF0000",
        },
      },
      borderWidth: {
        '4': '4px',
        '8': '8px',
      },
    },
  },
  plugins: [],
}
