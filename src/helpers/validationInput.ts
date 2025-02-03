export const validateName = (name: string) => {
  const regex = /^[A-ZА-Я][a-zа-яїєґіA-ZА-ЯЇЄҐІ'-]{2,}$/;
  return regex.test(name);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateOtp = (otp: string) => {
  return otp.length > 1;
};

export const validateBirthDate = (birthDate: string) => {
  const minAge = 14;
  const maxAge = 100;

  // Перетворюємо введену дату на об'єкт Date
  const date = new Date(birthDate);
  const today = new Date();

  // Якщо введена дата некоректна
  if (isNaN(date.getTime())) {
    return false;
  }

  // Обчислюємо різницю в роках між сьогоднішнім днем і датою народження
  const age = today.getFullYear() - date.getFullYear();

  // Перевірка віку: повинен бути між 14 і 100 роками
  if (age < minAge || age > maxAge) {
    return false;
  }

  // Якщо вік рівний мінімальному або максимальному, перевіряємо точні дати
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();

  if (age === minAge && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))) {
    return false;
  }

  if (age === maxAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff > 0))) {
    return false;
  }

  return true;
};
