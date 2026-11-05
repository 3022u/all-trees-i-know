'use client';

import clsx from 'clsx';
import { localeDisplayNames, locales, useLanguage } from 'lib/i18n';
import { useEffect, useRef, useState } from 'react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[2.4rem] dttt:mb-[.5rem] leading-[2.4rem] dt:leading-auto dt:text-auto relative flex underline dt:no-underline dt:normal-case text-black transition-colors"
        aria-label="Select language"
      >
        {localeDisplayNames[locale]}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 z-50">
          {locales.map((loc) => (
            locale !== loc && (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setIsOpen(false);
              }}
              className={clsx(
                'text-[2.4rem] mt-[2rem] leading-[2.4rem] dt:leading-auto dt:text-auto relative flex underline dt:no-underline dt:normal-case text-black transition-colors'
              )}
            >
              {localeDisplayNames[loc]}
            </button>
          )))}
        </div>
      )}
    </div>
  );
}
