/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        rivalz: {
          'bg-0C0E12': '#0C0E12',
          'bg-primary': '#13161B',
          'bg-primary-hovered': '#23262E',
          'light-gray': '#f4f4f41f',
          'text-primary': '#FAFAFA',
          'text-tertiary': '#7E8084',
          'text-secondary': '#94979C',
          'border-primary': '#373A40',
          'border-secondary': '#23262E',
          'border-secondary-hovered': '#373A40',
          'badge-bg-dark': '#0C0E12',
          'badge-fg-primary': '#69FF93',
          'badge-fg-dark': '#CECFD2',
          'badge-border-dark': '#373A40',
          'group-border-primary': '#265C35',
          'group-bg-primary': '#1B4327',
          'button-primary-fg': '#0C0E12',
          'button-primary-bg': '#69FF93',
          'button-line-neutral-border': '#373A40',
          'button-line-ghost-link-neutral-fg': '#94979C',
          'button-line-ghost-link-primary': '#3BB25D',
          'button-line-ghost-link-brand-fg-hover': '#69FF9329',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      container: {
        center: true,
        screens: {
          '2xl': '1120px',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'progress-transition': 'all 1s ease-in-out',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #69FF93 0%, #E5E18A 50%, #F9C981 100%)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
}