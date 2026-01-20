import { get } from 'lodash';
import Slider from 'react-slick';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { SectionType } from '@/types/website_template';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import { useNavigate } from 'react-router-dom';

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

interface PropType {
  section: SectionType;
}

const SectionSlide = (props: PropType) => {
  const { section } = props;

  const { config } = useAppConfig();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items = get(section, 'items', []);

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
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
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleViewAllProducts = () => {
    navigate(WEBSITE_ROUTE.PRODUCTS);
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='w-full flex flex-wrap items-center justify-between gap-5'>
        <h3 style={{ color: config?.websitePrimaryColor }} className='text-[1.5rem]'>
          {get(section, 'title', '')}
        </h3>

        <span
          style={{ color: config?.websitePrimaryColor }}
          className='text-[0.9rem] font-semibold hover:cursor-pointer hover:underline'
          onClick={handleViewAllProducts}
        >
          {t('view_all')}
        </span>
      </div>

      <div className={'w-full relative'}>
        <Slider {...settings}>
          {items?.map((item) => (
            <div key={get(item, 'id', '')} className='px-2'>
              <ProductCard product={get(item, 'product', null) as Product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SectionSlide;
