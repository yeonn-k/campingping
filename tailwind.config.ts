import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        shadowCustom: '1px 4px 15px rgba(0,0,0,0.15)',
        iconShadow: '1px 2px 9px rgba(0,0,0,0.15)',
        mapListShadow: '1px -5px 14px rgba(0,0,0,0.25)',
      },
      width: {
        '10.5/12': '87.5%',
      },
      height: {
        '92%': '92%',
      },
      zIndex: {
        zCard: '1',
        zSearchBar: '1',
        zFAB: '12',
        zNav: '30',
        zModal: '16',
        zBottomNav: '8',
        zBanner: '4',
        zMapModal: '6',
        zChat: '20',
      },
      fontSize: {
        title: '24px',
        subTitle: '22px',
        content: '16px',
        description: '14px',
      },
      fontFamily: {
        sans: ['Noto Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        Green: '#96E348',
        Yellow: '#FFB342',
        LightGray: '#D9D9D9',
        Gray: '#A9A9A9',
        DarkGray: '#919191',
        black: '#000000',
        white: '#ffffff',
        kakaoYellow: '#FBE300',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
export default config;
