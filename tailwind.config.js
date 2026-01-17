 // @type {import('tailwindcss').Config}
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // Bootstrap reset/typography 충돌 방지
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

