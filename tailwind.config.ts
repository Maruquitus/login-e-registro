const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in-float": "fadeInFloat 1s ease-out",
      },
      keyframes: {
        fadeInFloat: {
          "0%": { opacity: 0, transform: "translateY(7px)" },
          "75%": { opacity: 0.75, transform: "translateY(0)" },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

export default config;
