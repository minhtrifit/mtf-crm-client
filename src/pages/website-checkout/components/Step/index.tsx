import { StepProps, Steps } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaRegCreditCard } from 'react-icons/fa';
import { LuShoppingBag } from 'react-icons/lu';

export enum PAYMENT_STEP {
  CART = '1',
  CHECKOUT = '2',
  STATUS = '3',
}

interface PropType {
  current: PAYMENT_STEP;
}

export const isPaymentStep = (value: unknown): value is PAYMENT_STEP => {
  return Object.values(PAYMENT_STEP).includes(value as PAYMENT_STEP);
};

const Step = ({ current }: PropType) => {
  const { t } = useTranslation();

  const stepOrder: PAYMENT_STEP[] = [PAYMENT_STEP.CART, PAYMENT_STEP.CHECKOUT, PAYMENT_STEP.STATUS];

  const getStepStatus = (step: PAYMENT_STEP) => {
    const currentIndex = stepOrder.indexOf(current);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'finish';
    if (stepIndex === currentIndex) return 'process';
    return 'wait';
  };

  const getStepIcon = (step: PAYMENT_STEP, defaultIcon: React.ReactNode) => {
    return getStepStatus(step) === 'finish' ? (
      <CheckCircleFilled style={{ color: '#52c41a', fontSize: 28 }} />
    ) : (
      defaultIcon
    );
  };

  const steps: StepProps[] = [
    {
      title: t('cart'),
      status: getStepStatus(PAYMENT_STEP.CART),
      icon: getStepIcon(PAYMENT_STEP.CART, <AiOutlineShoppingCart size={30} />),
    },
    {
      title: t('checkout'),
      status: getStepStatus(PAYMENT_STEP.CHECKOUT),
      icon: getStepIcon(PAYMENT_STEP.CHECKOUT, <FaRegCreditCard size={30} />),
    },
    {
      title: t('status'),
      status: getStepStatus(PAYMENT_STEP.STATUS),
      icon: getStepIcon(PAYMENT_STEP.STATUS, <LuShoppingBag size={30} />),
    },
  ];

  return <Steps items={steps} />;
};

export default Step;
