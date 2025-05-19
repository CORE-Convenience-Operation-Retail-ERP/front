import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadingManager } from './LoadingManager';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (v: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadingManager.register(setIsLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}; 