import { useEffect, useState } from "react";

const setDefaultValue = (key: string, defaultValue: any) => {
  const dataStored = sessionStorage.getItem(key);
  if (dataStored !== undefined && dataStored !== null) {
    return JSON.parse(dataStored);
  } else {
    return defaultValue;
  }
};

const useSessionStorage = (key: string, defaultValue: any = undefined) => {
  const [value, setValue] = useState<any>(() => setDefaultValue(key, defaultValue));

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useSessionStorage;
