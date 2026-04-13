import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getDayStart(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function getDayEnd(date: string) {
  return new Date(`${date}T23:59:59.999Z`);
}

function getSlotDate(date: string, time: string) {
  return new Date(`${date}T${time}:00.000Z`);
}

export async function listDisponibilidade(lojaId: string, date: string) {
  const referenceDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(referenceDate.getTime())) {
    throw new AppError('Data invalida.', 400);
  }

  const diaSemana = referenceDate.getUTCDay();
  const disponibilidade = await prisma.disponibilidadeSemanal.findUnique({
    where: {
      lojaId_diaSemana: {
        lojaId,
        diaSemana,
      },
    },
  });

  if (!disponibilidade || !disponibilidade.ativo) {
    return {
      data: date,
      horarios: [],
    };
  }

  const [agendamentos, bloqueios] = await Promise.all([
    prisma.agendamento.findMany({
      where: {
        lojaId,
        status: {
          in: ['PENDENTE', 'CONFIRMADO'],
        },
        inicio: {
          gte: getDayStart(date),
          lte: getDayEnd(date),
        },
      },
      select: {
        inicio: true,
        fim: true,
      },
    }),
    prisma.bloqueioAgenda.findMany({
      where: {
        lojaId,
        inicio: {
          lte: getDayEnd(date),
        },
        fim: {
          gte: getDayStart(date),
        },
      },
      select: {
        inicio: true,
        fim: true,
      },
    }),
  ]);

  const horarios: string[] = [];
  const inicioMinutos = parseTimeToMinutes(disponibilidade.horaInicio);
  const fimMinutos = parseTimeToMinutes(disponibilidade.horaFim);

  for (
    let currentMinutes = inicioMinutos;
    currentMinutes < fimMinutos;
    currentMinutes += disponibilidade.intervaloMinutos
  ) {
    const horario = minutesToTime(currentMinutes);
    const slotStart = getSlotDate(date, horario);
    const slotEnd = new Date(slotStart.getTime() + disponibilidade.intervaloMinutos * 60 * 1000);

    const conflictsWithAppointments = agendamentos.some(
      (agendamento) => agendamento.inicio < slotEnd && agendamento.fim > slotStart,
    );
    const conflictsWithBlocks = bloqueios.some(
      (bloqueio) => bloqueio.inicio < slotEnd && bloqueio.fim > slotStart,
    );

    if (!conflictsWithAppointments && !conflictsWithBlocks) {
      horarios.push(horario);
    }
  }

  return {
    data: date,
    horarios,
  };
}
