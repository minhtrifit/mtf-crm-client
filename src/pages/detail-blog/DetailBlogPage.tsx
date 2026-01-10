import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { BlogType } from '@/types';
import Empty from '@/components/ui/Empty/Empty';

const DetailBlogPage = () => {
  const blog: BlogType | null = useSelector((state: RootState) => state.users.blog);

  if (!blog) {
    return <Empty />;
  }

  return (
    <div>
      {blog?.content && (
        <div className='border p-4 rounded' dangerouslySetInnerHTML={{ __html: blog?.content }} />
      )}
    </div>
  );
};

export default DetailBlogPage;
