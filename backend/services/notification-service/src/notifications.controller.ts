import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from './auth';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(BearerAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@Req() request: any) {
    return this.notifications.listForUser(request.auth.userId);
  }

  @Get('unread-count')
  async unreadCount(@Req() request: any) {
    const unread = await this.notifications.unreadCount(request.auth.userId);
    return { unread };
  }

  @Patch(':id/read')
  markAsRead(@Req() request: any, @Param('id') id: string) {
    return this.notifications.markAsRead(request.auth.userId, id);
  }
}
