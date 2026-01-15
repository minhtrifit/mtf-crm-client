import { PaymentMethod } from '@/+core/constants/commons.constant';

export interface PaymentFilterType {
  page: number;
  q: string;
  method: PaymentMethod;
  fromAmount: number | null;
  toAmount: number | null;
  fromPaidTime: string | null;
  toPaidTime: string | null;
}

export interface PaymentPayload {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

export interface PaymentBase {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

export interface Payment extends PaymentBase {
  id: string;
  paidAt: string;
}
