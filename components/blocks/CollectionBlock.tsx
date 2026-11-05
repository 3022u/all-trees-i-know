import Link from "next/link";

export default function CollectionBlock({ collection, images }: { collection: any, images: any }) {
  console.log('CollectionBlock render', collection);
  console.log('CollectionBlock images', images);
  const ref = collection?.reference;
  if (!ref) return null;
  const imageList = images?.references?.nodes || [];
  console.log('CollectionBlock imageList', imageList);

  return (
    <div className={`px-0 dt:px-[4rem] flex flex-col dt:grid grid-cols-8 gap-x-[2rem] mb-[2rem] dt:mb-[4rem]`}>
      <h2 className="order-1 px-[2rem] dt:px-0 text-[2.4rem] dt:text-[4rem] dt:leading-[4rem] dtt:text-[6rem] leading-[2.4rem] dtt:leading-[6rem] col-span-3 col-start-5 block w-[2/3] mb-[1rem] dt:mb-[4rem] w-max">{ref.title}</h2>
      <div className={`col-span-3 col-start-2 w-full order-3 dt:order-2 mb-[1rem]`}>
        <img src={ref?.image?.url} alt={ref?.image?.altText || ''} className="w-full h-auto " />
      </div>
      <div className={`order-2 dt:order-3 col-span-3 w-full flex h-full flex-col justify-end items-start gap-[1rem] px-[2rem] dt:px-0`}>
        <p className="whitespace-pre-wrap dt:w-[66.6%] text-[1.3rem] leading-[1.3rem] dt:text-[1.8rem] dt:leading-[1.8rem]">{ref.description}</p>
     <Link href={`/collections/${ref.handle}`} className="w-fit underline hover:no-underline text-[1.3rem] leading-[1.3rem] dt:text-[1.8rem] dt:leading-[1.8rem] mb-[2rem] dt:mb-0">
  View
 </Link>
      </div>
       {
        imageList.length > 0 && (
          <div className="order-4 col-span-6 grid grid-cols-6 col-start-2 mt-[1rem] dt:mt-[4rem] gap-[1rem] dt:gap-[2rem] px-[2rem] dt:px-0">
            {imageList.map((imageNode: any, index: number) => (
              <img 
                key={`${imageNode.image?.url}-${index}`} 
                src={imageNode.image?.url} 
                alt={imageNode.image?.altText || ''} 
                className={`w-full mt-auto h-auto ${index === 0 ? 'col-span-2' : (index === 1 ? 'col-span-2' : 'col-span-2')}`} 
              />
            ))}
          </div>
        )
      }
    </div>
  );
} 