import { useMemo, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { CartItem } from '@/types';
import couponApi, { AppliedCoupon, ApplyCouponPayload } from '@/+core/api/coupon.api';

interface ParamsType {
  carts: CartItem[];
}

export const useApplyCoupon = ({ carts }: ParamsType) => {
  const { t } = useTranslation();

  const [couponCode, setCouponCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    cartKey: string;
    result: AppliedCoupon;
  } | null>(null);

  const cartKey = useMemo(
    () =>
      carts
        .map((item) => `${item.product.id}:${item.quantity}:${item.product.price}`)
        .sort()
        .join('|'),
    [carts],
  );
  const currentAppliedCoupon = appliedCoupon?.cartKey === cartKey ? appliedCoupon.result : null;

  const handleSetCouponCode = (value: string) => {
    setCouponCode(value);
  };

  const handleSetAppliedCoupon = (
    value: {
      cartKey: string;
      result: AppliedCoupon;
    } | null,
  ) => {
    setAppliedCoupon(value);
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      message.error(t('coupon.code_required'));
      return;
    }

    try {
      setLoading(true);
      const payload: ApplyCouponPayload = {
        code,
        items: carts.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };
      const response = await couponApi.apply(payload);
      handleSetAppliedCoupon({ cartKey, result: response.data.data });
      message.success(response.data.message ?? t('coupon.apply_successfully'));
    } catch (error: any) {
      handleSetAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    couponCode,
    currentAppliedCoupon,
    couponLoading: loading,
    handleSetCouponCode,
    handleSetAppliedCoupon,
    handleApplyCoupon,
  };
};
