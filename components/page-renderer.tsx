import CollectionBlock from 'components/blocks/CollectionBlock';
import ImagesBlock from 'components/blocks/ImagesBlock';
import ImageTextBlock from 'components/blocks/ImageTextBlock';
import SlideshowBlock from 'components/blocks/SlideshowBlock';
import TextBlock from 'components/blocks/TextBlock';
import TitleRowBlock from 'components/blocks/TitleRowBlock';

export default function PageRenderer({ page }: { page: any }) {
  const blockMetaobject = page?.blocks?.reference;
  const blocks = blockMetaobject?.blocks?.references?.nodes || [];
  console.log('PageRenderer blocks:', blocks[2]);

  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-[2rem] dt:gap-[5rem] w-full">
      {blocks.map((block: any, index: number) => {
        const key = block.id || `${block.type}-${index}`;

        switch (block.type) {
          case 'text':
            return <TextBlock key={key} {...block} />;
          case 'title_row':
            return <TitleRowBlock key={key} {...block} />;
          case 'slideshow':
            return <SlideshowBlock key={key} {...block} />;
          case 'image_text':
            return <ImageTextBlock key={key} {...block} />;
          case 'images':
            return <ImagesBlock key={key} {...block} />;
          case 'collection':
            return <CollectionBlock key={key} collection={block.collection} images={block.collectionImages} />;
          default:
            return (
              <div key={key} className="text-red-500">
                {/* Unknown block type: {block.type} */}
              </div>
            );
        }
      })}
    </div>
  );
} 