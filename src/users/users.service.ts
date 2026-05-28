import { AuditlogService } from '@/auditlog/auditlog.service';
import { AuditAction, UserRole, UserStatus } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/shared/services/hashing.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { paginate } from 'common/pagination/paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user.query.dto';

type AuditRequestContext = {
  actorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashingService,
    private readonly auditlogService: AuditlogService,
  ) { }

  async create(
    createUserDto: CreateUserDto,
    auditContext?: AuditRequestContext,
  ) {
    await this.ensureUserNotExists(createUserDto.email);
    const hashedPassword = await this.hashService.hash(
      createUserDto.password || 'user_123_password',
    );
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    await this.auditlogService.create({
      action: AuditAction.USER_CREATE,
      entity: 'User',
      entityId: user.id,
      actorId: auditContext?.actorId,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: {
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
    return {
      message: 'User created successfully',
    };
  }

  async findAll(query: UserQueryDto, currentRole: UserRole) {
    const isSuperAdmin = currentRole === UserRole.SUPER_ADMIN;

    const where = {
      ...(!isSuperAdmin && {
        deletedAt: null,
      }),

      ...(query.role && {
        role: query.role,
      }),

      ...(query.status && {
        status: query.status,
      }),

      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            email: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    return paginate(this.prisma.user, query, {
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ...(isSuperAdmin && {
          deletedAt: true,
        }),
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    auditContext?: AuditRequestContext,
  ) {
    await this.ensureUserExists(id);
    await this.ensureUserNotExists(updateUserDto.email || '');
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.auditlogService.create({
      action: AuditAction.USER_UPDATE,
      entity: 'User',
      entityId: user.id,
      actorId: auditContext?.actorId,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: {
        changedFields: Object.keys(updateUserDto),
      },
    });
    return {
      message: 'User updated successfully',
    };
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateProfileDto,
    auditContext?: AuditRequestContext,
  ) {
    await this.ensureUserExists(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.auditlogService.create({
      action: AuditAction.USER_UPDATE,
      entity: 'User',
      entityId: user.id,
      actorId: auditContext?.actorId,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: {
        changedFields: Object.keys(updateUserDto),
      },
    });

    return user;
  }

  async remove(id: string, auditContext?: AuditRequestContext) {
    await this.ensureUserExists(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: UserStatus.BANNED,
      },
    });
    await this.auditlogService.create({
      action: AuditAction.USER_DELETE,
      entity: 'User',
      entityId: user.id,
      actorId: auditContext?.actorId,
      ipAddress: auditContext?.ipAddress,
      userAgent: auditContext?.userAgent,
      metadata: {
        email: user.email,
        status: user.status,
      },
    });
    return {
      message: 'User deleted successfully',
    };
  }

  private async ensureUserNotExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
  private async ensureUserExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
