import {useLocalization} from './LocalizationContext'; // Імпортуємо useLocalization
import {Translations, translations} from './translations'; // замініть на правильний шлях до ваших перекладів

type Language = 'en' | 'uk';

export const useTranslationHelper = () => {
  const {locale} = useLocalization(); // Отримуємо поточну мову

  // Функція для отримання перекладу за ключем
  // const getTranslation = (key: string) => {
  //   return translations.rg[key as keyof typeof translations.rg][
  //     locale as Language
  //   ];
  // };

  const getTranslation = (category: keyof Translations, key: string) => {
    return (
      translations[category]?.[
        key as keyof (typeof translations)[typeof category]
      ]?.[locale as Language] || key
    );
  };

  return {
    registerText: getTranslation('rg', 'register'),
    nameText: getTranslation('rg', 'name'),
    emailText: getTranslation('rg', 'email'),
    passwordText: getTranslation('rg', 'password'),
    createAccText: getTranslation('rg', 'createAcc'),
    agreeTermsText: getTranslation('rg', 'agreeTerms'),
    letsAcq: getTranslation('rg', 'letsAcq'),
    dateOfBirth: getTranslation('rg', 'dateOfBirth'),
    alreadyAccount: getTranslation('rg', 'alreadyAccount'),
    login: getTranslation('rg', 'login'),
    welcomeBack: getTranslation('rg', 'welcomeBack'),
    welcome: getTranslation('hm', 'welcome'),
    studyAndTrain: getTranslation('hm', 'studyAndTrain'),
    lessonsBySubscr: getTranslation('hm', 'lessonsBySubscr'),
  };
};
