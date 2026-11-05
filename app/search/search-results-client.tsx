'use client';

import { useLanguage } from 'lib/i18n';

interface SearchResultsProps {
  searchValue: string;
  productsLength: number;
}

export function SearchResultsClient({ searchValue, productsLength }: SearchResultsProps) {
  const { t } = useLanguage();
  
  if (!searchValue) return null;
  
  const resultsText = productsLength > 1 ? t('search.results') : t('search.result');

  return (
    <p className="mb-4">
      {productsLength === 0
        ? `${t('search.noProducts')} `
        : `${t('search.showing')} ${productsLength} ${resultsText} ${t('search.for')} `}
      <span className="">&quot;{searchValue}&quot;</span>
    </p>
  );
}
