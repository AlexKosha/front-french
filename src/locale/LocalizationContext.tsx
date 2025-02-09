import React, {createContext, useState, useContext, useEffect} from 'react';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TranslationLanguages, translations} from '../locale/translations';

interface LocalizationContextType {
  locale: string;
  setLocale: (lang: string) => void;
  translate: (
    section: TranslationSection,
    key: TranslationKey, // Це тепер строго типізовано для кожної секції
    locale: TranslationLanguages,
  ) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined,
);

// Тип для ключів на рівні розділів (наприклад, 'rg', 'hm' тощо)
type TranslationSection = keyof typeof translations;

// Тип для ключів на рівні підсистем для кожної секції
type TranslationKey = keyof (typeof translations)[TranslationSection];

// Функція для перекладу
export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    const fetchLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLocale(savedLanguage);
      } else {
        const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
        setLocale(deviceLanguage);
      }
    };
    fetchLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    setLocale(lang);
    await AsyncStorage.setItem('language', lang); // Зберігаємо вибір мови
  };

  const translate = (
    section: TranslationSection,
    key: TranslationKey, // Оновлено тип для ключа
    locale: TranslationLanguages,
  ): string => {
    return translations[section]?.[key]?.[locale] || key;
  };

  return (
    <LocalizationContext.Provider
      value={{locale, setLocale: changeLanguage, translate}}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider',
    );
  }
  return context;
};
