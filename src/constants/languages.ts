export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'id',
    name: 'Indonesia',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    region: 'Asia',
  },
  {
    code: 'en',
    name: 'Inggris',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'Internasional',
  },
  {
    code: 'de',
    name: 'Jerman',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'Eropa',
  },
  {
    code: 'zh-CN',
    name: 'Mandarin (Tiongkok)',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    region: 'Asia',
  },
  {
    code: 'ja',
    name: 'Jepang',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: 'Asia',
  },
  {
    code: 'ko',
    name: 'Korea',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: 'Asia',
  },
  {
    code: 'ar',
    name: 'Arab',
    nativeName: 'العربية',
    flag: '🇸🇦',
    region: 'Asia',
  },
  {
    code: 'th',
    name: 'Thailand',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    region: 'Asia',
  },
  {
    code: 'vi',
    name: 'Vietnam',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    region: 'Asia',
  },
  {
    code: 'ms',
    name: 'Malaysia',
    nativeName: 'Bahasa Melayu',
    flag: '🇲🇾',
    region: 'Asia',
  },
  {
    code: 'hi',
    name: 'India',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    region: 'Asia',
  },
  {
    code: 'tl',
    name: 'Filipina',
    nativeName: 'Filipino (Tagalog)',
    flag: '🇵🇭',
    region: 'Asia',
  },
];
