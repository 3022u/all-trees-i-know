import { getLocalizedShopifyApi } from 'lib/shopify/server-localized-api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stockists',
  description: 'Find All Trees I Know stockists and retailers.'
};

export default async function Stockists() {
  try {
    const shopify = await getLocalizedShopifyApi();
    const stockistsPage = await shopify.getPage('stockists');

    console.log('Stockists page received:', stockistsPage);

    if (!stockistsPage) {
      return (
        <div className="px-[2rem] w-full dt:w-[50%] mx-auto pt-[8rem] dt:pt-[32rem]">
          <h1 className="text-[3.2rem] font-medium pb-[3.2rem] uppercase">
            Stockists
          </h1>
        </div>
      );
    }

    return (
      <div className='min-h-[100dvh] flex flex-col justify-center pt-[12rem]'>
      <div className="px-[2rem] w-full dt:w-[50%] mx-auto flex flex-col dt:flex-row gap-[2rem]">
        <h1 className="text-[2.4rem] leading-[2.4rem] dt:text-[3.2rem] dt:leading-[3.2rem] font-medium pb-[2.4rem] dt:pb-[3.2rem] uppercase">
          Stores and studios<br />
you can find our products:
        </h1>
        {stockistsPage.body && (
          <div 
            id="stockists-page-body"
            className="font-bold text-[700] text-[1.3rem] leading-[1.4rem] text-[1.8rem] dt:leading-[1.9rem] dt:pt-[8rem]" 
            dangerouslySetInnerHTML={{ __html: stockistsPage.body }}
          />
        )}
      </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading stockists page:', error);
    return (
      <div className="px-[2rem] w-full dt:w-[50%] mx-auto pt-[8rem] dt:pt-[32rem]">
        <h1 className="text-[3.2rem] font-medium pb-[3.2rem] uppercase">
          Stockists
        </h1>
      </div>
    );
  }
}