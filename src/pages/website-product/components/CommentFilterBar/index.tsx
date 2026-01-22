import { Button, Rate } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { ProductReview } from '@/types/product';
import { get } from 'lodash';

interface PropType {
  review: ProductReview | null;
  rate: string;
  handleRate: (value: string) => void;
}

const CommentFilterBar = (props: PropType) => {
  const { review, rate, handleRate } = props;

  const { config } = useAppConfig();
  const { t } = useTranslation();

  const RATE_ITEMS = [
    { id: 'all', value: '', title: t('all') },
    { id: '5Star', value: '5', title: t('rate.five_star') },
    { id: '4Star', value: '4', title: t('rate.four_star') },
    { id: '3Star', value: '3', title: t('rate.three_star') },
    { id: '2Star', value: '2', title: t('rate.two_star') },
    { id: '1Star', value: '1', title: t('rate.one_star') },
  ];

  return (
    <div
      className='w-full bg-[#fffbf8] border border-solid border-[#f9ede5] rounded-sm
                    px-6 py-4 grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-10'
    >
      <div className='flex flex-col items-center gap-1'>
        <span style={{ color: config?.websitePrimaryColor }} className='text-[1.2rem]'>
          <span className='font-semibold text-[1.8rem]'>{get(review, 'ratingAvg', 0)}</span>{' '}
          {t('over').toLowerCase()} 5
        </span>
        <Rate value={get(review, 'ratingAvg', 0)} allowHalf disabled />
      </div>

      <div className='w-full flex flex-wrap gap-2'>
        {RATE_ITEMS.map((item) => (
          <Button
            type={item.value === rate ? 'primary' : 'default'}
            key={item.id}
            onClick={() => handleRate(item.value)}
          >
            {item.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommentFilterBar;
