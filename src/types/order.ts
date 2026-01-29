import { DeliveryStatus, OrderStatus, PaymentMethod } from '@/+core/constants/commons.constant';
import { UserType } from './auth';
import { Product } from './product';
import { Payment } from './payment';

export interface Order {
  id: string;
  orderCode: string;
  totalAmount: number;
  status: OrderStatus;
  phone: string;
  deliveryAddress: string;
  note: string | null;
  deliveryStatus: DeliveryStatus;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserType;
  items: OrderItem[];
  payments: Payment[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface OrderPayload {
  userId: string;
  phone: string;
  deliveryAddress: string;
  note: string | null;
  items: OrderItemPayload[];
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface UpdateOrderPayload {
  note?: string;
  deliveryAddress?: string;
  status?: OrderStatus;
  deliveryStatus?: DeliveryStatus;
}

export interface AdminOrderPayload extends OrderPayload {
  amount: number;
  method: PaymentMethod;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
}
