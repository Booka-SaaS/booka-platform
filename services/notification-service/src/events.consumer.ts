import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import amqp from 'amqplib';
import { notificationEnv } from './config';
import { BookingCreatedEvent, NotificationsService } from './notifications.service';

const BOOKA_EXCHANGE = 'booka.events';
const BOOKING_CREATED_KEY = 'booking.created';
const BOOKING_CREATED_QUEUE = 'notification.booking.created';

@Injectable()
export class BookingCreatedConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private readonly notifications: NotificationsService) {}

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(notificationEnv.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(BOOKA_EXCHANGE, 'topic', { durable: true });
      await this.channel.assertQueue(BOOKING_CREATED_QUEUE, { durable: true });
      await this.channel.bindQueue(BOOKING_CREATED_QUEUE, BOOKA_EXCHANGE, BOOKING_CREATED_KEY);
      await this.channel.prefetch(10);

      await this.channel.consume(BOOKING_CREATED_QUEUE, async (message) => {
        if (!message || !this.channel) {
          return;
        }

        try {
          const event = JSON.parse(message.content.toString()) as BookingCreatedEvent;

          if (event.type === 'BOOKING_CREATED') {
            await this.notifications.createFromBookingEvent(event);
          }

          this.channel.ack(message);
        } catch (error) {
          console.error('[notification-service] Falha ao processar evento:', error);
          this.channel.nack(message, false, false);
        }
      });

      console.log(`[notification-service] Consumindo ${BOOKING_CREATED_QUEUE}`);
    } catch (error) {
      console.error('[notification-service] RabbitMQ indisponivel:', error);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
