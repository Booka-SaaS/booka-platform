import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoNotificacao } from '@prisma/client';
import { PrismaService } from './prisma.service';

export type BookingCreatedEvent = {
  type: 'BOOKING_CREATED';
  eventoId: string;
  agendamentoId: string;
  profissionalUserId: string;
  lojaId: string;
  clienteNome: string;
  servicoNome: string;
  inicio: string;
  createdAt: string;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(usuarioId: string) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unreadCount(usuarioId: string) {
    return this.prisma.notificacao.count({
      where: {
        usuarioId,
        lida: false,
      },
    });
  }

  async summary(usuarioId: string) {
    const [total, unread] = await this.prisma.$transaction([
      this.prisma.notificacao.count({ where: { usuarioId } }),
      this.prisma.notificacao.count({ where: { usuarioId, lida: false } }),
    ]);

    return { total, unread };
  }

  async markAsRead(usuarioId: string, id: string) {
    const result = await this.prisma.notificacao.updateMany({
      where: {
        id,
        usuarioId,
      },
      data: { lida: true },
    });

    if (result.count === 0) {
      throw new NotFoundException('Notificacao nao encontrada.');
    }

    return this.prisma.notificacao.findUniqueOrThrow({
      where: { id },
    });
  }

  async createFromBookingEvent(event: BookingCreatedEvent) {
    const inicio = new Date(event.inicio);
    const when = Number.isNaN(inicio.getTime())
      ? event.inicio
      : new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'America/Cuiaba',
        }).format(inicio);

    return this.prisma.notificacao.upsert({
      where: { eventoId: event.eventoId },
      update: {},
      create: {
        usuarioId: event.profissionalUserId,
        eventoId: event.eventoId,
        titulo: 'Novo agendamento',
        mensagem: `${event.clienteNome} solicitou ${event.servicoNome} para ${when}.`,
        tipo: TipoNotificacao.AGENDAMENTO,
        lida: false,
      },
    });
  }
}
