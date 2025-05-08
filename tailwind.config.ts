import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
        heading: ['var(--font-heading-family)', ...defaultTheme.fontFamily.serif], // Use Merienda from CSS var
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: {
          DEFAULT: 'hsl(var(--input))',
          foreground: 'hsl(var(--input-foreground))'
        },
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
        // Additional fantasy palette colors
        'sky-blue-hsl': 'hsl(var(--sky-blue-hsl))',
        'rose-pink-hsl': 'hsl(var(--rose-pink-hsl))',
        'emerald-green-hsl': 'hsl(var(--emerald-green-hsl))',
        'mystic-gold-hsl': 'hsl(var(--mystic-gold-hsl))',
        'amethyst-purple-hsl': 'hsl(var(--amethyst-purple-hsl))',
        'electric-lime-hsl': 'hsl(var(--electric-lime-hsl))',
        'orange-flame-hsl': 'hsl(var(--orange-flame-hsl))',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
        /* Removed old sparkle-animation and pulse-glow from here, moved to globals.css with specifics for lamp */
         'lamp-bob': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'lamp-blink': {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
         'pulse-glow-lamp': {
          'from': { filter: 'drop-shadow(0 0 3px hsl(var(--primary) / 0.7)) drop-shadow(0 0 8px hsl(var(--accent) / 0.5))' },
          'to': { filter: 'drop-shadow(0 0 6px hsl(var(--primary))) drop-shadow(0 0 15px hsl(var(--accent) / 0.7))' }
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'lamp-bob': 'lamp-bob 3s infinite ease-in-out',
        'lamp-blink': 'lamp-blink 5s infinite',
        'pulse-glow-lamp': 'pulse-glow-lamp 2.5s infinite alternate',
  		},
      boxShadow: {
        'up-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
