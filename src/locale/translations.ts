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
    vocabOrVerbs: TranslationContent;
  };
  alert: {
    welcomeAlert: TranslationContent;
    close: TranslationContent;
    codeOnMail: TranslationContent;
    passwordChanged: TranslationContent;
    dataChanged: TranslationContent;
    loginError: TranslationContent;
    registerError: TranslationContent;
    trainVerbCompleted: TranslationContent;
    progressWillBeLost: TranslationContent;
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
    verify: TranslationContent;
    warning: TranslationContent;
  };
  verbsSection: {
    chooseTense: TranslationContent;
    wantTrainVerbs: TranslationContent;
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
      en: 'Welcome! This app will help you learn French easily and effectively. Here, you will find interactive lessons, pronunciation exercises, grammar and vocabulary training, as well as practical tasks to improve your skills.',
      uk: 'Привіт! Цей додаток допоможе вам вивчити французьку мову легко та ефективно. Тут ви знайдете інтерактивні уроки, вправи на вимову, граматику та словниковий запас, а також зможете тренувати свої навички через практичні завдання',
    },
    vocabOrVerbs: {en: 'Study and Train', uk: 'Навчатися та грати'},
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
    trainVerbCompleted: {
      en: 'Congratulations! You’ve completed the level 🎉',
      uk: 'Вітаємо! Ти виконав(-ла) рівень 🎉',
    },
    progressWillBeLost: {
      en: 'If you exit now, your progress will be lost. Are you sure you want to leave?',
      uk: 'Якщо ви вийдете, ваш прогрес буде втрачено. Ви впевнені, що хочете вийти?',
    },
  },
  validation: {
    name: {
      en: 'Start with a capital letter and a minimum of 3 letters',
      uk: "Ім'я повинно починатися з великої літери, та мати мінімум три літери",
    },
    birthDate: {
      en: 'User must be at least 14 years old',
      uk: 'Користувачу повинно бути мінімум 14 років',
    },
    email: {
      en: 'Enter a valid email address',
      uk: 'Введіть коректну електронну адресу',
    },
    password: {
      en: 'The password must contain at least 6 characters',
      uk: 'Пароль повинен містити мінімум 6 символів',
    },
    code: {
      en: 'Enter the code you received in the mail',
      uk: 'Введіть код який прийшов вам на пошту',
    },
  },
  LAT: {
    lat: {en: 'Latitude', uk: 'Широта'},
    vocab: {en: 'Vocabulary', uk: 'Лексика'},
    phonetic: {en: 'Phonetic', uk: 'Фонетика'},
    verbs: {en: 'Verbs', uk: 'Дієслова'},
    learn: {en: 'Learn', uk: 'Вчити'},
    train: {en: 'Train', uk: 'Тренуватися'},
    completedWords: {en: 'Completed Words', uk: 'Завершені слова'},
    words: {en: 'Words', uk: 'Слів'},
    word: {en: 'Word', uk: 'Слово'},
    sessionCompleted: {en: 'Session Completed', uk: 'Сесію завершено'},
    search: {en: 'Search', uk: 'Пошук'},
  },
  btn: {
    cancel: {en: 'Cancel', uk: 'Скасувати'},
    confirm: {en: 'Confirm', uk: 'Підтвердити'},
    repeat: {en: 'Repeat', uk: 'Повторити'},
    train: {en: 'Train', uk: 'Тренувати'},
    chooseCount: {en: 'Choose Count', uk: 'Виберіть кількість'},
    goBack: {en: 'Go Back', uk: 'Повернутися'},
    next: {en: 'Next', uk: 'Далі'},
    verify: {en: 'Verify', uk: 'Перевірити'},
    warning: {en: ' Warning', uk: 'Попередження'},
  },
  verbsSection: {
    chooseTense: {
      en: 'Choose a tense to study or practice',
      uk: 'Обери час для вивчення або тренування',
    },
    wantTrainVerbs: {en: 'Train Verbs', uk: 'Тренувати дієслова'},
  },
};

// Тепер TypeScript буде знати точну структуру і типи об'єкта translations.
