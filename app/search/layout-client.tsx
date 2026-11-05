'use client';

import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';
import { useLanguage } from 'lib/i18n';
import { Suspense } from 'react';
import ChildrenWrapper from './children-wrapper';

export function SearchLayoutClient({
  children
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 text-black md:flex-row ">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <Collections />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title={t('filter.sortBy')} />
        </div>
      </div>
    </>
  );
}
