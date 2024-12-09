import { useState, useEffect } from 'react';

const getLocalStorage = () => {
  try {
    return window?.localStorage;
  } catch {
    return null;
  }
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const storage = getLocalStorage();
      if (!storage) return initialValue;
      
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const storage = getLocalStorage();
      if (!storage) return;
      
      storage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}