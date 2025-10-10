/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '1rem',
        xl: '1rem',
        '2xl': '1rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Retro/Neon colors
        neon: {
          pink: 'var(--neon-pink)',
          cyan: 'var(--neon-cyan)',
          green: 'var(--neon-green)',
          orange: 'var(--neon-orange)',
          blue: 'var(--electric-blue)',
        },
        // Validation colors
        validation: {
          error: {
            bg: 'var(--validation-error-bg)',
            border: 'var(--validation-error-border)',
            text: 'var(--validation-error-text)',
            detail: 'var(--validation-error-detail)',
            icon: 'var(--validation-error-icon)',
          },
          warning: {
            bg: 'var(--validation-warning-bg)',
            border: 'var(--validation-warning-border)',
            text: 'var(--validation-warning-text)',
            detail: 'var(--validation-warning-detail)',
            icon: 'var(--validation-warning-icon)',
          },
          success: {
            bg: 'var(--validation-success-bg)',
            border: 'var(--validation-success-border)',
            text: 'var(--validation-success-text)',
            detail: 'var(--validation-success-detail)',
            icon: 'var(--validation-success-icon)',
          },
        },
        // Toast colors
        toast: {
          success: {
            bg: 'var(--toast-success-bg)',
            border: 'var(--toast-success-border)',
            text: 'var(--toast-success-text)',
            icon: 'var(--toast-success-icon)',
          },
          error: {
            bg: 'var(--toast-error-bg)',
            border: 'var(--toast-error-border)',
            text: 'var(--toast-error-text)',
            icon: 'var(--toast-error-icon)',
          },
          info: {
            bg: 'var(--toast-info-bg)',
            border: 'var(--toast-info-border)',
            text: 'var(--toast-info-text)',
            icon: 'var(--toast-info-icon)',
          },
          warning: {
            bg: 'var(--toast-warning-bg)',
            border: 'var(--toast-warning-border)',
            text: 'var(--toast-warning-text)',
            icon: 'var(--toast-warning-icon)',
          },
        },
        // Button variant colors
        button: {
          destructive: {
            bg: 'var(--button-destructive-bg)',
            border: 'var(--button-destructive-border)',
            hover: 'var(--button-destructive-hover)',
          },
          outline: {
            border: 'var(--button-outline-border)',
            text: 'var(--button-outline-text)',
            'hover-bg': 'var(--button-outline-hover-bg)',
            'hover-text': 'var(--button-outline-hover-text)',
            'hover-shadow': 'var(--button-outline-hover-shadow)',
          },
          secondary: {
            bg: 'var(--button-secondary-bg)',
            border: 'var(--button-secondary-border)',
          },
          ghost: {
            text: 'var(--button-ghost-text)',
            'hover-bg': 'var(--button-ghost-hover-bg)',
            'hover-text': 'var(--button-ghost-hover-text)',
            'hover-border': 'var(--button-ghost-hover-border)',
          },
          link: {
            text: 'var(--button-link-text)',
            'hover-text': 'var(--button-link-hover-text)',
          },
          neon: {
            border: 'var(--button-neon-border)',
            text: 'var(--button-neon-text)',
            'hover-bg': 'var(--button-neon-hover-bg)',
            'hover-text': 'var(--button-neon-hover-text)',
            'hover-shadow': 'var(--button-neon-hover-shadow)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}; 