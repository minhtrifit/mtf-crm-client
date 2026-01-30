import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { INotification } from '@/types';

interface EventType {
  message_vi: string;
  message_en: string;
  data: INotification;
}

export const useAdminOrders = (onNewOrder: (order: EventType) => void) => {
  const socket = useSocket({
    role: 'ADMIN',
  });

  useEffect(() => {
    socket.on('order:new', onNewOrder);

    return () => {
      socket.off('order:new', onNewOrder);
    };
  }, [socket, onNewOrder]);
};
