import { UserRole } from '@/generated/prisma/enums';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Roles } from 'common/decorators/roles.decorator';
import { AuditlogService } from './auditlog.service';
import { AuditlogQueryDto } from './dto/auditlog.query.dto';

@Roles(UserRole.SUPER_ADMIN)
@Controller('audit-logs')
export class AuditlogController {
  constructor(private readonly auditlogService: AuditlogService) { }

  @Get()
  findAll(@Query() query: AuditlogQueryDto) {
    return this.auditlogService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditlogService.findOne(id);
  }
}
