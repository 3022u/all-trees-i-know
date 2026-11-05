
'use client';

import { useLanguage } from 'lib/i18n';
import { useMobileMenu } from 'lib/mobile-menu-context';
import Link from 'next/link';

export default function LogoSquare() {
  const { t } = useLanguage();
  const { openMobileMenu, isOpen, closeMobileMenu } = useMobileMenu();
  
  const handleMenuClick = () => {
    console.log('Menu button clicked!');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };
  
  return (
    <Link
      href="/"
      prefetch={true}
      className="flex items-end flex-row dttt:hidden gap-[1.5rem]"
    >
      <svg className='w-[3.5rem] h-[3.5rem]' viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_353_285)">
<path fillRule="evenodd" clipRule="evenodd" d="M29.1529 15.2701C31.1052 13.1135 32.0274 11.0119 31.7512 8.86903C31.2737 5.12819 25.7915 5.27471 24.6492 15.6822C24.4385 17.6145 24.3823 19.7344 24.5274 21.8452C29.3121 19.826 31.3392 16.0851 31.3392 16.0851C31.3392 16.0851 30.5574 22.4634 25.122 26.0943C26.0068 30.1007 27.8093 33.5027 30.8664 34.6886L30.9647 34.8031C25.3093 35.5861 20.754 34.1666 19.2653 28.3196C17.7765 28.5577 16.1098 28.6264 14.2419 28.4753C13.5396 28.4203 12.8889 28.3287 12.2849 28.2051C11.3767 29.3818 10.1969 30.7188 9.23718 31.5339C5.81489 34.4276 1.81677 36.4652 -0.00439453 33.6721C2.49092 33.2005 5.28119 29.9496 7.79991 26.0943C3.23531 21.7994 7.48156 13.2372 12.5892 11.7765C12.5892 11.7765 8.2868 17.5549 10.9507 20.8608C11.7372 19.4688 12.5237 18.0449 13.3008 16.6254C15.9132 11.8773 18.4694 7.22526 20.9085 4.37269C28.0949 -4.011 38.0246 0.728006 34.1201 9.60621C33.0434 12.0604 31.1567 14.4643 29.1529 15.2701ZM19.8879 14.4597C18.3243 17.8251 16.9432 20.6227 15.651 22.9533C16.1332 23.0174 16.6482 23.0586 17.21 23.0815C17.7437 23.1044 18.2587 23.1044 18.7596 23.0861C18.8065 20.6639 19.167 17.8068 19.8879 14.4551V14.4597Z" fill="#010101"/>
</g>
<defs>
<clipPath id="clip0_353_285">
<rect width="35" height="35" fill="white"/>
</clipPath>
</defs>
</svg>
<button onClick={handleMenuClick} className="text-[2.4rem] underline uppercase leading-[2.4rem]">
  {isOpen ? t('navigation.closeMenu') : t('navigation.menu')}
</button>
</Link>
  );
}
