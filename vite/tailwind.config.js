/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "token-button": "0 0 10px 0 rgba(34, 34, 34, 0.04)",
        top: "0px -4px 16px 0px rgba(0, 0, 0, .1);",
        card: "rgba(0, 0, 0, 0.08) 0px 4px 15px",
      },
      borderColor: {
        "token-button": "rgba(34, 34, 34, 0.07)",
      },
      animation: {
        livePulse: "livePulse 3s ease 0s infinite normal none running",
        slideTop: "slideTop 0.1s slidein none",
      },
      keyframes: {
        livePulse: {
          "0%": {
            boxShadow: "0px 0px 0px 0px rgb(52, 199, 123)",
          },
          "70%": {
            boxShadow: "0px 0px 0px 7px rgba(52, 199, 123, 0)",
          },
          "100%": {
            boxShadow: "0px 0px 0px 0px rgba(52, 199, 123, 0)",
          },
        },
        slideTop: {
          "0%": {
            bottom: 0,
          },
          "50%": {
            bottom: 5,
          },
          "100%": {
            bottom: 10,
          },
        },
      },
      colors: {
        "default-color": "#6B70F5",
      },
    },
  },
  plugins: [],
};
