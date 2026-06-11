import { Module } from '@nestjs/common';
import { BearerAuthGuard } from './auth';
import { BookingCreatedConsumer } from './events.consumer';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from './prisma.service';
import { SoapController } from './soap.controller';

@Module({
  controllers: [NotificationsController, SoapController],
  providers: [PrismaService, NotificationsService, BookingCreatedConsumer, BearerAuthGuard],
})
export class AppModule {}
