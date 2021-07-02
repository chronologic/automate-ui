import { ITheme } from '../types';

const theme: ITheme = {
  name: 'xfai',
  colors: {
    body: 'black',
    text: '#f5f5f5',
    textAccent: '#f5f5f5',
    accent: '#fc307b',
    accentGradient: 'linear-gradient(104deg, #fc307b 0%, #a22dc9 100%)',
    shadow:
      '0 3px 6px -4px rgb(255 255 255 / 12%), 0 6px 16px 0 rgb(255 255 255 / 8%), 0 9px 28px 8px rgb(255 255 255 / 5%)',
    border: '#3e3e3e',
    weak: '#232323',
  },
  assets: {
    logoMain: '/assets/themes/xfai__logo_main.svg',
    logoPartner: '/assets/themes/xfai__logo_partner.svg',
  },
  urls: {
    partnerHomepage: 'https://xfai.com',
  },
};

export default theme;
