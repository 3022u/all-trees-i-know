'use client';

import { getCollectionsAction } from 'lib/actions/collections';
import { useLanguage } from 'lib/i18n';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Collection {
  handle: string;
  title: string;
  path: string;
}

export default function CollectionsDropdown() {
  const { t, locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Get current active collection from pathname
  const getCurrentCollection = () => {
    if (pathname.startsWith('/shop/')) {
      const handle = pathname.split('/shop/')[1]?.split('/')[0];
      if (handle && handle !== 'all') {
        return handle;
      }
    }
    return 'all'; // Default to 'all' if no specific collection or on /shop/all
  };

  const currentCollection = getCurrentCollection();

  // Get display text for current collection
  const getCurrentCollectionText = () => {
    // If not on a shop page, show "Shop"
    if (!pathname.startsWith('/shop/')) {
      return t('navigation.shop');
    }
    
    if (currentCollection === 'all') {
      return t('collections.all');
    }
    return t(`collections.${currentCollection}` as any) || currentCollection;
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const collectionsData = await getCollectionsAction(locale);
      setCollections(collectionsData);
    };

    fetchCollections();
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Check if we're on a shop page
  const isOnShopPage = pathname.startsWith('/shop/');

  return (
    <div className="relative" ref={ref}>
      {!isOnShopPage ? (
        // If not on shop page, show "Shop" as a simple link
        <Link
          href="/shop/all"
          prefetch={true}
          className="text-[2.4rem] leading-[2.4rem] font-medium tracking-normal uppercase underline text-black transition-colors"
        >
          {t('navigation.shop')}
        </Link>
      ) : (
        // If on shop page, show dropdown
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[2.4rem] leading-[2.4rem] font-medium tracking-normal uppercase underline text-black transition-colors"
            aria-label="Select collection"
          >
            {getCurrentCollectionText()}
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 z-50">
              {/* Show All collection link only if not currently on All */}
              {currentCollection !== 'all' && (
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className='text-[1.8rem] mt-[1rem] leading-[3.2rem] font-medium tracking-normal uppercase text-black transition-colors block' 
                  href='/shop/all' 
                  prefetch={true}
                >
                  {t('collections.all')}
                </Link>
              )}
              
              {/* Show Incense collection link only if not currently on Incense */}
              {currentCollection !== 'incense' && (
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className='text-[1.8rem] mt-[.5rem] leading-[3.2rem] font-medium tracking-normal uppercase text-black transition-colors block' 
                  href='/shop/incense' 
                  prefetch={true}
                >
                  {t('collections.incense')}
                </Link>
              )}
              
              {/* Show Holders collection link only if not currently on Holders */}
              {currentCollection !== 'holders' && (
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className='text-[1.8rem] mt-[.5rem] leading-[3.2rem] font-medium tracking-normal uppercase text-black transition-colors block' 
                  href='/shop/holders' 
                  prefetch={true}
                >
                  {t('collections.holders')}
                </Link>
              )}
              
              {/* Show Accessories collection link only if not currently on Accessories */}
              {currentCollection !== 'accessories' && (
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className='text-[1.8rem] mt-[.5rem] leading-[3.2rem] font-medium tracking-normal uppercase text-black transition-colors block' 
                  href='/shop/accessories' 
                  prefetch={true}
                >
                  {t('collections.accessories')}
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
