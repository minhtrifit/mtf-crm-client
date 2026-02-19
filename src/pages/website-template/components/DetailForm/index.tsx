import { get } from 'lodash';
import Slider from 'react-slick';
import { Button, Card, Rate, Tooltip, Image, Input } from 'antd';
import { WebsiteTemplate } from '@/types/website_template';
import { formatCurrency, formatNumber } from '@/+core/helpers';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useGetShowcaseCategory } from '@/pages/home/hooks/useGetShowcaseCategory';
import { useTranslation } from 'react-i18next';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaType, PaymentMethod } from '@/+core/constants/commons.constant';
import CategoryMenu from '@/pages/home/components/CategoryMenu';
import LanguageToggle from '@/components/global/LanguageToggle/LanguageToggle';
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaTruck,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
} from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { LuUserRound } from 'react-icons/lu';
import { IoMdMenu } from 'react-icons/io';
import styles from './styles.module.scss';

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

interface PropType {
  template: WebsiteTemplate | null;
}

const DetailForm = (props: PropType) => {
  const { template } = props;

  const isMobile = useIsMobile(1024);
  const scrollToTop = useScrollToTop();
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();
  const params = useParams();

  const { t } = useTranslation();

  const id = params?.id ?? '';

  const PAYMENTS = [
    {
      value: PaymentMethod.COD,
      label: t('payment.cod'),
      icon: <FaTruck size={30} />,
    },
    {
      value: PaymentMethod.VNPAY,
      label: t('payment.vnpay'),
      icon: <img className='w-[30px]' src='/assets/icons/icon-vnpay.png' alt='vnpay-icon' />,
    },
  ];

  const SOCIAL_MEDIA: Record<MediaType, React.ReactNode> = {
    FACEBOOK: <FaFacebook size={30} />,
    INSTAGRAM: <FaInstagram size={30} />,
    YOUTUBE: <FaYoutube size={30} />,
    TELEGRAM: <FaTelegramPlane size={30} />,
    ZALO: <img className='w-[30px]' src='/assets/icons/icon-zalo.png' alt='icon-zalo' />,
  };

  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

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

  const getSlidesToShow = (width: number) => {
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;

    return 4;
  };

  const productSlidesettings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : getSlidesToShow(screenWidth),
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

  const bannersUrl = get(template, 'bannersUrl', []);
  const medias = get(template, 'medias', []);
  const sections = get(template, 'sections', []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectEdit = (id: string) => {
    navigate(`/admin/website-template/edit/${id}`);
  };

  const handleRedirectDetailProduct = (id: string) => {
    navigate(`/admin/product/detail/${id}`);
  };

  return (
    <div className='max-w-[1400px] mx-auto flex flex-col gap-5'>
      <div className='block__container flex items-center justify-between gap-5'>
        <span className='text-xl text-primary font-bold'>{t('website_template.preview')}</span>

        <div className='flex items-center gap-2'>
          <Button type='default' htmlType='button' onClick={handleBack}>
            {t('back')}
          </Button>

          <Button
            type='primary'
            htmlType='button'
            onClick={() => {
              handleRedirectEdit(id);
            }}
          >
            {t('edit')}
          </Button>
        </div>
      </div>

      <div className='w-full flex flex-col gap-8 bg-[#f5f5fa] border-[1px] border-solid border-[#e5e7eb]'>
        <header style={{ background: get(template, 'primaryColor', '') }} className='w-full p-2'>
          <div className='w-full max-w-[80%] mx-auto flex items-center justify-between gap-5'>
            {get(template, 'logoUrl', '') ? (
              <img src={get(template, 'logoUrl', '')} className='h-[30px]' />
            ) : (
              <div className='w-[20px] h-[20px] bg-[#FFF] rounded-sm' />
            )}

            <form className='hidden xl:block w-[450px] relative'>
              <input
                placeholder={t('what_look_for')}
                className='pl-4 pr-[80px] w-full h-[40px] rounded-md border-none outline-none'
              />

              <button
                style={{
                  color: '#fff',
                  background: get(template, 'primaryColor', ''),
                }}
                className='absolute px-4 h-[30px] right-[10px] top-1/2 -translate-y-1/2 border-none rounded-md'
                type='submit'
              >
                <FaSearch />
              </button>
            </form>

            <IoMdMenu size={30} className='block xl:hidden text-[#FFF]' />

            <div className='hidden text-[#FFF] xl:flex items-center gap-8'>
              <LanguageToggle textColor='white' />
              <AiOutlineShoppingCart size={30} />
              <LuUserRound size={20} />
            </div>
          </div>
        </header>
        <div className='w-full max-w-[80%] mx-auto flex flex-col gap-8'>
          <section className='w-full max-w-full flex justify-between'>
            {!isMobile && (
              <CategoryMenu isAdmin={true} loading={categoriesLoading} data={categories} />
            )}
            <div className='w-[98%] lg:w-[calc(98%-260px)]'>
              {bannersUrl?.length === 0 ? (
                <div
                  style={{ background: get(template, 'primaryColor', '') }}
                  className='w-full h-[200px] md:h-[365px] text-[#FFF] rounded-md flex items-center justify-center'
                >
                  <FiShoppingBag size={40} />
                </div>
              ) : (
                <Slider {...bannerSlideSettings}>
                  {bannersUrl?.map((url: string, index: number) => (
                    <div key={`banner-${index}`}>
                      <img src={url} className='w-full lg:min-h-[365px] rounded-md' alt='' />
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </section>
        </div>
        <div className='w-full max-w-[80%] mx-auto flex flex-col gap-10'>
          {sections?.map((section) => {
            const items = get(section, 'items', []);

            return (
              <div key={get(section, 'id', '')} className='w-full flex flex-col gap-5'>
                <div className='w-full flex flex-wrap items-center justify-between gap-5'>
                  <h3
                    style={{ color: get(template, 'primaryColor', '') }}
                    className='text-[1.5rem]'
                  >
                    {get(section, 'title', '')}
                  </h3>

                  <span
                    style={{ color: get(template, 'primaryColor', '') }}
                    className='text-[0.9rem] font-semibold hover:cursor-pointer hover:underline'
                    onClick={() => navigate(`/admin/product`)}
                  >
                    {t('view_all')}
                  </span>
                </div>

                <div className={'w-full relative'}>
                  <Slider {...productSlidesettings}>
                    {items?.map((item) => {
                      const product = get(item, 'product', null);

                      return (
                        <div key={get(item, 'id', '')} className='px-2'>
                          <Card
                            className={styles.product__card}
                            style={{
                              ['--primary-color' as any]: get(template, 'primaryColor', ''),
                            }}
                            styles={{
                              body: {
                                padding: 12,
                                borderTop: '1px solid #f5f5f5',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                              },
                            }}
                            cover={
                              <Image
                                preview={false}
                                className='p-[1px] rounded-t-lg hover:cursor-pointer'
                                src={get(product, 'imagesUrl[0]', '')}
                                onClick={() => handleRedirectDetailProduct(get(product, 'id', ''))}
                              />
                            }
                          >
                            <div className='flex flex-col gap-2'>
                              <span
                                className='text-[1rem] min-h-[50px] line-clamp-2 hover:cursor-pointer'
                                onClick={() => handleRedirectDetailProduct(get(product, 'id', ''))}
                              >
                                {get(product, 'name', '')}
                              </span>

                              <div className='flex flex-col gap-1'>
                                <span
                                  style={{ color: get(template, 'primaryColor', '') }}
                                  className='text-[1.15rem] font-semibold'
                                >
                                  {formatCurrency(get(product, 'price', ''))}
                                </span>
                              </div>

                              <div className='w-full flex items-center justify-between gap-5'>
                                <div className='flex items-center gap-2'>
                                  {get(product, 'ratingAvg', 0) !== 0 && (
                                    <div className='flex items-center gap-1'>
                                      <Rate count={1} value={1} disabled />
                                      <span className='text-[0.8rem]'>
                                        {get(product, 'ratingAvg', 0)}
                                      </span>
                                    </div>
                                  )}

                                  {get(product, 'ratingAvg', 0) !== 0 && (
                                    <div className='w-[1px] h-[20px] bg-zinc-200' />
                                  )}

                                  <span className='text-[0.8rem]'>
                                    {t('product.sold')} {formatNumber(get(product, 'soldCount', 0))}
                                  </span>
                                </div>

                                <Tooltip title={t('add_to_cart')}>
                                  <button
                                    style={{
                                      color: '#FFF',
                                      background: get(template, 'primaryColor', ''),
                                    }}
                                    className='px-4 py-3 rounded-md border-none
                                                flex items-center justify-center hover:cursor-pointer'
                                  >
                                    <AiOutlineShoppingCart size={20} />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </div>
            );
          })}
        </div>
        <footer
          style={{ background: get(template, 'primaryColor', '') }}
          className='w-full text-[#FFF]'
        >
          <div className='w-full max-w-[80%] mx-auto pt-[50px] pb-[20px] flex flex-col gap-x-5 gap-y-10'>
            <div className='grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-10'>
              <div className='flex flex-col items-start gap-8'>
                {get(template, 'logoUrl', '') === '' ? (
                  <div
                    className='hover:cursor-pointer'
                    onClick={() => {
                      scrollToTop();
                    }}
                  >
                    <FiShoppingBag size={30} />
                  </div>
                ) : (
                  <div
                    className='hover:cursor-pointer'
                    onClick={() => {
                      scrollToTop();
                    }}
                  >
                    <img src={get(template, 'logoUrl', '')} className='h-[30px]' alt='brand-logo' />
                  </div>
                )}

                <div className='flex flex-col gap-3'>
                  {get(template, 'phone', '') && (
                    <div className='flex items-center gap-2'>
                      <FaPhone size={15} />
                      <span className='text-[0.8rem] font-semibold'>
                        {get(template, 'phone', '')}
                      </span>
                    </div>
                  )}

                  {get(template, 'email', '') && (
                    <div className='flex items-center gap-2'>
                      <MdEmail size={15} />
                      <span className='text-[0.8rem] font-semibold'>
                        <a
                          href={`mailto:${get(template, 'email', '')}`}
                          className='text-[#FFF] hover:text-[#FFF] hover:underline'
                        >
                          {get(template, 'email', '')}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col items-start gap-5'>
                <h4 className='font-medium'>{t('customer_support')}</h4>
                <div className='w-full flex flex-col gap-3'>
                  <span className='text-[0.9rem] hover:text-[#FFF] underline-offset-1 hover:cursor-pointer hover:underline'>
                    {t('faq.default')}
                  </span>
                  <span className='text-[0.9rem] hover:text-[#FFF] underline-offset-1 hover:cursor-pointer hover:underline'>
                    {t('policy.default')}
                  </span>
                </div>
              </div>

              <div className='flex flex-col items-start gap-5'>
                <h4 className='font-medium'>{t('payment.method')}</h4>
                <div className='grid grid-cols-4 items-center gap-5'>
                  {PAYMENTS.map((p) => (
                    <span key={p.value}>{p.icon}</span>
                  ))}
                </div>
              </div>

              {medias?.length !== 0 && (
                <div className='flex flex-col items-start gap-5'>
                  <h4 className='font-medium'>{t('contact_us')}</h4>
                  <div className='grid grid-cols-4 items-center gap-5'>
                    {medias?.map((media) => (
                      <a
                        key={get(media, 'id', '')}
                        href={get(media, 'url', '')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[#FFF] hover:text-[#FFF] inline-flex
                                  transition-transform duration-200 ease-in-out hover:scale-110'
                      >
                        {SOCIAL_MEDIA[get(media, 'type')]}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {get(template, 'footerDescription', '') && (
              <p className='text-[0.8rem] text-center font-[500]'>
                {get(template, 'footerDescription', '')}
              </p>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DetailForm;
