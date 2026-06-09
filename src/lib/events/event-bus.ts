import amqp from 'amqplib';
import { env } from '../../config/env';

const BOOKA_EXCHANGE = 'booka.events';
const BOOKING_CREATED_KEY = 'booking.created';

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

let connectionPromise: Promise<amqp.ChannelModel> | null = null;
let channelPromise: Promise<amqp.Channel> | null = null;

async function getConnection() {
  connectionPromise ??= amqp.connect(env.RABBITMQ_URL);
  return connectionPromise;
}

async function getChannel() {
  channelPromise ??= getConnection().then(async (connection) => {
    const channel = await connection.createChannel();
    await channel.assertExchange(BOOKA_EXCHANGE, 'topic', { durable: true });
    return channel;
  });
  return channelPromise;
}

export async function publishBookingCreated(event: BookingCreatedEvent) {
  try {
    const channel = await getChannel();
    channel.publish(BOOKA_EXCHANGE, BOOKING_CREATED_KEY, Buffer.from(JSON.stringify(event)), {
      contentType: 'application/json',
      persistent: true,
      messageId: event.eventoId,
      type: event.type,
    });
  } catch (error) {
    connectionPromise = null;
    channelPromise = null;
    console.error('[events] Falha ao publicar booking.created:', error);
  }
}

