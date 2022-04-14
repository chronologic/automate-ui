import { ITheme } from '../types';

const theme: ITheme = {
  name: 'magic',
  colors: {
    body: '#111827',
    header: 'black',
    text: '#f5f5f5',
    textAccent: '#f5f5f5',
    accent: '#F04444',
    accentGradient: 'linear-gradient(104deg, #F04444 0%, #F04444 100%)',
    shadow:
      '0 3px 6px -4px rgb(255 255 255 / 12%), 0 6px 16px 0 rgb(255 255 255 / 8%), 0 9px 28px 8px rgb(255 255 255 / 5%)',
    border: '#3e3e3e',
    weak: '#232323',
  },
  assets: {
    logoMain: '/assets/themes/magic__logo_main.svg',
    logoPartner: '/assets/themes/magic__logo_partner.svg',
  },
  urls: {
    partnerHomepage: 'https://www.treasure.lol/',
  },
};

export default theme;
