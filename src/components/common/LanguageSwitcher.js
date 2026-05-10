import React from 'react';
import { useLanguage } from '../../helpers/Language/useLanguage';
import language from '../constant/langConfig.json';

const LanguageSwitcher = ({ className = '', showLabel = true }) => {
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();

  return (
    <div className={`language-switcher ${className}`}>
      {showLabel && (
        <span className="language-label" style={{ marginRight: isRTL ? 0 : '10px', marginLeft: isRTL ? '10px' : 0 }}>
          {isRTL ? 'اللغة:' : 'Language:'}
        </span>
      )}
      <select 
        value={currentLanguage} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {language.map((lang) => (
          <option key={lang.val} value={lang.val}>
            {lang.lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
