import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { paginate } from 'common/pagination/paginate';
import { AuditlogQueryDto } from './dto/auditlog.query.dto';

type CreateAuditLogInput = {
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  actorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
};

@Injectable()
export class AuditlogService {
  constructor(private readonly prisma: PrismaService) { }

  create(input: CreateAuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        actorId: input.actorId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: input.metadata as any,
      },
    });
  }

  findAll(query: AuditlogQueryDto) {
    const where = {
      ...(query.action && { action: query.action }),
      ...(query.entity && { entity: query.entity }),
      ...(query.entityId && { entityId: query.entityId }),
      ...(query.actorId && { actorId: query.actorId }),
      ...(query.search && {
        OR: [
          {
            entity: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            entityId: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    return paginate(this.prisma.auditLog, query, {
      where,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        actorId: true,
        ipAddress: true,
        userAgent: true,
        metadata: true,
        createdAt: true,
        actor: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const auditLog = await this.prisma.auditLog.findUnique({
      where: { id },
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        actorId: true,
        ipAddress: true,
        userAgent: true,
        metadata: true,
        createdAt: true,
        actor: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!auditLog) {
      throw new NotFoundException('Audit log not found');
    }

    return auditLog;
  }
}
