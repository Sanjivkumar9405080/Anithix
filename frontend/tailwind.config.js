/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFFFFF',
          alt: '#F7F8FC',
          lavender: '#F0EDFF',
          softBlue: '#EAF6FF',
        },
        primary: {
          DEFAULT: '#635BFF',
          deep: '#5145E5',
          light: '#8B7CFF',
        },
        electric: '#38BDF8',
        sky: '#38BDF8',
        text: {
          main: '#171923',
          secondary: '#667085',
        },
        border: {
          DEFAULT: '#E8EAF2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(99, 91, 255, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 8px 24px -4px rgba(99, 91, 255, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 36px -6px rgba(99, 91, 255, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'glow-primary': '0 0 30px rgba(99, 91, 255, 0.25)',
        'glow-electric': '0 0 25px rgba(56, 189, 248, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #635BFF 0%, #8B7CFF 45%, #38BDF8 100%)',
        'soft-radial': 'radial-gradient(circle at 50% 50%, rgba(240, 237, 255, 0.8) 0%, rgba(234, 246, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [],
}
