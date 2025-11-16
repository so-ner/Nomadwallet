import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': '600px',
      },
      colors: {
        // Primary 컬러 팔레트 (100: 가장 밝음, 900: 가장 어두움)
        primary: {
          100: '#D9F4F9', // 매우 밝은 파란색
          200: '#B5E6F3', // 밝은 파란색
          300: '#87C4DB', // 연한 파란색
          400: '#609BB8', // 중간 밝기 파란색
          500: '#326789', // 메인 파란색
          600: '#245175', // 어두운 파란색
          700: '#193D62', // 더 어두운 파란색
          800: '#0F2B4F', // 매우 어두운 네이비 블루
          900: '#091E41', // 가장 어두운 네이비 블루
        },
        // Secondary 컬러 팔레트
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Success 컬러 팔레트 (그린)
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#10b981', // light
          500: '#059669', // 메인
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
        },
        // Warning 컬러 팔레트 (옐로우)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // 메인
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Background 컬러 팔레트
        background: {
          50: '#ffffff', // DEFAULT
          100: '#f9fafb', // light
          200: '#f7f7f7', // secondary
          300: '#f3f4f6', // tertiary
          400: '#f0f8ff', // promo
          500: '#e5e7eb',
          600: '#d1d5db',
          700: '#9ca3af',
          800: '#6b7280',
          900: '#0a0a0a', // dark
        },
        // Text 컬러 팔레트
        text: {
          50: '#ededed', // light
          100: '#f9fafb',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#d1d5db',
          500: '#6b7280', // secondary
          600: '#374151', // dark
          700: '#1f2937', // tertiary
          800: '#171717', // DEFAULT
          900: '#0a0a0a',
        },
        // Border 컬러 팔레트
        border: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb', // DEFAULT
          300: '#d1d5db', // light
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};
export default config;

