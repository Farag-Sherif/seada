import React from 'react';
import { useLanguage } from './useLanguage';

export const withRTL = (WrappedComponent) => {
  return function RTLComponent(props) {
    const { isRTL } = useLanguage();

    const rtlProps = {
      ...props,
      isRTL,
      style: {
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left',
        ...props.style
      }
    };

    return <WrappedComponent {...rtlProps} />;
  };
};

export default withRTL;
