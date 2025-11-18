import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-button-primary',
    'bg-button-hover',
    'bg-button-pressed',
    'bg-button-disabled',
    'hover:bg-button-hover',
    'active:bg-button-pressed',
    'border-button-primary',
    'border-button-pressed',
    'text-button-primary',
    'hover:bg-button-primary',
    'hover:text-white',
    'active:bg-button-pressed',
    'active:text-white',
  ],
  theme: {
    extend: {
      screens: {
        md: "600px",
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif"],
      },
      fontSize: {
        // Headline 스타일
        "headline-1": ["26px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-2": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "headline-3": ["22px", { lineHeight: "29px", fontWeight: "700" }],
        "headline-4": ["20px", { lineHeight: "29px", fontWeight: "700" }],
        "headline-5": ["18px", { lineHeight: "22px", fontWeight: "600" }],
        // Subhead 스타일
        "subhead-1": ["20px", { lineHeight: "22px", fontWeight: "600" }],
        "subhead-2": ["16px", { lineHeight: "22px", fontWeight: "700" }],
        "subhead-3": ["14px", { lineHeight: "22px", fontWeight: "600" }],
        // Body 스타일
        "body-1": ["30px", { lineHeight: "36px", fontWeight: "600" }],
        "body-2": ["18px", { lineHeight: "22px", fontWeight: "500" }],
        "body-3": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-4": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "body-5": ["14px", { lineHeight: "17px", fontWeight: "500" }],
        // Caption 스타일
        "caption-1": ["14px", { lineHeight: "16px", fontWeight: "600" }],
        "caption-2": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      colors: {
        primary: {
          100: "#D9F4F9",
          200: "#B5E6F3",
          300: "#87C4DB",
          400: "#609BB8",
          500: "#326789",
          600: "#245175",
          700: "#193D62",
          800: "#0F2B4F",
          900: "#091E41",
        },
        secondary: {
          50:  "#FFFFFF",
          100: "#F4F5EC",
          200: "#E9ECDA",
          300: "#C3C7B0",
          400: "#8C907B",
          500: "#444739",
          600: "#383D2A",
          700: "#2D331F",
          800: "#232914",
          900: "#1B220D",
        },
        grayscale: {
          100: "#FFFFFF",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        // 버튼 토큰
        button: {
          primary:  "#406686",
          hover:    "#487290",
          pressed:  "#35586E",
          disabled: "#B6C4CC",
        },
        // 텍스트 토큰
        "text-on-color": "#FFFFFF",
        "text-primary":  "#334D56",
        // Bg 토큰
        page: "#F7F7F7",
        // 수입/지출/성공/입력 토큰
        status: {
          income:  "#5C97E9", // income
          spend:   "#EB4F49", // spend
          success: "#60BA63", // success
          input:   "#F4F5FA", // input
        },
      },
    },
  },
  plugins: [],
};

export default config;
