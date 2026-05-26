import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuditlogController } from './auditlog.controller';
import { AuditlogService } from './auditlog.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuditlogController],
  providers: [AuditlogService],
  exports: [AuditlogService],
})
export class AuditlogModule {}
