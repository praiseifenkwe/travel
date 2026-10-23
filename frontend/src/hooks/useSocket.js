import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '../services/socket';

export const useSocket = (applicationId = null, isStaff = false) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      if (applicationId) {
        socket.emit('join_room', { room: `app_${applicationId}` });
      }
      if (isStaff) {
        socket.emit('join_room', { room: 'staff_room' });
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleDocProcessed = (data) => {
      setLastEvent({ type: 'document_processed', data, timestamp: Date.now() });
    };

    const handleStaffAction = (data) => {
      setLastEvent({ type: 'staff_action', data, timestamp: Date.now() });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('document_processed', handleDocProcessed);
    socket.on('staff_document_processed', handleDocProcessed);
    socket.on('staff_action', handleStaffAction);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('document_processed', handleDocProcessed);
      socket.off('staff_document_processed', handleDocProcessed);
      socket.off('staff_action', handleStaffAction);
    };
  }, [applicationId, isStaff]);

  const joinAppRoom = useCallback((appId) => {
    const socket = getSocket();
    if (socket.connected && appId) {
      socket.emit('join_room', { room: `app_${appId}` });
    }
  }, []);

  return { isConnected, lastEvent, joinAppRoom };
};
