import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const defaultLanguage = 'en';
const translations = {
  en: {
    home: 'Home',
    zora: 'Zora',
    allArticles: 'All Articles',
    news: 'News',
    asia: 'Asia',
    america: 'America',
    africa: 'Africa',
    europe: 'Europe',
    middleEast: 'Middle East',
    pakistan: 'Pakistan',
    politics: 'Politics',
    sports: 'Sports',
    tech: 'Technology',
    health: 'Health',
    business: 'Business',
    science: 'Science',
    entertainment: 'Entertainment',
    environment: 'Environment',
    education: 'Education',
    lifestyle: 'Lifestyle',
    artsCulture: 'Arts & Culture',
    weather: 'Weather',
    food: 'Food',
    travel: 'Travel',
    fashion: 'Fashion',
    trending: 'Trending',
    standard: 'Standard News',
    breaking: 'Breaking',
    exclusive: 'Exclusive',
    investigation: 'Investigation',
    analysis: 'Analysis',
    feature: 'Feature',
    interview: 'Interview',
    opinion: 'Opinion',
    editorial: 'Editorial',
    factCheck: 'Fact Check',
    live: 'Live Blog',
    obituary: 'Obituary',
    review: 'Review',
    extra: 'More',
    welcome: 'Welcome',
    admin: 'Admin',
    logout: 'Logout',
    login: 'Login',
    account: 'Account',
    quickLinks: 'Quick Links',
    pakistanNews: 'Pakistan News',
    contactUs: 'Contact Us',
    newsletter: 'Newsletter',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    aboutUs: 'About Us',
    contact: 'Contact',
    // multiLanguage is only for article filtering, not a language mode
    multiLanguage: 'Multi-Language'
  },
  ur: {
    zora: 'زورہ',
    welcome: 'خوش آمدید',
    login: 'لاگ ان',
    account: 'اکاؤنٹ',
    admin: 'ایڈمن',
    logout: 'لاگ آؤٹ',
    createArticle: 'نیا مضمون بنائیں',
    home: 'ہوم',
    allArticles: 'تمام خبریں',
    news: 'خبریں',
    asia: 'ایشیا',
    america: 'امریکہ',
    africa: 'افریقہ',
    europe: 'یورپ',
    middleEast: 'مشرق وسطیٰ',
    pakistan: 'پاکستان',
    politics: 'سیاست',
    sports: 'کھیل',
    tech: 'ٹیکنالوجی',
    health: 'صحت',
    business: 'کاروبار',
    science: 'سائنس',
    entertainment: 'تفریح',
    environment: 'ماحولیات',
    education: 'تعلیم',
    lifestyle: 'طرز زندگی',
    artsCulture: 'آرٹس و ثقافت',
    weather: 'موسم',
    food: 'کھانا',
    travel: 'سفر',
    fashion: 'فیشن',
    trending: 'رجحانات',
    standard: 'معیاری خبریں',
    breaking: 'اہم',
    exclusive: 'خصوصی',
    investigation: 'تحقیقات',
    analysis: 'تجزیہ',
    feature: 'فیچر',
    interview: 'انٹرویو',
    opinion: 'رائے',
    editorial: 'اداریہ',
    factCheck: 'حقائق کی جانچ',
    live: 'لائیو بلاگ',
    obituary: 'تعزیتی',
    review: 'جائزہ',
    extra: 'مزید',
    welcome: 'خوش آمدید',
    admin: 'ایڈمن',
    logout: 'لاگ آؤٹ',
    login: 'لاگ ان',
    account: 'اکاؤنٹ',
    quickLinks: 'فوری روابط',
    pakistanNews: 'پاکستان کی خبریں',
    contactUs: 'ہم سے رابطہ کریں',
    newsletter: 'نیوز لیٹر',
    privacyPolicy: 'پرائیویسی پالیسی',
    termsOfService: 'سروس کی شرائط',
    aboutUs: 'ہمارے بارے میں',
    contact: 'رابطہ',
    // multiLanguage is only for article filtering, not a language mode
    multiLanguage: 'کثیر لسانی'
  }
};

const LanguageContext = createContext({
  currentLanguage: defaultLanguage,
  switchLanguage: () => {},
  t: (key) => key,
  isRTL: false,
});


export const LanguageProvider = ({ children, initialLanguage }) => {
  // Only allow 'en' or 'ur' as valid languages
  const isValidLanguage = (lang) => lang === 'en' || lang === 'ur';

  const getInitialLanguage = () => {
    // Try initialLanguage prop first
    if (isValidLanguage(initialLanguage)) return initialLanguage;
    // Then try localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language');
      if (isValidLanguage(stored)) return stored;
    }
    // Fallback to default ONLY on first load
    return defaultLanguage;
  };

  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

  // Only update if new initialLanguage is valid and different
  useEffect(() => {
    // Only update if new initialLanguage is valid and different
    if (!isValidLanguage(initialLanguage)) return;
    if (initialLanguage !== currentLanguage) {
      setCurrentLanguage(initialLanguage);
    }
    // If initialLanguage is invalid, do NOT change currentLanguage (keep last valid)
  }, [initialLanguage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set HTML attributes
      document.documentElement.dir = currentLanguage === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLanguage;
      // Save to localStorage
      localStorage.setItem('language', currentLanguage);
      // Set cookie for server-side access, always with path=/ and SameSite=Lax
      document.cookie = `language=${currentLanguage}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, [currentLanguage]);

  const switchLanguage = async (lang) => {
    if (!isValidLanguage(lang)) return;
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('language', lang);
      // Set cookie via API for server-side
      try {
        await axios.post('/set-language', { language: lang });
      } catch (e) {}
      // Also set client cookie for instant SPA
      document.cookie = `language=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const isRTL = currentLanguage === 'ur';

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      switchLanguage, 
      t, 
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);