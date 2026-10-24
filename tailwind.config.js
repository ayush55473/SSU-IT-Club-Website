/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#672C1C', // Dark Brown brand colour
          dark: '#481B0F',
          light: '#833925',
          subtle: '#FAF6F4',
        },
        secondary: {
          DEFAULT: '#AE7B29', // Mustard Gold accent colour
          dark: '#8E621C',
          light: '#C9963D',
          subtle: '#FCF9F3',
        },
        neutral: {
          dark: '#2B1209',
          muted: '#66534B',
          light: '#F8F6F4',
          border: 'rgba(103, 44, 28, 0.12)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        tech: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(103, 44, 28, 0.06)',
        'elevated': '0 20px 40px -15px rgba(103, 44, 28, 0.10)',
        'gold-glow': '0 0 25px rgba(174, 123, 41, 0.22)',
        'gold-glow-lg': '0 0 45px rgba(174, 123, 41, 0.32)',
        'card-hover': '0 25px 50px -12px rgba(103, 44, 28, 0.15)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        }
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
