import { StepProps, Steps } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { MdOutlineBookmarkAdded } from 'react-icons/md';
import { FaRegCreditCard, FaTruck, FaRegCheckCircle } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';

export enum DELIVERY_STATUS_STEP {
  ORDERED = '1',
  CONFIRMED = '2',
  PREPARING = '3',
  SHIPPING = '4',
  DELIVERED = '5',
}

interface PropType {
  current: DELIVERY_STATUS_STEP;
}

export const isPaymentStep = (value: unknown): value is DELIVERY_STATUS_STEP => {
  return Object.values(DELIVERY_STATUS_STEP).includes(value as DELIVERY_STATUS_STEP);
};

const Step = ({ current }: PropType) => {
  const { config } = useAppConfig();
  const { t } = useTranslation();

  const stepOrder: DELIVERY_STATUS_STEP[] = [
    DELIVERY_STATUS_STEP.ORDERED,
    DELIVERY_STATUS_STEP.CONFIRMED,
    DELIVERY_STATUS_STEP.PREPARING,
    DELIVERY_STATUS_STEP.SHIPPING,
    DELIVERY_STATUS_STEP.DELIVERED,
  ];

  const getStepStatus = (step: DELIVERY_STATUS_STEP) => {
    const currentIndex = stepOrder.indexOf(current);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'finish';
    if (stepIndex === currentIndex) return 'process';
    return 'wait';
  };

  const getStepIcon = (step: DELIVERY_STATUS_STEP, defaultIcon: React.ReactNode) => {
    return getStepStatus(step) === 'finish' ? (
      <CheckCircleFilled style={{ color: '#52c41a', fontSize: 28 }} />
    ) : (
      defaultIcon
    );
  };

  const steps: StepProps[] = [
    {
      title: (
        <div className='flex flex-row md:flex-col items-center gap-3 md:gap-0'>
          {getStepIcon(
            DELIVERY_STATUS_STEP.ORDERED,
            <FaRegCreditCard
              size={25}
              style={{ color: current === '1' ? config?.websitePrimaryColor : '' }}
            />,
          )}
          <span className='text-[0.8rem] text-zinc-700'>{t('delivery.ordered')}</span>
        </div>
      ),
      status: getStepStatus(DELIVERY_STATUS_STEP.ORDERED),
      icon: <></>,
    },
    {
      title: (
        <div className='flex flex-row md:flex-col items-center gap-3 md:gap-0'>
          {getStepIcon(
            DELIVERY_STATUS_STEP.CONFIRMED,
            <MdOutlineBookmarkAdded
              size={25}
              style={{ color: current === '2' ? config?.websitePrimaryColor : '' }}
            />,
          )}
          <span className='text-[0.8rem] text-zinc-700'>{t('delivery.confirmed')}</span>
        </div>
      ),
      status: getStepStatus(DELIVERY_STATUS_STEP.CONFIRMED),
      icon: <></>,
    },
    {
      title: (
        <div className='flex flex-row md:flex-col items-center gap-3 md:gap-0'>
          {getStepIcon(
            DELIVERY_STATUS_STEP.PREPARING,
            <PiPackageBold
              size={25}
              style={{ color: current === '3' ? config?.websitePrimaryColor : '' }}
            />,
          )}
          <span className='text-[0.8rem] text-zinc-700'>{t('delivery.preparing')}</span>
        </div>
      ),
      status: getStepStatus(DELIVERY_STATUS_STEP.PREPARING),
      icon: <></>,
    },
    {
      title: (
        <div className='flex flex-row md:flex-col items-center gap-3 md:gap-0'>
          {getStepIcon(
            DELIVERY_STATUS_STEP.SHIPPING,
            <FaTruck
              size={25}
              style={{ color: current === '4' ? config?.websitePrimaryColor : '' }}
            />,
          )}
          <span className='text-[0.8rem] text-zinc-700'>{t('delivery.shipping')}</span>
        </div>
      ),
      status: getStepStatus(DELIVERY_STATUS_STEP.SHIPPING),
      icon: <></>,
    },
    {
      title: (
        <div className='flex flex-row md:flex-col items-center gap-3 md:gap-0'>
          {getStepIcon(
            DELIVERY_STATUS_STEP.DELIVERED,
            <FaRegCheckCircle
              size={25}
              style={{ color: current === '5' ? config?.websitePrimaryColor : '' }}
            />,
          )}
          <span className='text-[0.8rem] text-zinc-700'>{t('delivery.delivered')}</span>
        </div>
      ),
      status: getStepStatus(DELIVERY_STATUS_STEP.DELIVERED),
      icon: <></>,
    },
  ];

  return <Steps items={steps} />;
};

export default Step;
