import { useEffect, useState } from "react";

const useLocalStorage = (key: string, initialValue: any, newValue?: any) => {
  const [value, setValue] = useState(() => {
    const keyValue = localStorage.getItem(key);
    return keyValue
      ? newValue
        ? newValue
        : JSON.parse(keyValue)
      : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
