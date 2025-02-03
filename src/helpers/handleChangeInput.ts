import {Dispatch, SetStateAction} from 'react';

type ErrorState = {
  nameError: string;
  birthDateError: string;
  emailError: string;
  passwordError: string;
};
interface formData {
  name: string;
  email: string;
  birthDate: string;
  password: string;
}

type HandleChange = (
  setter: Dispatch<SetStateAction<formData>>,
  key: string,
  validator: (text: string) => boolean, // функція для перевірки значення
  setError: Dispatch<SetStateAction<ErrorState>>, // setter для оновлення стану помилок
  errorKey: string, // ключ помилки
  errorMessage: string, // повідомлення про помилку
) => (text: string) => void;

export const handleChange: HandleChange =
  (setter, key, validator, setError, errorKey, errorMessage) =>
  (text: string) => {
    const trimmedText = text.trim();

    setter(prevState => ({
      ...prevState,
      [key]: trimmedText,
    }));

    if (!validator(trimmedText)) {
      setError(prevState => ({
        ...prevState,
        [errorKey]: errorMessage,
      }));
    } else {
      setError(prevState => ({
        ...prevState,
        [errorKey]: '',
      }));
    }
  };
