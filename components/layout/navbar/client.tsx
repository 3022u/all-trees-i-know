'use client';

import CartModal from 'components/cart/modal';
import CollectionsDropdown from 'components/collections-dropdown';
import LanguageSwitcher from 'components/language-switcher';
import LogoSquare from 'components/logo-square';
import { useLanguage } from 'lib/i18n';
import Link from 'next/link';
import MobileMenu from './mobile-menu';

export function NavbarClient() {
  const { t } = useLanguage();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between pt-[2rem] pb-[.8rem] dt:!py-[2rem] px-[2rem] dt:px-[4rem] z-50">
        <div className="flex flex-row  gap-[1rem] dt:gap-[2rem] dtttt:gap-[4rem] w-full">
        <div className="flex shrink-0 ">
          <div className="dt:flex w-full items-center justify-center text-[6rem] leading-[100%]">
            <LogoSquare />
            <Link
              href="/"
              prefetch={true}
              className="uppercase font-medium tracking-normal hidden dttt:block"
            >
              All Trees I Know
            </Link>
          </div>
        </div>
        <div className="flex flex-1 flex-row justify-end items-end gap-[1.5rem] dt:gap-[2rem]  dtttt:gap-[4rem]">
          {/* Mobile collections dropdown */}
          <div className="dt:hidden">
            <CollectionsDropdown />
          </div>
          
          {/* Desktop shop link */}
          <Link href="/shop/all" prefetch={true} className='hidden dt:block text-[2.4rem] underline dt:no-underline leading-[2.4rem] dttt:text-[6rem] dttt:leading-[100%] font-medium tracking-normal uppercase'>
            {t('navigation.shop')}
          </Link>
        
          <div className='flex dttt:h-[5.5rem] flex-col justify-end relative dttt:mb-[.5rem]'>
            <CartModal /> 
          </div>
                    
          <div className='hidden dttt:block'>
            <LanguageSwitcher />
          </div>
          
          <div className='text-right hidden dttt:block'>
            <Link href="/about" prefetch={true} className='text-[6rem] leading-[100%] font-medium tracking-normal uppercase'>
              {t('navigation.about')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
    
    {/* Mobile Menu - rendered outside nav to avoid z-index issues */}
    <MobileMenu menu={[]} />
    </>
  );
}
