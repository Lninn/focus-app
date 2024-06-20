import React from "react";

export default function useLocalState(key: string, initialValue?: any) {
  const [value, setValue] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null') ?? initialValue;
    } catch (e) {
      console.error('Error parsing localStorage value', e);
      return initialValue;
    }
  });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
