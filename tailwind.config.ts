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
        heading: ['var(--font-heading-family)', ...defaultTheme.fontFamily.serif], 
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
        // Core Fantasy Palette
        'bright-blue-hsl': 'hsl(var(--bright-blue-hsl))',
        'golden-yellow-hsl': 'hsl(var(--golden-yellow-hsl))',
        'emerald-green-hsl': 'hsl(var(--emerald-green-hsl))',
        'ruby-red-hsl': 'hsl(var(--ruby-red-hsl))',
        'pearl-white-hsl': 'hsl(var(--pearl-white-hsl))',
        // Optional/Additional Fantasy Palette
        'galactic-purple-hsl': 'hsl(var(--galactic-purple-hsl))',
        'neon-pink-hsl': 'hsl(var(--neon-pink-hsl))',
        'fiery-orange-hsl': 'hsl(var(--fiery-orange-hsl))',

        // Legacy color names remapped or available
        'sky-blue-hsl': 'hsl(var(--sky-blue-hsl))', // Remapped in globals.css
        'rose-pink-hsl': 'hsl(var(--rose-pink-hsl))', // Remapped
        'mystic-gold-hsl': 'hsl(var(--mystic-gold-hsl))', // Remapped
        'amethyst-purple-hsl': 'hsl(var(--amethyst-purple-hsl))', // Remapped
        'electric-lime-hsl': 'hsl(var(--electric-lime-hsl))', // Remapped
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
        /* Lamp specific animations are defined in globals.css and used via classes */
         'dreamy-bg-flow': { /* Renamed for clarity */
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'image-fade-in-sparkle': {
          '0%': { opacity: '0', transform: 'scale(0.8)', filter: 'drop-shadow(0 0 0px hsl(var(--accent)/0))' },
          '70%': { opacity: '1', transform: 'scale(1.05)', filter: 'drop-shadow(0 0 15px hsl(var(--accent)/0.7))' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'drop-shadow(0 0 5px hsl(var(--accent)/0.3))' },
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'dreamy-bg-flow': 'dreamy-bg-flow 25s ease-in-out infinite alternate',
        'image-fade-in-sparkle': 'image-fade-in-sparkle 0.7s ease-out forwards',
        /* Lamp specific animations applied via classes in globals.css */
  		},
      boxShadow: {
        'up-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)',
        'fantasy-glow-primary': '0 0 15px hsl(var(--primary)/0.5), 0 0 5px hsl(var(--primary)/0.7)',
        'fantasy-glow-accent': '0 0 15px hsl(var(--accent)/0.5), 0 0 5px hsl(var(--accent)/0.7)',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
