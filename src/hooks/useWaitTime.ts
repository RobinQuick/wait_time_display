import { useState, useEffect, useCallback } from 'react';
import { WaitTimeData } from '../types';

export function useWaitTime() {
  const [data, setData] = useState<WaitTimeData>({
    waitTime: 10,
    offer: 'un café',
    hasOffer: true
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      try {
        eventSource = new EventSource('/stream');
        
        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
          const [waitTimeStr, offer] = event.data.split('|');
          const waitTime = parseInt(waitTimeStr, 10);
          
          if (!isNaN(waitTime)) {
            setData(prev => ({
              ...prev,
              waitTime,
              offer: offer || prev.offer,
              hasOffer: Boolean(offer)
            }));
          }
        };

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          reconnectTimer = setTimeout(connect, 2000);
        };
      } catch (error) {
        console.error('Failed to connect to SSE:', error);
        reconnectTimer = setTimeout(connect, 2000);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, []);

  const updateWaitTime = useCallback(async (waitTime: number, pin?: string) => {
    try {
      const formData = new FormData();
      formData.append('value', waitTime.toString());
      if (pin) formData.append('pin', pin);

      const response = await fetch('/wait', {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update wait time:', error);
      return false;
    }
  }, []);

  const updateOffer = useCallback(async (offer: string) => {
    try {
      const formData = new FormData();
      formData.append('value', offer);

      const response = await fetch('/offer', {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update offer:', error);
      return false;
    }
  }, []);

  const removeOffer = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('value', '');

      const response = await fetch('/offer', {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to remove offer:', error);
      return false;
    }
  }, []);

  return {
    data,
    isConnected,
    updateWaitTime,
    updateOffer,
    removeOffer
  };
}