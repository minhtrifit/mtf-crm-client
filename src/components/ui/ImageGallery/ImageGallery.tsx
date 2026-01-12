/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

type PropType = {
  color?: string;
  images: string[];
};

const ImageGallery = (props: PropType) => {
  const { color = '#ccc', images } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  if (!images?.length) return null;

  return (
    <div className='flex flex-col gap-3'>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images?.map((src) => ({ src }))}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
        }}
        on={{
          view: ({ index }) => {
            setIndex(index);
          },
        }}
      />

      <div className='w-full aspect-square rounded-lg overflow-hidden border border-solid border-[#ccc] group'>
        <img
          src={images[index]}
          alt='product'
          className='w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-out
                      group-hover:scale-110'
          onClick={() => setOpen(true)}
        />
      </div>

      {images?.length > 1 && (
        <div className='grid grid-cols-4 gap-2'>
          {images?.map((img: string, i: number) => (
            <div
              key={i}
              style={{
                border: `${i === index ? `2px solid ${color}` : '1px solid #ccc'}`,
              }}
              className={'aspect-square rounded overflow-hidden cursor-pointer border border-solid'}
              onClick={() => {
                setIndex(i);
              }}
            >
              <img
                src={img}
                alt={`product-${i}`}
                className='w-full h-full object-cover hover:scale-105 transition'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
