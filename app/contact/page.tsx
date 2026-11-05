import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stockists',
  description: 'Find All Trees I Know stockists and retailers.'
};

export default async function Contact() {


    return (
      <div className='min-h-[100dvh] flex flex-col justify-center pt-[12rem]'>
      <div className="dt:px-[2rem] w-full dt:w-[50%] mx-auto flex flex-col dt:flex-row gap-[2rem]">
        <div className='px-[2rem] dt:px-0 flex flex-col justify-between h-full w-full mb-[1.6rem] dt:mb-0'>
        <h1 className="text-[2.4rem] leading-[2.4rem] dt:text-[3.2rem] dt:leading-[3.2rem] font-medium pb-[2.4rem] dt:pb-[3.2rem] uppercase">
          If you have any questions or collaboration request, please send us a letter
        </h1>
          <a 
            href="mailto:contact@alltreesiknow.com"
            className="underline hover:no-underline !block mt-auto font-bold text-[1.3rem] leading-[1.4rem] text-[1.8rem] dt:leading-[1.9rem]" 
         
          >
            contact@alltreesiknow.com
            </a>
            </div>
            <div className='dt:grid grid-cols-2 gap-[2rem] w-full'>
        <div className='hidden dt:block'>
            </div>
            <img className='w-full h-auto' src="https://cdn.shopify.com/s/files/1/0684/3439/5302/files/image_58.png?v=1759958813&format=webp" />
            </div>
      </div>
      </div>
    );
}