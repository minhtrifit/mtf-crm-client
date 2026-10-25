import { useCallback } from 'react';
import { Button, notification } from 'antd';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PublicCoupon } from '@/types/coupon';
import { copyToClipboard, formatCurrency, formatDate } from '@/+core/helpers';

interface PropType {
  data: PublicCoupon;
  className?: string;
}

const CouponCard = (props: PropType) => {
  const { data, className } = props;

  const { config } = useAppConfig();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const color = config?.websitePrimaryColor;

  const getDiscountValue = () => {
    switch (data.type) {
      case 'PERCENTAGE':
        return `${data.value}%`;
      case 'FIXED':
        return `${formatCurrency(data.value)}`;
    }
  };

  const getDiscountCondition = () => {
    if (data.minOrderAmount && !data.maxDiscountAmount) {
      return `(${t('coupon.condition_min', {
        minOrderAmount: data.minOrderAmount,
      })})`;
    }
    if (!data.minOrderAmount && data.maxDiscountAmount) {
      return `(${t('coupon.condition_max', {
        maxDiscountAmount: data.maxDiscountAmount,
      })})`;
    }
    if (data.minOrderAmount && data.maxDiscountAmount) {
      return `(${t('coupon.condition', {
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
      })})`;
    }
  };

  const handleCopyCode = useCallback(
    async (code: string) => {
      try {
        await copyToClipboard(code);
        notification.success({
          message: t('notification'),
          description: t('coupon.copy_code_successfully'),
          placement: 'bottomLeft',
        });
      } catch (error) {
        notification.error({
          message: t('notification'),
          description: t('coupon.copy_code_failed'),
          placement: 'bottomLeft',
        });
      }
    },
    [t],
  );

  return (
    <div
      className={cn(className, 'relative h-[145px] md:h-[155px] w-full max-w-[520px] bg-white-900')}
      style={{
        boxShadow: '0 4px 8px -4px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Left perforated edge */}
      <div className='absolute inset-y-0 left-0 z-10 flex flex-col justify-around'>
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className='block rounded-r-full bg-[#f5f5fa]'
            style={{
              width: '7px',
              height: '14px',
              transform: 'translateX(-1px)',
            }}
          />
        ))}
      </div>

      {/* Right perforated edge */}
      <div className='absolute inset-y-0 right-0 z-10 flex flex-col justify-around'>
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className='block rounded-l-full bg-[#f5f5fa]'
            style={{
              width: '7px',
              height: '14px',
              transform: 'translateX(1px)',
            }}
          />
        ))}
      </div>

      {/* Left discount panel */}
      <div
        className='absolute inset-y-0 left-0 pl-3 md:pl-4 pr-2 md:pr-3 flex items-center justify-center'
        style={{
          backgroundColor: color,
        }}
      >
        <div className='flex items-center gap-1'>
          <span
            className='text-[0.8rem] md:text-[0.9rem] font-bold text-white-900'
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(360deg)',
            }}
          >
            DISCOUNT
          </span>
          <div
            className='h-[95px] w-[24px] shrink-0'
            style={{
              background:
                'repeating-linear-gradient(to bottom, #fff 0px, #fff 2px, transparent 2px, transparent 4px)',
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className='absolute left-[18%] md:left-[21%] inset-y-0 right-0 flex flex-col'>
        <div className='w-full px-2 py-2 md:py-4 flex flex-col gap-2'>
          <h2
            className='m-0 text-[1rem] md:text-[1.2rem] font-bold leading-none tracking-wide truncate'
            style={{
              color,
            }}
          >
            {data.code}
          </h2>
          <span className='h-[30px] text-zinc-700 text-[0.7rem] md:text-[0.8rem] line-clamp-2'>
            {t('coupon.discount')} {getDiscountValue()} {getDiscountCondition()}
          </span>
        </div>
        <div className='pl-2 pr-5 flex flex-1 items-center justify-between'>
          <span className='text-[0.7rem] md:text-[0.8rem] text-zinc-700'>
            {t('coupon.expire')} {formatDate(data.expiresAt)}
          </span>
          <Button onClick={() => handleCopyCode(data.code)}>{t('coupon.get_code')}</Button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
