import React from 'react';
import { useLanguage } from '../../helpers/Language/useLanguage';

const RTLWrapper = ({ children, className = '', style = {}, ...props }) => {
  const { isRTL } = useLanguage();

  const rtlStyles = {
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
    ...style
  };

  return (
    <div 
      className={`${className} ${isRTL ? 'rtl-content' : 'ltr-content'}`}
      style={rtlStyles}
      {...props}
    >
      {children}
    </div>
  );
};

export default RTLWrapper;
