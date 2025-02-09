export type TranslationLanguages = 'en' | 'uk';
export type TranslationKey =
  keyof (typeof translations)[keyof typeof translations];

interface TranslationContent {
  en: string;
  uk: string;
}

export interface Translations {
  rg: {
    changeLanguage: TranslationContent;
    register: TranslationContent;
    welcomeBack: TranslationContent;
    name: TranslationContent;
    placeName: TranslationContent;
    placePass: TranslationContent;
    placeEmail: TranslationContent;
    placeNewEmail: TranslationContent;
    placeDoB: TranslationContent;
    email: TranslationContent;
    password: TranslationContent;
    newPassword: TranslationContent;
    placeNewPassword: TranslationContent;
    dateOfBirth: TranslationContent;
    createAcc: TranslationContent;
    letsAcq: TranslationContent;
    agreeTerms: TranslationContent;
    alreadyAccount: TranslationContent;
    dontHaveAcc: TranslationContent;
    login: TranslationContent;
    try: TranslationContent;
    changeInfo: TranslationContent;
    profile: TranslationContent;
    hello: TranslationContent;
    saveChanges: TranslationContent;
    haveAccButForgotPass: TranslationContent;
    resetPassHere: TranslationContent;
    code: TranslationContent;
    placeCode: TranslationContent;
    save: TranslationContent;
    sendCode: TranslationContent;
    send: TranslationContent;
    back: TranslationContent;
    techSupport: TranslationContent;
    clickHere: TranslationContent;
    support: TranslationContent;
  };
  hm: {
    welcome: TranslationContent;
    studyAndTrain: TranslationContent;
    lessonsBySubscr: TranslationContent;
  };
  alert: {
    welcomeAlert: TranslationContent;
    close: TranslationContent;
    codeOnMail: TranslationContent;
    passwordChanged: TranslationContent;
    dataChanged: TranslationContent;
    loginError: TranslationContent;
    registerError: TranslationContent;
  };
  validation: {
    name: TranslationContent;
    birthDate: TranslationContent;
    email: TranslationContent;
    password: TranslationContent;
    code: TranslationContent;
  };
  LAT: {
    lat: TranslationContent;
    vocab: TranslationContent;
    phonetic: TranslationContent;
    verbs: TranslationContent;
    learn: TranslationContent;
    train: TranslationContent;
    completedWords: TranslationContent;
    words: TranslationContent;
    word: TranslationContent;
    sessionCompleted: TranslationContent;
    search: TranslationContent;
  };
  btn: {
    cancel: TranslationContent;
    confirm: TranslationContent;
    repeat: TranslationContent;
    train: TranslationContent;
    chooseCount: TranslationContent;
    goBack: TranslationContent;
    next: TranslationContent;
  };
}

export const translations: Translations = {
  rg: {
    changeLanguage: {en: 'Change the language', uk: 'Змінити мову'},
    register: {en: 'Create account', uk: 'Створити акаунт'},
    welcomeBack: {en: 'Hey, Welcome back!', uk: 'Привіт, з поверненням!'},
    name: {en: 'Name', uk: "Ім'я"},
    placeName: {en: 'Enter name', uk: "Введіть ім'я"},
    placeDoB: {en: 'Enter date of birth', uk: 'Введіть дату народження'},
    placePass: {en: 'Enter password', uk: 'Введіть пароль'},
    placeEmail: {en: 'Enter email', uk: 'Введіть електронну адресу'},
    placeNewEmail: {
      en: 'Enter new email',
      uk: 'Введітть нову електронну пошту',
    },
    email: {en: 'Email', uk: 'Електронна пошта'},
    password: {en: 'Password', uk: 'Пароль'},
    newPassword: {en: 'New Password', uk: 'Новий пароль'},
    placeNewPassword: {en: 'Enter new password', uk: 'Введіть новий пароль'},
    dateOfBirth: {en: 'Date of birth', uk: 'Дата народження'},
    createAcc: {en: 'Create account', uk: 'Створити акаунт'},
    letsAcq: {en: "Let's get acquainted!", uk: 'Давай познайомимось!'},
    agreeTerms: {
      en: 'I agree with conditions and requirements',
      uk: 'Я погоджуюся з умовами та положеннями',
    },
    alreadyAccount: {
      en: 'Do you have already the account?',
      uk: 'Вже маєте акаунт?',
    },
    dontHaveAcc: {en: "Don't have an account?", uk: 'Немає облікового запису?'},
    login: {en: 'Login', uk: 'Увійти'},
    try: {en: 'Try', uk: 'Спробуй'},
    changeInfo: {
      en: 'You can change your info in',
      uk: 'Змінити свою особисту інформацію у',
    },
    profile: {en: 'Profile', uk: 'Профіль'},
    hello: {en: 'Hello', uk: 'Привіт'},
    saveChanges: {en: 'Save Changes', uk: 'Зберегти зміни'},
    haveAccButForgotPass: {en: 'Forgot your password?', uk: 'Забули пароль?'},
    resetPassHere: {en: 'Reset password', uk: 'Натисніть тут'},
    code: {en: 'Code', uk: 'Код'},
    placeCode: {en: 'Enter your code', uk: 'Введіть код'},
    save: {en: 'Save', uk: 'Зберегти'},
    sendCode: {
      en: 'Please enter the email address you used to register your account',
      uk: 'Введіть вашу електронну адресу, яку ви використали для реєстрації облікового запису.',
    },
    send: {en: 'Send', uk: 'Надіслати'},
    back: {en: 'Back', uk: 'Назад'},
    techSupport: {en: 'Contact support', uk: 'Звернутися до служби підтримки'},
    clickHere: {en: 'Click Here', uk: 'Натисніть тут'},
    support: {
      en: 'You can email us at la.prof.p@ukr.net if you encounter any issues.',
      uk: 'Ви можете нам написати на нашу електронну пошту, якщо у вас виникли проблеми - la.prof.p@ukr.net',
    },
  },
  hm: {
    welcome: {
      en: 'Welcome! This is your Home Page',
      uk: 'Привіт! Це твоя основна сторінка',
    },
    studyAndTrain: {en: 'Study and Train', uk: 'Навчатися та грати'},
    lessonsBySubscr: {en: 'Lessons by subscription', uk: 'Уроки за підпискою'},
  },
  alert: {
    welcomeAlert: {en: 'Welcome Alert', uk: 'Привітання'},
    close: {en: 'Close', uk: 'Закрити'},
    codeOnMail: {
      en: 'Code sent to your email',
      uk: 'Код надіслано на вашу пошту',
    },
    passwordChanged: {
      en: 'Password changed successfully',
      uk: 'Пароль успішно змінено',
    },
    dataChanged: {en: 'Your data has been updated', uk: 'Ваші дані оновлено'},
    loginError: {
      en: 'Login failed, please try again',
      uk: 'Не вдалося увійти, спробуйте ще раз',
    },
    registerError: {
      en: 'Registration failed, please try again',
      uk: 'Не вдалося зареєструватися, спробуйте ще раз',
    },
  },
  validation: {
    name: {en: 'Name is required', uk: 'Ім’я обов’язкове'},
    birthDate: {
      en: 'Date of birth is required',
      uk: 'Дата народження обов’язкова',
    },
    email: {en: 'Email is required', uk: 'Електронна пошта обов’язкова'},
    password: {en: 'Password is required', uk: 'Пароль обов’язковий'},
    code: {en: 'Code is required', uk: 'Код обов’язковий'},
  },
  LAT: {
    lat: {en: 'Latitude', uk: 'Широта'},
    vocab: {en: 'Vocabulary', uk: 'Лексика'},
    phonetic: {en: 'Phonetic', uk: 'Фонетика'},
    verbs: {en: 'Verbs', uk: 'Дієслова'},
    learn: {en: 'Learn', uk: 'Вчити'},
    train: {en: 'Train', uk: 'Тренуватися'},
    completedWords: {en: 'Completed Words', uk: 'Завершені слова'},
    words: {en: 'Words', uk: 'Слова'},
    word: {en: 'Word', uk: 'Слово'},
    sessionCompleted: {en: 'Session Completed', uk: 'Сесію завершено'},
    search: {en: 'Search', uk: 'Пошук'},
  },
  btn: {
    cancel: {en: 'Cancel', uk: 'Скасувати'},
    confirm: {en: 'Confirm', uk: 'Підтвердити'},
    repeat: {en: 'Repeat', uk: 'Повторити'},
    train: {en: 'Train', uk: 'Тренуватися'},
    chooseCount: {en: 'Choose Count', uk: 'Виберіть кількість'},
    goBack: {en: 'Go Back', uk: 'Повернутися'},
    next: {en: 'Next', uk: 'Далі'},
  },
};

// Тепер TypeScript буде знати точну структуру і типи об'єкта translations.
