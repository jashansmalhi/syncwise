import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        slateBrand: '#0b1020',
        cyanBrand: '#35d9ff',
        mintBrand: '#54f0c1',
        coralBrand: '#ff6b6b',
        peachBrand: '#ffb86b',
      },
      boxShadow: {
        panel: '0 20px 60px rgba(11, 16, 32, 0.25)',
        glow: '0 0 0 1px rgba(255,255,255,0.1), 0 18px 40px rgba(53,217,255,0.25)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 10% 10%, rgba(53,217,255,0.15), transparent 40%), radial-gradient(circle at 90% 10%, rgba(84,240,193,0.14), transparent 35%), linear-gradient(145deg, #060b18 0%, #10182f 45%, #0f2435 100%)',
        party:
          'radial-gradient(circle at 15% 20%, rgba(255,184,107,0.22), transparent 45%), radial-gradient(circle at 80% 0%, rgba(53,217,255,0.18), transparent 35%), radial-gradient(circle at 80% 80%, rgba(255,107,107,0.22), transparent 45%), linear-gradient(150deg, #070b17 0%, #111938 45%, #0b1f2f 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
