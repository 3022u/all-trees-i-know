'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface MobileMenuContextType {
  isOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const openMobileMenu = () => {
    console.log('Opening mobile menu...');
    setIsOpen(true);
  };
  
  const closeMobileMenu = () => {
    console.log('Closing mobile menu...');
    setIsOpen(false);
  };

  console.log('Mobile menu state:', isOpen);

  return (
    <MobileMenuContext.Provider value={{ isOpen, openMobileMenu, closeMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
}
