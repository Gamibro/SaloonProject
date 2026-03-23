// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{html,js}"],
//   daisyui:{
//     themes: [
//       {
//         doctortheme:{
//           "primary": "#ff0000",
//           "secondary": "#202020",
//           "accent": "#5d5656",
//           "neutral": "#2c2c2c",
          
//           "base-100": "#FFFFFF",
//           "info": "#d4d4d4",
//           // "base-150":"#9e9e9e"
//         }
//       }
//     ]
//   },
//   theme: {
//     extend: {},
//   },
//   plugins: [require("daisyui")],
// }

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}