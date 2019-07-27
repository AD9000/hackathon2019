import { useState, useEffect } from "react";

export const useDefaultValue = <TValue>(value: TValue): TValue => {
  const [defaultValue, setDefaultValue] = useState();

  useEffect(() => {
    if (defaultValue === undefined && value !== undefined) {
      setDefaultValue(value);
    }
  }, [defaultValue, value]);

  return defaultValue;
};
