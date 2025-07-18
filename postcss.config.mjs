const config = {
  plugins: ["@tailwindcss/postcss"],
  content: [
    "./**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss,sass,less,styl,stylus}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./partials/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
