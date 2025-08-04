// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                // enable `dark:` variants
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './pages/**/*.{js,jsx,ts,tsx,html}',
    './components/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC107',
        'primary-foreground': '#FFFFFF',
        secondary: '#313D6A',
        'secondary-foreground': '#FFFFFF',
        tertiary: '#FFFCE0',
        'tertiary-foreground': '#FFFFFF',
        background: '#FFFFFF',
        foreground: '#000000',
        card: '#FFFFFF',
        'card-foreground': '#000000',
        popover: '#FFFFFF',
        'popover-foreground': '#000000',
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#E5E7EB',
        // …and any chart-*, sidebar-*, etc.
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    require('tw-animate-css'),  // ← use the correct package name here
  ],
}
