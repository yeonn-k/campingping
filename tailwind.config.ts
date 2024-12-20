import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        '10.5/12': '87.5%',
      },
      zindex: {
        zCard: '1',
        zSearchBar: '1',
        zFAB: '12',
        zNav: '16',
        zModal: '16',
        zBottomNav: '8',
        zBanner: '4',
        zMapModal: '6',
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
      },
    },
  },
  plugins: [],
};
export default config;
