import { get } from 'lodash';
import Slider from 'react-slick';
import { useFormContext } from 'react-hook-form';
import { SectionItemType, SectionType } from '@/types/website_template';
import { formatCurrency } from '@/+core/helpers';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

interface PropType {
  primaryColor: string;
  logoUrl: string;
}

const NextArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 outline-none border-none
                bg-white-700 hover:bg-white-800 text-[#000] hover:cursor-pointer
                p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleRight size={10} className='text-zinc-500' />
  </button>
);

const PrevArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 outline-none border-none
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
  const bannersUrl = watch('bannersUrl');
  const email = watch('email');
  const phone = watch('phone');
  const footerDescription = watch('footerDescription');

  const bannerSlideSettings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: false,
    customPaging: () => (
      <div className='w-2 h-2 rounded-full bg-zinc-300 hover:bg-white transition' />
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const productSlideSettings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: false,
    customPaging: () => (
      <div className='w-2 h-2 rounded-full bg-zinc-300 hover:bg-white transition' />
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className='relative flex flex-col gap-5 bg-[#f5f5fa] border-[1px] border-solid border-[#e5e7eb] rounded-sm'>
      <header
        style={{ background: primaryColor }}
        className='absolute w-full top-0 p-2 rounded-t-sm'
      >
        <div className='w-full max-w-[90%] mx-auto flex items-center justify-between gap-5'>
          {logoUrl ? (
            <img src={logoUrl} className='h-[20px]' />
          ) : (
            <div className='w-[20px] h-[20px] bg-[#FFF] rounded-sm' />
          )}

          <div className='w-[120px] h-[20px] bg-[#FFF] rounded-sm' />

          <div className='w-[50px] h-[20px] bg-[#FFF] rounded-sm' />
        </div>
      </header>

      <div className='mt-[50px] max-h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-5'>
        <section className='w-full max-w-[90%] mx-auto flex gap-3'>
          {bannersUrl?.length === 0 ? (
            <>
              <div className='w-[20%] h-[100px] bg-zinc-200 rounded-md' />
              <div className='w-[80%] h-[100px] bg-zinc-200 rounded-md' />
            </>
          ) : (
            <>
              <div className='w-[20%] h-auto bg-zinc-200 rounded-md' />
              <div className={'w-[80%] relative'}>
                <Slider {...bannerSlideSettings}>
                  {bannersUrl?.map((url: string, index: number) => (
                    <div key={`banner-${index}`}>
                      <img src={url} className='w-full rounded-md' alt='' />
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          )}
        </section>

        {sections?.length === 0 ? (
          <>
            <section className='w-full max-w-[90%] mx-auto flex flex-col gap-3'>
              <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />

              <div className='grid grid-cols-4 gap-3'>
                <div className='h-[80px] bg-zinc-200 rounded-md' />
                <div className='h-[80px] bg-zinc-200 rounded-md' />
                <div className='h-[80px] bg-zinc-200 rounded-md' />
                <div className='h-[80px] bg-zinc-200 rounded-md' />
              </div>
            </section>

            <section className='w-full max-w-[90%] mx-auto flex flex-col gap-3'>
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
                className='w-full max-w-[90%] mx-auto flex flex-col gap-3'
              >
                {get(section, 'title', '') ? (
                  <h3 style={{ color: primaryColor }} className='text-[0.8rem]'>
                    {get(section, 'title', '')}
                  </h3>
                ) : (
                  <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />
                )}

                <div className={'w-full relative'}>
                  <Slider {...productSlideSettings}>
                    {section?.items?.map((item: SectionItemType) => (
                      <div key={get(item, 'id', '')} className='px-1'>
                        <div
                          className='flex flex-col rounded-md mb-1'
                          style={{
                            borderTop: '1px solid #f5f5f5',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          }}
                        >
                          <img
                            src={get(item, 'product.imagesUrl[0]', '')}
                            className='w-full rounded-t-md'
                          />

                          <div className='w-full p-2 rounded-b-md flex flex-col gap-2'>
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
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            );
          })
        )}

        <footer
          style={{ background: primaryColor }}
          className='flex flex-col gap-5 px-2 py-6 rounded-b-sm text-[#FFF] text-[0.8rem]'
        >
          <div className='w-full max-w-[90%] min-h-[80px] mx-auto flex gap-5'>
            {logoUrl ? (
              <div className='flex flex-col items-start gap-3'>
                <img className='w-auto h-[20px]' src={logoUrl} />

                {phone && (
                  <div className='flex items-center gap-2'>
                    <FaPhone size={15} />
                    <span className='font-semibold'>{phone}</span>
                  </div>
                )}

                {email && (
                  <div className='flex items-center gap-2'>
                    <MdEmail size={15} />
                    <span className='font-semibold'>{email}</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className='w-[60px] h-[80px] bg-[#FFF] rounded-md' />
                <div className='w-[60px] h-[60px] bg-[#FFF] rounded-md' />
                <div className='w-[60px] h-[50px] bg-[#FFF] rounded-md' />
              </>
            )}
          </div>

          {footerDescription ? (
            <span className='mx-auto text-[0.7rem]'>{footerDescription}</span>
          ) : (
            <div className='w-full flex flex-col gap-3 items-center'>
              <div className='w-[80%] h-[10px] bg-[#FFF] rounded-md' />
              <div className='w-[50%] h-[10px] bg-[#FFF] rounded-md' />
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default PreviewForm;
