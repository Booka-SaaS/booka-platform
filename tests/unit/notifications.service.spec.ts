import { NotificationsService } from '../../services/notification-service/src/notifications.service';

function buildPrismaMock() {
  return {
    notificacao: {
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn((items: Promise<unknown>[]) => Promise.all(items)),
  } as any;
}

describe('NotificationsService', () => {
  it('creates booking notifications idempotently by eventoId', async () => {
    const prisma = buildPrismaMock();
    prisma.notificacao.upsert.mockResolvedValue({ id: 'notificacao-1' });
    const service = new NotificationsService(prisma);

    await service.createFromBookingEvent({
      type: 'BOOKING_CREATED',
      eventoId: 'booking.created.agendamento-1',
      agendamentoId: 'agendamento-1',
      profissionalUserId: 'usuario-profissional',
      lojaId: 'loja-1',
      clienteNome: 'Cliente Teste',
      servicoNome: 'Corte',
      inicio: '2026-06-10T10:00:00.000Z',
      createdAt: '2026-06-09T12:00:00.000Z',
    });

    expect(prisma.notificacao.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { eventoId: 'booking.created.agendamento-1' },
      update: {},
      create: expect.objectContaining({
        usuarioId: 'usuario-profissional',
        eventoId: 'booking.created.agendamento-1',
        titulo: 'Novo agendamento',
        tipo: 'AGENDAMENTO',
        lida: false,
      }),
    }));
  });

  it('marks only the authenticated user notification as read', async () => {
    const prisma = buildPrismaMock();
    prisma.notificacao.updateMany.mockResolvedValue({ count: 1 });
    prisma.notificacao.findUniqueOrThrow.mockResolvedValue({ id: 'notificacao-1', lida: true });
    const service = new NotificationsService(prisma);

    const result = await service.markAsRead('usuario-1', 'notificacao-1');

    expect(result).toEqual({ id: 'notificacao-1', lida: true });
    expect(prisma.notificacao.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'notificacao-1',
        usuarioId: 'usuario-1',
      },
      data: { lida: true },
    });
  });
});
