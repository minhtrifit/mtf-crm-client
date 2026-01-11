import Slider from 'react-slick';
import { useIsMobile } from '@/hooks/useIsMobile';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
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

  const data = [
    {
      id: '1',
      url: 'assets/banners/sale_1.png',
    },
    {
      id: '2',
      url: 'assets/banners/sale_2.jpg',
    },
    {
      id: '3',
      url: 'assets/banners/sale_3.png',
    },
  ];

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

  return (
    <div className={`${styles.wrapper} w-full relative`}>
      <Slider {...settings}>
        {data.map((item) => (
          <div key={item.id}>
            <img src={item.url} className='w-full rounded-md' alt='' />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlide;
