import { get } from 'lodash';
import Slider from 'react-slick';
import { Avatar, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useNavigate } from 'react-router-dom';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { useIsMobile } from '@/hooks/useIsMobile';
import { CommentType } from '@/types/product';
import { FaQuoteLeft, FaUser } from 'react-icons/fa';
import styles from './styles.module.scss';

interface PropType {
  data: CommentType[];
}

const ReviewSlide = (props: PropType) => {
  const { data } = props;

  const { config } = useAppConfig();
  const { t } = useTranslation();
  const screenWidth = useScreenWidth();
  const isMobile = useIsMobile(1024);
  const navigate = useNavigate();

  const getSlidesToShow = (width: number) => {
    if (width < 1024) return 1;

    return 3;
  };

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : getSlidesToShow(screenWidth),
    slidesToScroll: isMobile ? 1 : 3,
    autoplay: true,
    autoplaySpeed: 5000,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul
          style={{
            ['--primary-color' as any]: config?.websitePrimaryColor,
          }}
          className='flex justify-center gap-3'
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className='w-3 h-3 rounded-full bg-zinc-300 hover:bg-white transition' />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleNavigateProduct = (slug: string) => {
    navigate(`/san-pham/${slug}`);
  };

  if (data?.length === 0) return null;

  return (
    <div className='w-full my-[50px] md:my-[100px] flex flex-col gap-10'>
      <h3 className='text-[1.2rem] md:text-[1.5rem] text-center'>{t('review.customer_review')}</h3>

      <div className={`${styles.review__slide__wrapper} w-full relative pb-10`}>
        <Slider {...settings}>
          {data?.map((item) => (
            <div key={get(item, 'id', '')} className='px-2 py-1 mt-3'>
              <div
                className='w-full h-[280px] bg-[#FFF] p-10 rounded-md flex flex-col gap-5'
                style={{
                  borderTop: '1px solid #f5f5f5',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
              >
                <FaQuoteLeft
                  style={{ color: config?.websitePrimaryColor }}
                  className='absolute top-0'
                  size={30}
                />

                <span className='min-h-[53px] text-[0.9rem] text-zinc-700 line-clamp-3'>
                  {get(item, 'comment', '')}
                </span>

                <div className='flex flex-col items-center gap-3'>
                  <Avatar
                    size={50}
                    className='shrink-0'
                    src={get(item, 'user.avatar', '')}
                    icon={<FaUser size={25} />}
                    style={{
                      background: `${
                        !get(item, 'user.avatar', '') ? config?.websitePrimaryColor : ''
                      }`,
                    }}
                  />

                  <span className='text-[0.9rem] font-semibold line-clamp-1'>
                    {get(item, 'user.fullName', '')}
                  </span>
                </div>

                <div
                  className='flex items-center gap-3 hover:cursor-pointer group'
                  onClick={() => handleNavigateProduct(get(item, 'product.slug', ''))}
                >
                  <Image
                    preview={false}
                    height={50}
                    className='shrink-0 min-w-[50px]'
                    src={get(item, 'product.imagesUrl[0]', '')}
                  />
                  <span className='text-[0.8rem] text-zinc-700 line-clamp-2 group-hover:text-blue-700'>
                    {get(item, 'product.name', '')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ReviewSlide;
