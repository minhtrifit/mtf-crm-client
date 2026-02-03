import { get } from 'lodash';
import { Avatar, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetShowcaseCategory } from '@/pages/home/hooks/useGetShowcaseCategory';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

const CategoryList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile(1024);
  const { t } = useTranslation();

  const slug = params?.slug;

  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

  if (categories?.length === 0 || categories?.length === 1) return null;

  return (
    <section className='block__container flex flex-col gap-3'>
      <h3 className='text-[1rem]'>{t('explore_by_category')}</h3>

      {categoriesLoading ? (
        <div className='p-6 w-full flex flex-wrap items-start gap-[60px]'>
          <Skeleton.Avatar active size={80} />
          <Skeleton.Avatar active size={80} />
          {!isMobile && <Skeleton.Avatar active size={80} />}
          {!isMobile && <Skeleton.Avatar active size={80} />}
          {!isMobile && <Skeleton.Avatar active size={80} />}
          {!isMobile && <Skeleton.Avatar active size={80} />}
          {!isMobile && <Skeleton.Avatar active size={80} />}
          {!isMobile && <Skeleton.Avatar active size={80} />}
        </div>
      ) : (
        <div className='p-6 w-full flex flex-wrap items-start gap-[60px]'>
          {categories?.map((category) => {
            if (category?.slug === slug) return null;

            return (
              <div
                key={get(category, 'id', '')}
                className='flex flex-col items-center gap-3 hover:cursor-pointer group'
                onClick={() => navigate(`/danh-muc/${get(category, 'slug', '')}`)}
              >
                <Avatar src={get(category, 'imageUrl', '')} size={80} />
                <span className='max-w-[150px] text-center text-[0.85rem] line-clamp-2 text-zinc-700 group-hover:text-blue-700'>
                  {get(category, 'name', '')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoryList;
