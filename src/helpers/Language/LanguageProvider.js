import React, { useState, useEffect, createContext } from 'react';
import i18next from '../../components/constant/i18n';

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    i18next.changeLanguage(savedLanguage);
    
    // Set RTL based on language
    const rtl = savedLanguage === 'ar';
    setIsRTL(rtl);
    
    // Apply RTL/LTR classes to body and html
    if (rtl) {
      document.body.classList.remove('ltr');
      document.body.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
      document.documentElement.classList.add('rtl');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.body.classList.remove('rtl');
      document.body.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
      document.documentElement.classList.add('ltr');
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, []);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    i18next.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    
    // Set RTL based on language
    const rtl = language === 'ar';
    setIsRTL(rtl);
    
    // Apply RTL/LTR classes to body and html
    if (rtl) {
      document.body.classList.remove('ltr');
      document.body.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
      document.documentElement.classList.add('rtl');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.body.classList.remove('rtl');
      document.body.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
      document.documentElement.classList.add('ltr');
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  };

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };
