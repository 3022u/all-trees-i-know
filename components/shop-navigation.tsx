'use client';

import { useLanguage } from 'lib/i18n';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ShopNavigation() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Get current active collection from pathname
  const getCurrentCollection = () => {
    if (pathname.startsWith('/shop/')) {
      const handle = pathname.split('/shop/')[1]?.split('/')[0];
      return handle || 'all';
    }
    return 'all';
  };

  const currentCollection = getCurrentCollection();

  return (
    <div className='hidden fixed top-[8rem] dt:top-[12rem] left-0 text-[1.8rem] px-[2rem] dt:px-[4rem] z-10 dttt:flex gap-[3rem]'>
      <Link 
        href='/shop/all' 
        prefetch={true}
        className={currentCollection === 'all' ? 'underline' : ''}
      >
        {t('collections.all')}
      </Link>
      <Link 
        href='/shop/incense' 
        prefetch={true}
        className={currentCollection === 'incense' ? 'underline' : ''}
      >
        {t('collections.incense')}
      </Link>
      <Link 
        href='/shop/holders' 
        prefetch={true}
        className={currentCollection === 'holders' ? 'underline' : ''}
      >
        {t('collections.holders')}
      </Link>
      {/* <Link 
        href='/shop/accessories' 
        prefetch={true}
        className={currentCollection === 'accessories' ? 'underline' : ''}
      >
        {t('collections.accessories')}
      </Link> */}
    </div>
  );
}
