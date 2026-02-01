import { get } from 'lodash';
import { Avatar, Skeleton } from 'antd';
import { Category } from '@/types/category';
import { useNavigate } from 'react-router-dom';

interface PropType {
  isAdmin?: boolean;
  loading: boolean;
  data: Category[];
}

const CategoryMenu = (props: PropType) => {
  const { isAdmin = false, loading, data } = props;

  const navigate = useNavigate();

  const handleNavigateSlug = (slug: string) => {
    navigate(`/danh-muc/${slug}`);
  };

  const handleNavigateDetail = (id: string) => {
    navigate(`/admin/category?open=${id}`);
  };

  return (
    <div className='w-[260px] h-[365px] bg-[#FFF] border-[1px] border-solid border-[#e5e7eb] rounded-md overflow-y-auto'>
      {loading ? (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3 p-2'>
            <Skeleton.Avatar active size={50} />
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
          </div>

          <div className='flex items-center gap-3 p-2'>
            <Skeleton.Avatar active size={50} />
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
          </div>

          <div className='flex items-center gap-3 p-2'>
            <Skeleton.Avatar active size={50} />
            <Skeleton.Input active style={{ width: 50, height: 20 }} />
          </div>
        </div>
      ) : (
        <div className='flex flex-col'>
          {data?.map((category) => {
            return (
              <div
                key={get(category, 'id', '')}
                className='flex items-center gap-3 p-2 hover:cursor-pointer hover:bg-blue-100 group'
                onClick={() => {
                  if (!isAdmin) handleNavigateSlug(get(category, 'slug', ''));
                  else handleNavigateDetail(get(category, 'id', ''));
                }}
              >
                <Avatar src={get(category, 'imageUrl', '')} size={50} />
                <span className='text-[0.85rem] text-zinc-700 group-hover:text-blue-700'>
                  {get(category, 'name', '')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
