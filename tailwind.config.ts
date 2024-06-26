import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#323DA5",
          neutral: "#3d57d3",
          "--border-btn": "0.2rem",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3d57d3",
          neutral: "#7397e7",
          "base-100": "#1f1f1f",
          "base-200": "#1d1d1d",
          "base-300": "#131313",
          "--border-btn": "0.2rem",
        },
      },
    ],
  },
};
export default config;
