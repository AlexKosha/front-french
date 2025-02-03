import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import RNLocalize from 'react-native-localize';
import translationEN from './src/locales/en/translationEN.json';
import translationUK from './src/locales/uk/translationUK.json';
// import "@formatjs/intl-pluralrules/polyfill";
// import "@formatjs/intl-pluralrules/locale-data/en"; // для англійської (або будь-якої іншої мови)

// import dayjs from "dayjs";
// import localizedFormat from "dayjs/plugin/localizedFormat"; // якщо потрібно
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // якщо потрібно
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // якщо потрібно
// import "dayjs/locale/uk"; // імпорт української локалі

// dayjs.extend(localizedFormat); // якщо потрібно
// dayjs.extend(isSameOrAfter); // якщо потрібно
// dayjs.extend(isSameOrBefore); // якщо потрібно

// Тексти для англійської та української мов

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  return locales.length > 0 && locales[0].languageCode === 'uk' ? 'uk' : 'en';
};

const resources = {
  en: {
    translation: translationEN,
  },
  uk: {
    translation: translationUK,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en', // мова за замовчуванням
  interpolation: {
    escapeValue: false, // для безпеки React
  },
});

// dayjs.locale(Localization.locale.includes("uk") ? "uk" : "en");
export default i18n;
