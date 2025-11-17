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
        md: "600px",
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif"],
      },
      fontSize: {
        // Headline 스타일
        "headline-1": ["26px", { lineHeight: "36px", fontWeight: "700" }], // Bold
        "headline-2": ["24px", { lineHeight: "32px", fontWeight: "700" }], // Bold
        "headline-3": ["22px", { lineHeight: "29px", fontWeight: "700" }], // Bold
        "headline-4": ["20px", { lineHeight: "29px", fontWeight: "700" }], // Bold
        "headline-5": ["18px", { lineHeight: "22px", fontWeight: "600" }], // Semi-bold
        // Subhead 스타일
        "subhead-1": ["20px", { lineHeight: "22px", fontWeight: "600" }], // Semi-bold
        "subhead-2": ["16px", { lineHeight: "22px", fontWeight: "700" }], // Bold
        "subhead-3": ["14px", { lineHeight: "22px", fontWeight: "600" }], // Semi-bold
        // Body 스타일
        "body-1": ["30px", { lineHeight: "36px", fontWeight: "600" }], // Semi-bold
        "body-2": ["18px", { lineHeight: "22px", fontWeight: "500" }], // Medium
        "body-3": ["16px", { lineHeight: "24px", fontWeight: "600" }], // Semi-bold
        "body-4": ["16px", { lineHeight: "24px", fontWeight: "500" }], // Medium
        "body-5": ["14px", { lineHeight: "17px", fontWeight: "500" }], // Medium
        // Caption 스타일
        "caption-1": ["14px", { lineHeight: "16px", fontWeight: "600" }], // Semi-bold
        "caption-2": ["12px", { lineHeight: "16px", fontWeight: "500" }], // Medium
      },
      colors: {
        // Primary 컬러 팔레트
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

        // Secondary 컬러 팔레트 (이미지 기준)
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

        // Grayscale 팔레트
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
          primary:  "#406686", // button-primary
          hover:    "#487290", // button-hover
          pressed:  "#35586E", // button-pressed
          disabled: "#B6C4CC", // button-disabled
        },

        // 텍스트 토큰
        "text-on-color": "#FFFFFF", // text-on-color (예: 버튼 위의 흰 텍스트)
        "text-primary":  "#334D56", // 텍스트 토큰용 메인 컬러

        // Bg 토큰
        page: "#F7F7F7", // bg-page -> 사용 시 `bg-page`

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
