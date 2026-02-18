

// /** @type {import('tailwindcss').Config} */
// import daisyui from 'daisyui';

// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {},
//   },
//   plugins: [daisyui],
//   daisyui: {
//     themes: [
//       {
//         light: {
//           ...require("daisyui/src/theming/themes")["light"], // Updated path for 4.x
//           "primary": "#06b6d4",
//           "secondary": "#64748b",
//           "accent": "#9333ea",
//           "neutral": "#1f2937",
//           "base-100": "#ffffff",
//         },
//         dark: {
//           ...require("daisyui/src/theming/themes")["dark"], // Updated path for 4.x
//           "primary": "#06b6d4",
//           "secondary": "#64748b",
//           "accent": "#9333ea",
//           "neutral": "#1f2937",
//           "base-100": "#0f172a",
//         }
//       }
//     ]
//   }
// };

/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Primary color palette
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Main primary
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Secondary color palette
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Main secondary
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Accent color palette
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#9333ea', // Main accent
          600: '#7e22ce',
          700: '#6b21a8',
          800: '#581c87',
          900: '#3b0764',
        },
        // Neutral colors
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937', // Main neutral
          900: '#111827',
        },
        // Base colors
        'base-100': {
          light: '#ffffff',
          dark: '#0f172a',
        },
        'base-content': {
          light: '#1f2937',
          dark: '#f3f4f6',
        },
      },
      // Extended spacing scale
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#06b6d4',
          secondary: '#64748b',
          accent: '#9333ea',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-content': '#1f2937',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        dark: {
          primary: '#06b6d4',
          secondary: '#64748b',
          accent: '#9333ea',
          neutral: '#1f2937',
          'base-100': '#0f172a',
          'base-content': '#f3f4f6',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
      },
    ],
    darkTheme: "dark", // Specify dark theme variant
    base: false, // Disable DaisyUI base styles
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: false,
  },
};