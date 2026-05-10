import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from './LanguageProvider';

export const useLanguage = () => {
  const { t } = useTranslation();
  const languageContext = useContext(LanguageContext);
  
  return {
    t,
    currentLanguage: languageContext?.currentLanguage || 'en',
    isRTL: languageContext?.isRTL || false,
    changeLanguage: languageContext?.changeLanguage || (() => {}),
  };
};
