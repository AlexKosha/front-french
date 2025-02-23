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
    dontHaveAcc: getTranslation('rg', 'dontHaveAcc'),
    haveAccButForgotPass: getTranslation('rg', 'haveAccButForgotPass'),
    resetPassHere: getTranslation('rg', 'resetPassHere'),

    send: getTranslation('rg', 'send'),
    newPassword: getTranslation('rg', 'newPassword'),
    back: getTranslation('rg', 'back'),
    saveChanges: getTranslation('rg', 'saveChanges'),
    sendCode: getTranslation('rg', 'sendCode'),
    techSupport: getTranslation('rg', 'techSupport'),
    clickHere: getTranslation('rg', 'clickHere'),
    support: getTranslation('rg', 'support'),
    phonetic: getTranslation('LAT', 'phonetic'),
    vocab: getTranslation('LAT', 'vocab'),
    verbs: getTranslation('LAT', 'verbs'),
    learn: getTranslation('LAT', 'learn'),
    train: getTranslation('LAT', 'train'),
    completedWords: getTranslation('LAT', 'completedWords'),
    words: getTranslation('LAT', 'words'),
    word: getTranslation('LAT', 'word'),
    next: getTranslation('btn', 'next'),
    sessionCompleted: getTranslation('LAT', 'sessionCompleted'),
    repeat: getTranslation('btn', 'repeat'),
    goBack: getTranslation('btn', 'goBack'),
    chooseCount: getTranslation('btn', 'chooseCount'),
    hello: getTranslation('rg', 'hello'),
    cancel: getTranslation('btn', 'cancel'),
    confirm: getTranslation('btn', 'confirm'),
    welcomeAlert: getTranslation('alert', 'welcomeAlert'),
    close: getTranslation('alert', 'close'),
    registerError: getTranslation('alert', 'registerError'),
    loginError: getTranslation('alert', 'loginError'),
    name: getTranslation('validation', 'name'),
    birthDate: getTranslation('validation', 'birthDate'),
    email: getTranslation('validation', 'email'),
    password: getTranslation('validation', 'password'),
    code: getTranslation('validation', 'code'),
  };
};
