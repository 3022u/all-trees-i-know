'use client';

import { useLanguage } from 'lib/i18n';

export default function OpenCart({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  const { t } = useLanguage();
  
  return (
    <div className="text-[2.4rem] leading-[2.4rem] dttt:leading-auto dttt:text-auto relative flex underline dttt:no-underline uppercase dttt:normal-case text-black transition-colors font-normal dttt:font-bold">
      {t('cart.bag')}

      {quantity ? 
          ` (${quantity})`
       : ''}
    </div>
  );
}
