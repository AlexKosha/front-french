import {Dispatch, SetStateAction} from 'react';

// Узагальнена функція для обробки полів форми
type HandleChange = <
  T extends Record<string, any>,
  E extends Record<string, string>,
>(
  setter: Dispatch<SetStateAction<T>>, // Стан для форми
  key: keyof T, // Ключ у формі
  validator: (text: string) => boolean, // Функція для перевірки значення
  setError: Dispatch<SetStateAction<E>>, // Setter для помилок
  errorKey: keyof E, // Ключ для помилки
  errorMessage: string, // Повідомлення про помилку
) => (text: string) => void;

export const handleChange: HandleChange =
  (setter, key, validator, setError, errorKey, errorMessage) =>
  (text: string) => {
    const trimmedText = text.trim();

    setter(prevState => ({
      ...prevState,
      [key]: trimmedText,
    }));

    setError(prevState => ({
      ...prevState,
      [errorKey]: validator(trimmedText) ? '' : errorMessage,
    }));
  };
