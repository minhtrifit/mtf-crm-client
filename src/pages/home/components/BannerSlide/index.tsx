import { get } from 'lodash';
import Slider from 'react-slick';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';

import styles from './styles.module.scss';

const NextArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute right-4 top-1/2 -translate-y-1/2 z-10 outline-none border-none
                bg-white-900 hover:bg-white-700 text-[#000] hover:cursor-pointer
                p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleRight size={18} className='text-zinc-500' />
  </button>
);

const PrevArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute left-4 top-1/2 -translate-y-1/2 z-10 outline-none border-none
               bg-white-900 hover:bg-white-700 text-[#000] hover:cursor-pointer
               p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleLeft size={18} className='text-zinc-500' />
  </button>
);

const BannerSlide = () => {
  const isMobile = useIsMobile(1024);

  const { config } = useAppConfig();

  const banners = get(config, 'banners', []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className='flex justify-center gap-3'>{dots}</ul>
      </div>
    ),

    customPaging: () => (
      <div className='w-3 h-3 rounded-full bg-zinc-300 hover:bg-white transition' />
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // return <div className='w-full h-full bg-[#efefef] rounded-md' />;

  if (banners?.length === 0) {
    return (
      <div
        style={{ background: config?.websitePrimaryColor }}
        className='w-full h-[200px] md:h-[365px] text-[#FFF] rounded-md flex items-center justify-center'
      >
        <FiShoppingBag size={40} />
      </div>
    );
  }

  return (
    <div className={`${styles.banner__slide__wrapper} w-full relative`}>
      <Slider {...settings}>
        {banners?.map((url: string, index: number) => (
          <div key={`homepage-banner-${index}`}>
            <img
              src={url}
              style={{ minHeight: isMobile ? 'auto' : '365px' }}
              className='w-full rounded-md'
              alt={`homepage-banner-${index}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlide;
