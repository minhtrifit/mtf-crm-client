import { useCouponShowcase } from '@/pages/coupon/hooks/useCouponShowcase';

const CouponSlide = () => {
  const { data: coupons } = useCouponShowcase();

  if (coupons.length === 0) return null;

  return <section>CouponSlide</section>;
};

export default CouponSlide;
