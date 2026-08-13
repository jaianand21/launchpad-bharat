import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en';
import hi from './hi';

const I18nContext = createContext(null);
const DICTIONARIES = { en, hi };

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('lb_locale') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lb_locale', locale);
  }, [locale]);

  const t = (key, variables = {}) => {
    const dict = DICTIONARIES[locale] || DICTIONARIES['en'];
    let text = dict[key] || DICTIONARIES['en'][key] || key;
    
    // Replace placeholders like {name}
    Object.entries(variables).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    
    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
