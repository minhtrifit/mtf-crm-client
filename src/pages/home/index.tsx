import CategoryMenu from './components/CategoryMenu';
import BannerSlide from './components/BannerSlide';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGetShowcaseCategory } from './hooks/useGetShowcaseCategory';

const HomePage = () => {
  const isMobile = useIsMobile(1024);
  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[30px] flex flex-col gap-8'>
        <section className='w-full max-w-full flex justify-between'>
          {!isMobile && <CategoryMenu loading={categoriesLoading} data={categories} />}
          <div className='w-[98%] lg:w-[calc(98%-260px)]'>
            <BannerSlide />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
