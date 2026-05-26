'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { WorkflowEventPayload } from '@sentinel/shared';
import { WS_URL } from '@/lib/config';

export function useWorkflowSocket(incidentId: string | null) {
  const [events, setEvents] = useState<WorkflowEventPayload[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setEvents([]);
    setConnected(false);
    if (!incidentId) return;
    const socket: Socket = io(`${WS_URL}/incidents`, { transports: ['websocket'] });
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('subscribe', incidentId);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('workflow.event', (event: WorkflowEventPayload) => {
      setEvents((prev) => [...prev, event]);
    });
    return () => {
      socket.emit('unsubscribe', incidentId);
      socket.disconnect();
    };
  }, [incidentId]);

  return { events, connected };
}
