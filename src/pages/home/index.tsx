import { get } from 'lodash';
import cn from 'classnames';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGetShowcaseCategory } from './hooks/useGetShowcaseCategory';
import { useGetTemplateSections } from './hooks/useGetTemplateSections';
import { useList } from '../review/hooks/useList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ReviewsSkeleton, SectionSkeleton } from './components/Skeleton';
import CategoryMenu from './components/CategoryMenu';
import CategoryMenuMobile from './components/CategoryMenuMobile';
import BannerSlide from './components/BannerSlide';
import SectionSlide from './components/SectionSlide';
import ReviewSlide from './components/ReviewSlide';

const HomePage = () => {
  const { config } = useAppConfig();
  const isMobile = useIsMobile(1024);
  const layoutIsMobile = useIsMobile();

  useDocumentTitle();

  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

  const { data: sections, loading: sectionsLoading } = useGetTemplateSections(
    config?.templateId ?? '',
  );

  const { data: reviews, loading: reviewsLoading } = useList({
    rate: 5,
    limit: 10,
  });

  return (
    <div className='w-full flex-1'>
      <div
        className={cn(
          'max-w-[1200px] mx-auto flex flex-col gap-8',
          layoutIsMobile ? 'px-[10px] py-[20px]' : 'px-[20px] py-[30px]',
        )}
      >
        <section className='w-full max-w-full flex justify-between'>
          {!isMobile && <CategoryMenu loading={categoriesLoading} data={categories} />}
          <div className='w-[98%] lg:w-[calc(98%-260px)]'>
            <BannerSlide />
          </div>
        </section>

        {isMobile && <CategoryMenuMobile loading={categoriesLoading} data={categories} />}

        <section
          className={cn('w-full max-w-full flex flex-col', layoutIsMobile ? 'gap-6' : 'gap-10')}
        >
          {sectionsLoading ? (
            <SectionSkeleton />
          ) : (
            sections?.map((section) => {
              return <SectionSlide key={get(section, 'id', '')} section={section} />;
            })
          )}
        </section>

        <section className='w-full max-w-full'>
          {reviewsLoading ? <ReviewsSkeleton /> : <ReviewSlide data={reviews} />}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
