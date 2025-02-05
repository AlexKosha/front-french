import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import RNLocalize from 'react-native-localize';
import translationEN from './src/locales/en/translationEN.json';
import translationUK from './src/locales/uk/translationUK.json';

// Імпорт dayjs та його локалізацій (якщо потрібно)
import dayjs from 'dayjs';
import 'dayjs/locale/uk'; // для української локалі
import 'dayjs/locale/en'; // для англійської локалі

// Функція для отримання мови пристрою
const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    const languageCode = locales[0].languageCode;
    // Перевірка для української мови
    if (languageCode === 'uk') {
      return 'uk';
    }
    // В іншому випадку використовуємо англійську мову
    return 'en';
  }
  // Якщо мова не визначена, за замовчуванням ставимо англійську
  return 'en';
};

// Налаштування ресурсів для i18n
const resources = {
  en: {
    translation: translationEN,
  },
  uk: {
    translation: translationUK,
  },
};

// Ініціалізація i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en', // мова за замовчуванням
  debug: true, // включення логів для налагодження
  interpolation: {
    escapeValue: false, // для безпеки React
  },
});

// Функція для налаштування dayjs
const setDayjsLocale = () => {
  const deviceLanguage = getDeviceLanguage();
  dayjs.locale(deviceLanguage); // Встановлюємо локаль dayjs на основі мови пристрою
};

// Викликаємо функцію для налаштування dayjs
setDayjsLocale();

export default i18n;
