import React, { createContext, useContext, ReactNode } from 'react';
import { useFlashcards } from '@hooks/useFlashcards';

interface AppContextType {
  flashcards: ReturnType<typeof useFlashcards>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const flashcards = useFlashcards();

  return <AppContext.Provider value={{ flashcards }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
