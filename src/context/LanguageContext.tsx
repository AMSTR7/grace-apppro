import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const translations: Record<string, { en: string; am: string }> = {
  'nav.home': { en: 'Home', am: 'ቤት' },
  'nav.bible': { en: 'Bible', am: 'መጽሐፍ ቅዱስ' },
  'nav.verses': { en: 'Verses', am: 'የመጽሐፍ ቅዱስ ጥቅሶች' },
  'nav.posts': { en: 'Posts', am: 'ልጥፎች' },
  'nav.books': { en: 'Books', am: 'መጻሕፍት' },
  'nav.courses': { en: 'Courses', am: 'ኮርሶች' },
  'nav.quiz': { en: 'Quiz', am: 'ጥያቄዎች' },
  'nav.chat': { en: 'Chat', am: 'ውይይት' },
  'nav.profile': { en: 'Profile', am: 'መገለጫ' },
  'nav.admin': { en: 'Admin', am: 'አስተዳደር' },
  'nav.about': { en: 'About', am: 'ስለ እኛ' },
  'nav.flyers': { en: 'Flyers', am: 'ወረቀቶች' },
  'nav.blog': { en: 'Blog', am: 'ብሎግ' },
  'nav.notebook': { en: 'Notebook', am: 'ማስታወሻ' },
  'nav.live': { en: 'Live', am: 'ቀጥታ' },
  'nav.donate': { en: 'Donate', am: 'ይለግሱ' },
  'nav.settings': { en: 'Settings', am: 'ቅንብሮች' },
  'nav.terms': { en: 'Terms of Use', am: 'የአጠቃቀም ደንቦች' },
  'nav.privacy': { en: 'Privacy Policy', am: 'የግላዊነት ፖሊሲ' },
  'nav.signIn': { en: 'Sign In', am: 'ግባ' },
  'common.search': { en: 'Search', am: 'ፈልግ' },
  'common.download': { en: 'Download', am: 'አውርድ' },
  'common.share': { en: 'Share', am: 'አጋራ' },
  'common.save': { en: 'Save', am: 'አስቀምጥ' },
  'common.edit': { en: 'Edit', am: 'አስተካክል' },
  'common.delete': { en: 'Delete', am: 'አጥፋ' },
  'common.cancel': { en: 'Cancel', am: 'ይቅር' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('grace-lang');
    return stored === 'am' ? 'am' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('grace-lang', lang);
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const toggleLang = () => setLangState((p) => (p === 'en' ? 'am' : 'en'));

  const t = (key: string) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
