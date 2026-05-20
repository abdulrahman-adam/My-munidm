export default {
  darkMode: 'class', // Permet d'activer le mode sombre via la classe 'dark'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#020617',
      }
    },
  },
  plugins: [],
}