import Slider from 'react-slick';
import cn from 'classnames';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { useCouponShowcase } from '@/pages/coupon/hooks/useCouponShowcase';
import CouponCard from './CouponCard';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const NextArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 outline-none border-none
                bg-white-900 hover:bg-white-700 text-[#000] hover:cursor-pointer
                p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleRight size={18} className='text-zinc-500' />
  </button>
);

const PrevArrow = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className='absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 outline-none border-none
               bg-white-900 hover:bg-white-700 text-[#000] hover:cursor-pointer
               p-1 md:p-2 rounded-full flex items-center justify-center'
  >
    <FaAngleLeft size={18} className='text-zinc-500' />
  </button>
);

const CouponSlide = () => {
  const isMobile = useIsMobile();
  const screenWidth = useScreenWidth();
  const { data } = useCouponShowcase();

  const getSlidesToShow = (width: number) => {
    if (width < 1024) return 2;
    return 3;
  };

  const slidesToShow = isMobile ? 2 : getSlidesToShow(screenWidth);

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    draggable: false,
    swipe: false,
    touchMove: false,
    customPaging: () => (
      <div className='w-3 h-3 rounded-full bg-zinc-300 hover:bg-white transition' />
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (data.length === 0) return null;

  const coupons = data.map((item) => (
    <div key={item.id} className={cn(isMobile ? 'px-1' : 'px-2')}>
      <CouponCard data={item} />
    </div>
  ));

  if (data.length < slidesToShow) {
    return (
      <div
        className='grid w-full'
        style={{ gridTemplateColumns: `repeat(${slidesToShow}, minmax(0, 1fr))` }}
      >
        {coupons}
      </div>
    );
  }

  return <Slider {...settings}>{coupons}</Slider>;
};

export default CouponSlide;
