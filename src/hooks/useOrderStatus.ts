import { useEffect } from 'react';
import { useSocket } from './useSocket';

export const useOrderStatus = (tableId: string, onUpdate: (data: any) => void) => {
  const socket = useSocket({
    role: 'USER',
    tableId,
  });

  useEffect(() => {
    socket.on('order:update', onUpdate);

    return () => {
      socket.off('order:update', onUpdate);
    };
  }, [socket, onUpdate]);
};
