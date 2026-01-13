import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useQueryParams } from '@/hooks/useQueryParams';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import Step, { PAYMENT_STEP } from './components/Step';
import CartForm from './components/CartForm';
import InformationForm from './components/InformationForm';
import StatusForm from './components/StatusForm';

const WebsiteCheckoutPage = () => {
  const { searchParams } = useQueryParams();
  const navigate = useNavigate();

  const step = searchParams.get('step') ?? '';

  const user = useSelector((state: RootState) => state.users.user);

  const formatStep = (value: string) => {
    if (value === '1') return PAYMENT_STEP.CART;
    if (value === '2') return PAYMENT_STEP.CHECKOUT;
    if (value === '3') return PAYMENT_STEP.STATUS;

    navigate(WEBSITE_ROUTE.HOME);
  };

  if (step !== '3' && !user) {
    return <Navigate to={WEBSITE_ROUTE.HOME} />;
  }

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px] flex flex-col gap-8'>
        <Step current={formatStep(step) as PAYMENT_STEP} />

        {step === '1' && <CartForm />}
        {step === '2' && <InformationForm />}
        {step === '3' && <StatusForm />}
      </div>
    </div>
  );
};

export default WebsiteCheckoutPage;
