import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SharedModule } from '@/shared/shared.module';
import { AuditlogModule } from '@/auditlog/auditlog.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SharedModule, AuditlogModule],
})
export class UsersModule { }
