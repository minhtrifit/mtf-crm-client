import { get } from 'lodash';
import { Avatar, Skeleton } from 'antd';
import Slider from 'react-slick';
import { Category } from '@/types/category';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScreenWidth } from '@/hooks/useScreenWidth';
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

interface PropType {
  isAdmin?: boolean;
  loading: boolean;
  data: Category[];
}

const CategoryMenuMobile = (props: PropType) => {
  const { isAdmin = false, loading, data } = props;

  const navigate = useNavigate();
  const isMobile = useIsMobile(1024);
  const screenWidth = useScreenWidth();

  const getSlidesToShow = (width: number) => {
    if (width < 640) return 3;
    if (width < 1024) return 5;

    return 5;
  };

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: getSlidesToShow(screenWidth),
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
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
    ],
  };

  const handleNavigateSlug = (slug: string) => {
    navigate(`/danh-muc/${slug}`);
  };

  const handleNavigateDetail = (id: string) => {
    navigate(`/admin/category?open=${id}`);
  };

  if (loading) {
    return (
      <div className='grid grid-cols-3 lg:grid-cols-5 gap-5'>
        <Skeleton.Input active style={{ width: '100%', height: 80 }} />
        <Skeleton.Input active style={{ width: '100%', height: 80 }} />
        <Skeleton.Input active style={{ width: '100%', height: 80 }} />
        {!isMobile && <Skeleton.Input active style={{ width: '100%', height: 80 }} />}
        {!isMobile && <Skeleton.Input active style={{ width: '100%', height: 80 }} />}
      </div>
    );
  }

  return (
    <section className='w-full relative'>
      <Slider {...settings}>
        {data?.map((category) => (
          <div key={get(category, 'id', '')} className='p-1'>
            <div
              className='p-2 bg-[#FFF] rounded-md flex flex-col items-center justify-center gap-1'
              style={{
                borderTop: '1px solid #f5f5f5',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onClick={() => {
                if (!isAdmin) handleNavigateSlug(get(category, 'slug', ''));
                else handleNavigateDetail(get(category, 'id', ''));
              }}
            >
              <Avatar src={get(category, 'imageUrl', '')} size={50} />
              <span className='h-[32px] text-center text-[0.8rem] text-zinc-700 max-w-[120px] line-clamp-2'>
                {get(category, 'name', '')}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CategoryMenuMobile;
