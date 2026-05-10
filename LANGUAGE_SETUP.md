# English and Arabic Language Support Setup

This document explains how to use the English and Arabic language switching functionality in your React application.

## Overview

The application now supports:
- **English (en)** - Left-to-Right (LTR) layout
- **Arabic (ar)** - Right-to-Left (RTL) layout
- Automatic language detection and persistence
- RTL/LTR layout switching
- Comprehensive translation system

## Files Modified/Created

### Core Language Files
- `components/constant/i18n.js` - Main i18n configuration with translations
- `components/constant/langConfig.json` - Language configuration
- `helpers/Language/LanguageContext.js` - Language context
- `helpers/Language/LanguageProvider.js` - Language provider with RTL support
- `helpers/Language/useLanguage.js` - Custom hook for easy language usage

### Updated Components
- `components/headers/common/currency.js` - Language switcher in header
- `components/headers/common/topbar-dark.js` - Translated topbar
- `components/common/Paragraph.js` - Translated paragraph component
- `pages/_app.js` - Added LanguageProvider

### New Components
- `components/common/LanguageSwitcher.js` - Standalone language switcher

## How to Use

### 1. Using Translations in Components

```jsx
import React from 'react';
import { useLanguage } from '../helpers/Language/useLanguage';

const MyComponent = () => {
  const { t, currentLanguage, isRTL } = useLanguage();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <h1>{t('welcome_message')}</h1>
      <p>{t('description')}</p>
      <button>{t('add_to_cart')}</button>
    </div>
  );
};
```

### 2. Language Switching

```jsx
import React from 'react';
import { useLanguage } from '../helpers/Language/useLanguage';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
};
```

### 3. RTL Support

The system automatically handles RTL/LTR switching:

```jsx
const { isRTL } = useLanguage();

// Use isRTL for conditional styling
<div style={{ 
  textAlign: isRTL ? 'right' : 'left',
  marginRight: isRTL ? 0 : '10px',
  marginLeft: isRTL ? '10px' : 0 
}}>
  Content
</div>
```

## Available Translation Keys

### Common E-commerce Terms
- `add_to_cart` - Add to Cart / أضف إلى السلة
- `buy_now` - Buy Now / اشتري الآن
- `price` - Price / السعر
- `quantity` - Quantity / الكمية
- `total` - Total / المجموع
- `shipping` - Shipping / الشحن
- `checkout` - Checkout / الدفع

### Navigation
- `Home` - Home / الرئيسية
- `Shop` - Shop / المتجر
- `Products` - Products / المنتجات
- `Pages` - Pages / الصفحات
- `Blogs` - Blogs / المدونات

### User Account
- `login` - Login / تسجيل الدخول
- `register` - Register / التسجيل
- `logout` - Logout / تسجيل الخروج
- `my_account` - My Account / حسابي
- `wishlist` - Wishlist / قائمة الأمنيات
- `cart` - Cart / السلة

### Product Categories
- `fashion` - Fashion / الموضة
- `beauty` - Beauty / الجمال
- `electronic` - Electronic / إلكترونيات
- `furniture` - Furniture / أثاث
- `kids` - Kids / أطفال

### Status Messages
- `in_stock` - In Stock / متوفر
- `out_of_stock` - Out of Stock / غير متوفر
- `loading` - Loading... / جاري التحميل...
- `error` - Error / خطأ
- `success` - Success / نجح

## Adding New Translations

### 1. Add to i18n.js

```javascript
// In components/constant/i18n.js
resources: {
  en: {
    translations: {
      'new_key': 'English translation',
      // ... other keys
    }
  },
  ar: {
    translations: {
      'new_key': 'الترجمة العربية',
      // ... other keys
    }
  }
}
```

### 2. Use in Components

```jsx
const { t } = useLanguage();
return <span>{t('new_key')}</span>;
```

## RTL Styling

The application includes comprehensive RTL styles in `public/assets/scss/theme/_rtl.scss`. Key features:

- Automatic text direction switching
- Proper margin/padding adjustments
- Menu and navigation RTL support
- Form elements RTL alignment
- Product grid RTL layout

## Language Persistence

- Language preference is saved in `localStorage`
- Automatically restored on page reload
- Defaults to English if no preference is set

## Browser Support

- Modern browsers with ES6+ support
- RTL support in all major browsers
- Fallback to LTR if RTL is not supported

## Best Practices

1. **Always use the `t()` function** for user-facing text
2. **Use `isRTL` for conditional styling** when needed
3. **Test both languages** during development
4. **Keep translations consistent** across the application
5. **Use semantic translation keys** (e.g., `add_to_cart` not `button1`)

## Troubleshooting

### Language not switching
- Check if LanguageProvider is wrapping your app
- Verify the language key exists in both en and ar translations
- Check browser console for i18n errors

### RTL layout issues
- Ensure RTL styles are loaded
- Check if `isRTL` is being used correctly
- Verify CSS classes are applied to body element

### Missing translations
- Add the key to both English and Arabic sections
- Use fallback text: `t('key', 'Fallback text')`
- Check for typos in translation keys

## Example Implementation

```jsx
import React from 'react';
import { useLanguage } from '../helpers/Language/useLanguage';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const ExamplePage = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`page ${isRTL ? 'rtl' : 'ltr'}`}>
      <header>
        <LanguageSwitcher />
        <h1>{t('welcome_message')}</h1>
      </header>
      
      <main>
        <section>
          <h2>{t('featured_products')}</h2>
          <div className="product-grid">
            {/* Product items */}
          </div>
        </section>
      </main>
      
      <footer>
        <p>{t('copyright')}</p>
      </footer>
    </div>
  );
};

export default ExamplePage;
```

This setup provides a complete bilingual experience with proper RTL support for Arabic users.
