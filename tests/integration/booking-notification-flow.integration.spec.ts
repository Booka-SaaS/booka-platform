import { NotificationsService } from '../../services/notification-service/src/notifications.service';

describe('booking.created integration contract', () => {
  it('converts the public booking event into a professional notification', async () => {
    const prisma = {
      notificacao: {
        upsert: jest.fn().mockResolvedValue({ id: 'notificacao-1' }),
      },
    } as any;
    const service = new NotificationsService(prisma);

    await service.createFromBookingEvent({
      type: 'BOOKING_CREATED',
      eventoId: 'booking.created.agendamento-2',
      agendamentoId: 'agendamento-2',
      profissionalUserId: 'profissional-1',
      lojaId: 'loja-1',
      clienteNome: 'Maria',
      servicoNome: 'Massagem',
      inicio: '2026-06-10T13:00:00.000Z',
      createdAt: '2026-06-09T12:00:00.000Z',
    });

    expect(prisma.notificacao.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { eventoId: 'booking.created.agendamento-2' },
      create: expect.objectContaining({
        usuarioId: 'profissional-1',
        tipo: 'AGENDAMENTO',
      }),
    }));
  });
});
