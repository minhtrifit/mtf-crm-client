import { get } from 'lodash';
import Slider from 'react-slick';
import { useFormContext } from 'react-hook-form';
import { SectionItemType, SectionType } from '@/types/website_template';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import styles from './styles.module.scss';
import { formatCurrency } from '@/+core/helpers';

interface PropType {
  primaryColor: string;
  logoUrl: string;
}

const NextArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute right-0 top-1/2 -translate-y-1/2 z-10 outline-none border-none
                bg-white-700 hover:bg-white-800 text-[#000] hover:cursor-pointer
                p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleRight size={10} className='text-zinc-500' />
  </button>
);

const PrevArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute left-0 top-1/2 -translate-y-1/2 z-10 outline-none border-none
               bg-white-700 hover:bg-white-800 text-[#000] hover:cursor-pointer
               p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleLeft size={10} className='text-zinc-500' />
  </button>
);

const PreviewForm = (props: PropType) => {
  const { primaryColor, logoUrl } = props;

  const { watch } = useFormContext();

  const sections = watch('sections');

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: false,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className='flex justify-center gap-3'>{dots}</ul>
      </div>
    ),

    customPaging: () => (
      <div className='w-2 h-2 rounded-full bg-zinc-300 hover:bg-white transition' />
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className='sticky top-[100px] self-start flex flex-col gap-5 bg-[#FFF] rounded-sm'>
      <header style={{ background: primaryColor }} className='p-2 rounded-t-sm'>
        <div className='w-full max-w-[80%] mx-auto flex items-center justify-between gap-5'>
          {logoUrl ? (
            <img src={logoUrl} className='h-[20px]' />
          ) : (
            <div className='w-[20px] h-[20px] bg-[#FFF] rounded-sm' />
          )}

          <div className='w-[120px] h-[20px] bg-[#FFF] rounded-sm' />

          <div className='w-[50px] h-[20px] bg-[#FFF] rounded-sm' />
        </div>
      </header>

      <section className='w-full max-w-[80%] mx-auto flex gap-3'>
        <div className='w-[20%] h-[100px] bg-zinc-200 rounded-md' />
        <div className='w-[80%] h-[100px] bg-zinc-200 rounded-md' />
      </section>

      {sections?.length === 0 ? (
        <>
          <section className='w-full max-w-[80%] mx-auto flex flex-col gap-3'>
            <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />

            <div className='grid grid-cols-4 gap-3'>
              <div className='h-[80px] bg-zinc-200 rounded-md' />
              <div className='h-[80px] bg-zinc-200 rounded-md' />
              <div className='h-[80px] bg-zinc-200 rounded-md' />
              <div className='h-[80px] bg-zinc-200 rounded-md' />
            </div>
          </section>

          <section className='w-full max-w-[80%] mx-auto flex flex-col gap-3'>
            <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />

            <div className='grid grid-cols-4 gap-3'>
              <div className='h-[80px] bg-zinc-200 rounded-md' />
              <div className='h-[80px] bg-zinc-200 rounded-md' />
              <div className='h-[80px] bg-zinc-200 rounded-md' />
              <div className='h-[80px] bg-zinc-200 rounded-md' />
            </div>
          </section>
        </>
      ) : (
        sections?.map((section: SectionType) => {
          return (
            <section
              key={get(section, 'id', '')}
              className='w-full max-w-[80%] mx-auto flex flex-col gap-3'
            >
              {get(section, 'title', '') ? (
                <h3 style={{ color: primaryColor }} className='text-[0.8rem]'>
                  {get(section, 'title', '')}
                </h3>
              ) : (
                <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />
              )}

              <div className={`${styles.wrapper} w-full relative`}>
                <Slider {...settings}>
                  {section?.items?.map((item: SectionItemType) => (
                    <div key={get(item, 'id', '')} className='px-1'>
                      <div className='flex flex-col gap-3 mb-1 rounded-md p-2 shadow-md'>
                        <img
                          src={get(item, 'product.imagesUrl[0]', '')}
                          className='w-full rounded-md'
                        />

                        <span className='min-h-[20px] text-[0.5rem] line-clamp-2'>
                          {get(item, 'product.name', '')}
                        </span>

                        <span
                          style={{ color: primaryColor }}
                          className='text-[0.55rem] font-semibold'
                        >
                          {formatCurrency(get(item, 'product.price', 0))}
                        </span>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </section>
          );
        })
      )}

      <footer style={{ background: primaryColor }} className='flex flex-col gap-3 p-2 rounded-b-sm'>
        <div className='w-full max-w-[80%] mx-auto grid grid-cols-5 gap-3'>
          <div className='h-[80px] bg-[#FFF] rounded-md' />
          <div className='h-[60px] bg-[#FFF] rounded-md' />
          <div className='h-[50px] bg-[#FFF] rounded-md' />
        </div>

        <div className='w-full flex flex-col gap-3 items-center'>
          <div className='w-[80%] h-[10px] bg-[#FFF] rounded-md' />
          <div className='w-[50%] h-[10px] bg-[#FFF] rounded-md' />
        </div>
      </footer>
    </div>
  );
};

export default PreviewForm;
