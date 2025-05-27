module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cricket: {
          primary: '#1a365d',
          secondary: '#e53e3e',
          accent: '#f6ad55',
          light: '#f7fafc',
          dark: '#2d3748',
          pitch: '#38a169',
          crease: '#f0fff4',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Montserrat"', 'sans-serif'],
      },
      // Remove the backgroundImage section entirely
      boxShadow: {
        'cricket': '0 4px 6px -1px rgba(26, 54, 93, 0.1), 0 2px 4px -1px rgba(26, 54, 93, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      }
    },
  },
  plugins: [],
};