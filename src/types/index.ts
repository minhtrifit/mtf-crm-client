import { Product } from './product';

export interface PagingType {
  current_page: number;
  total_item: number;
  total_page: number;
  total: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum NotificationType {
  ORDER = 'ORDER',
}

export interface INotification {
  id: string;
  type: NotificationType;
  itemId: string;
  message_vi: string;
  message_en: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPayload {
  type?: NotificationType;
  itemId?: string;
  message_vi?: string;
  message_en?: string;
  isSeen?: boolean;
}
