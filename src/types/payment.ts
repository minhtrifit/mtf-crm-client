import { PaymentMethod } from '@/+core/constants/commons.constant';

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
