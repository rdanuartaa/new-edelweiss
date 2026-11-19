export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  flagIcon: string;
  region: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'id',
    name: 'Indonesia',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    flagIcon: '/images/flags/id.svg',
    region: 'Asia',
  },
  {
    code: 'en',
    name: 'Inggris',
    nativeName: 'English',
    flag: '🇬🇧',
    flagIcon: '/images/flags/gb.svg',
    region: 'Internasional',
  },
  {
    code: 'de',
    name: 'Jerman',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    flagIcon: '/images/flags/de.svg',
    region: 'Eropa',
  },
  {
    code: 'zh-CN',
    name: 'Mandarin (Tiongkok)',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    flagIcon: '/images/flags/cn.svg',
    region: 'Asia',
  },
  {
    code: 'ja',
    name: 'Jepang',
    nativeName: '日本語',
    flag: '🇯🇵',
    flagIcon: '/images/flags/jp.svg',
    region: 'Asia',
  },
  {
    code: 'ko',
    name: 'Korea',
    nativeName: '한국어',
    flag: '🇰🇷',
    flagIcon: '/images/flags/kr.svg',
    region: 'Asia',
  },
  {
    code: 'ar',
    name: 'Arab',
    nativeName: 'العربية',
    flag: '🇸🇦',
    flagIcon: '/images/flags/sa.svg',
    region: 'Asia',
  },
  {
    code: 'th',
    name: 'Thailand',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    flagIcon: '/images/flags/th.svg',
    region: 'Asia',
  },
  {
    code: 'vi',
    name: 'Vietnam',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    flagIcon: '/images/flags/vn.svg',
    region: 'Asia',
  },
  {
    code: 'ms',
    name: 'Malaysia',
    nativeName: 'Bahasa Melayu',
    flag: '🇲🇾',
    flagIcon: '/images/flags/my.svg',
    region: 'Asia',
  },
  {
    code: 'hi',
    name: 'India',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    flagIcon: '/images/flags/in.svg',
    region: 'Asia',
  },
  {
    code: 'tl',
    name: 'Filipina',
    nativeName: 'Filipino (Tagalog)',
    flag: '🇵🇭',
    flagIcon: '/images/flags/ph.svg',
    region: 'Asia',
  },
];
