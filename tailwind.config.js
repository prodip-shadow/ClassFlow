import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/contexts/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        classflow: {
          primary: '#f97316',
          'primary-content': '#ffffff',
          secondary: '#1a1a1a',
          'secondary-content': '#ffffff',
          accent: '#ea6c0a',
          'accent-content': '#ffffff',
          neutral: '#141414',
          'neutral-content': '#ffffff',
          'base-100': '#0a0a0a',
          'base-200': '#111111',
          'base-300': '#1f1f1f',
          'base-content': '#ffffff',
          info: '#3abff8',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
    darkTheme: 'classflow',
    base: true,
    styled: true,
    utils: true,
  },
};
