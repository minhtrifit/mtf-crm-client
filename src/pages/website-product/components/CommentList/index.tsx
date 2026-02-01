import { get } from 'lodash';
import { Avatar, Divider, Image, Rate } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { CommentType } from '@/types/product';
import { formatDateTime } from '@/+core/helpers';
import { FaUser } from 'react-icons/fa';

interface PropType {
  comments: CommentType[];
}

const CommentList = (props: PropType) => {
  const { comments } = props;

  const { config } = useAppConfig();

  return (
    <div className='mt-5 w-full flex flex-col gap-10 px-6'>
      {comments?.map((comment, index) => {
        const isLast = index === comments?.length - 1;

        return (
          <div key={get(comment, 'id', '')} className='flex flex-col gap-5'>
            <div className='flex items-start gap-5'>
              <Avatar
                size={50}
                className='shrink-0'
                src={get(comment, 'user.avatar', '')}
                icon={<FaUser size={25} />}
                style={{
                  background: `${
                    !get(comment, 'user.avatar', '') ? config?.websitePrimaryColor : ''
                  }`,
                }}
              />

              <div className='w-full flex flex-col gap-2'>
                <span className='text-[0.8rem]'>{get(comment, 'user.fullName', '')}</span>
                <Rate value={get(comment, 'rating', 0)} disabled />
                <span className='text-[0.8rem] text-zinc-700'>
                  {formatDateTime(get(comment, 'createdAt', ''))}
                </span>
                <p className='text-[0.9rem]'>{get(comment, 'comment', '')}</p>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {comment?.imagesUrl?.map((img: string, index: number) => {
                    return (
                      <Image
                        width={100}
                        height={100}
                        className='object-cover'
                        key={`${get(comment, 'id', '')}-img-${index}`}
                        src={img}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {!isLast && <Divider className='my-0' />}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
