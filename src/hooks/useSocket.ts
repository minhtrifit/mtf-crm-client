import { useEffect } from 'react';
import { socket } from '@/+core/services/socket';

type UseSocketParams = {
  role: 'ADMIN' | 'USER';
  tableId?: string;
  enabled?: boolean;
};

export const useSocket = ({ role, tableId, enabled = true }: UseSocketParams) => {
  useEffect(() => {
    if (!enabled) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Join room
    socket.emit('join', {
      role,
      tableId,
    });

    return () => {
      socket.disconnect();
    };
  }, [role, tableId, enabled]);

  return socket;
};
