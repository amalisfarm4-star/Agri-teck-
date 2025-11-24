"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Language } from '../types';
import it from '../locales/it.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const dictionaries = { it, en, es };

interface AppContextType {
  role: UserRole;
  language: Language;
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  t: any; // Dictionary type
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [dictionary, setDictionary] = useState(dictionaries[Language.EN]);

  useEffect(() => {
    setDictionary(dictionaries[language]);
  }, [language]);

  return (
    <AppContext.Provider value={{ role, language, setRole, setLanguage, t: dictionary }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}