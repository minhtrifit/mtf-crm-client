/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRef, useState } from 'react';
import Slider from 'react-slick';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

type PropType = {
  color?: string;
  images: string[];
};

const ImageGallery = (props: PropType) => {
  const { color = '#ccc', images } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const sliderRef = useRef<Slider | null>(null);

  if (!images?.length) return null;

  const handleImageChange = (nextIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(nextIndex, images.length - 1));
    setIndex(clampedIndex);
    sliderRef.current?.slickGoTo(clampedIndex);
  };

  const sliderSettings = {
    arrows: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 300,
    swipeToSlide: true,
    waitForAnimate: false,
  };

  const renderThumbnail = (img: string, i: number) => (
    <button
      type='button'
      aria-label={`View product image ${i + 1}`}
      aria-pressed={i === index}
      style={{
        border: `${i === index ? `2px solid ${color}` : '1px solid #ccc'}`,
      }}
      className='aspect-square w-full rounded overflow-hidden cursor-pointer border border-solid p-0'
      onClick={() => handleImageChange(i)}
    >
      <img
        src={img}
        alt={`product-${i}`}
        className='w-full h-full object-cover hover:scale-105 transition'
      />
    </button>
  );

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
            handleImageChange(index);
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

      {images.length > 1 && images.length <= 4 && (
        <div className='grid grid-cols-4 gap-2'>
          {images.map((img, i) => (
            <div key={i}>{renderThumbnail(img, i)}</div>
          ))}
        </div>
      )}

      {images.length > 4 && (
        <div className='relative flex items-center'>
          <button
            type='button'
            aria-label='Previous images'
            className='absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 outline-none border-none
               bg-white-900 hover:bg-white-700 text-[#000] hover:cursor-pointer
               p-1 md:p-2 rounded-full flex items-center justify-center'
            onClick={() => handleImageChange(index - 1)}
          >
            <FaAngleLeft size={10} className='text-zinc-500' />
          </button>
          <div className='min-w-0 flex-1'>
            <Slider ref={sliderRef} {...sliderSettings}>
              {images.map((img: string, i: number) => (
                <div key={i} className='px-1'>
                  {renderThumbnail(img, i)}
                </div>
              ))}
            </Slider>
          </div>
          <button
            type='button'
            aria-label='Next images'
            className='absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 outline-none border-none
                bg-white-900 hover:bg-white-700 text-[#000] hover:cursor-pointer
                p-1 md:p-2 rounded-full flex items-center justify-center'
            onClick={() => handleImageChange(index + 1)}
          >
            <FaAngleRight size={10} className='text-zinc-500' />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
