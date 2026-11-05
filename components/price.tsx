
'use client';

import { useLanguage } from 'lib/i18n/context';

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  hideCurrency = false,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  hideCurrency?: boolean;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => {
  const { locale } = useLanguage();
  
  // Custom currency display for Ukrainian
  const getCurrencyDisplay = () => {
    if (hideCurrency) {
      return new Intl.NumberFormat("uk-UA", {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(parseFloat(amount));
    }
    
    const formattedAmount = new Intl.NumberFormat("uk-UA", {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
    
    // Show "грн" for Ukrainian locale, otherwise show currency code
    const displayCurrency = locale === 'ua' && currencyCode === 'UAH' ? 'грн' : currencyCode;
    
    return `${formattedAmount} ${displayCurrency}`;
  };

  return (
    <p suppressHydrationWarning={true} className={className}>
      {getCurrencyDisplay()}
    </p>
  );
};

export default Price;
