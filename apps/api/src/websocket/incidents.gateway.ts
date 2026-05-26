import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WorkflowEventPayload } from '@sentinel/shared';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/incidents' })
export class IncidentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(IncidentsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, incidentId: string) {
    if (!incidentId) return { ok: false };
    const room = this.incidentRoom(incidentId);
    client.join(room);
    return { ok: true, room };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, incidentId: string) {
    if (!incidentId) return { ok: false };
    client.leave(this.incidentRoom(incidentId));
    return { ok: true };
  }

  broadcastToIncident(incidentId: string, event: WorkflowEventPayload) {
    this.server.to(this.incidentRoom(incidentId)).emit('workflow.event', event);
  }

  private incidentRoom(incidentId: string) {
    return `incident:${incidentId}`;
  }
}
