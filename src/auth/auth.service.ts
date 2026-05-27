import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '@/shared/services/hashing.service';
import { RegisterDto } from './dto/register.dto';
import { AuditAction, UserRole } from '@/generated/prisma/enums';
import { AuditlogService } from '@/auditlog/auditlog.service';

type AuditRequestContext = {
    ipAddress?: string | null;
    userAgent?: string | null;
};


@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly prismaService: PrismaService,
        private readonly hashService: HashingService,
        private readonly auditlogService: AuditlogService) { }


    // Login
    async login(loginDto: LoginDto, auditContext?: AuditRequestContext) {
        const user = await this.getUserByEmailOrThrow(loginDto.email);
        const isPasswordValid = await this.hashService.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid Username or Password');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const refreshTokenExpiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const accessToken = await this.tokenService.generateAccessToken(payload);

        const refreshToken = await this.tokenService.generateRefreshToken(payload);

        const refreshTokenHash = await this.hashService.hash(refreshToken);
        await this.prismaService.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiredAt: refreshTokenExpiredAt
            },
        });
        await this.auditlogService.create({
            action: AuditAction.AUTH_LOGIN,
            entity: 'User',
            entityId: user.id,
            actorId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            accessToken,
            refreshToken,
        }





    }

    // Registration
    async register(registerDto: RegisterDto, auditContext?: AuditRequestContext) {
        await this.ensureUserNotExists(registerDto.email);

        const passwordHash = await this.hashService.hash(registerDto.password);
        const newUser = await this.prismaService.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.username,
                password: passwordHash,
                role: UserRole.USER,
            },
        });
        await this.auditlogService.create({
            action: AuditAction.AUTH_REGISTER,
            entity: 'User',
            entityId: newUser.id,
            actorId: newUser.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: {
                email: newUser.email,
            },
        });
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        }
    }

    // Refresh Token
    async refresh(refreshToken?: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        const payload =
            await this.tokenService.verifyRefreshToken(refreshToken);

        const tokens = await this.prismaService.refreshToken.findMany({
            where: {
                userId: payload.sub,
                revokedAt: null,
                expiredAt: {
                    gt: new Date(),
                },
            },
        });

        let matchedToken: (typeof tokens)[number] | null = null;

        for (const token of tokens) {
            const isValid = await this.hashService.compare(
                refreshToken,
                token.tokenHash,
            );

            if (isValid) {
                matchedToken = token;
                break;
            }
        }

        if (!matchedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const accessToken =
            await this.tokenService.generateAccessToken({
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
            });

        return {
            accessToken,
        };
    }
    async logout(refreshToken?: string, auditContext?: AuditRequestContext) {
        if (!refreshToken) {
            return;
        }

        const payload = await this.tokenService.verifyRefreshToken(refreshToken);
        let didRevokeToken = false;

        const tokens = await this.prismaService.refreshToken.findMany({
            where: {
                userId: payload.sub,
                revokedAt: null,
            },
        });

        for (const token of tokens) {
            const isValid = await this.hashService.compare(
                refreshToken,
                token.tokenHash,
            );

            if (isValid) {
                await this.prismaService.refreshToken.update({
                    where: { id: token.id },
                    data: { revokedAt: new Date() },
                });
                didRevokeToken = true;

                break;
            }
        }
        if (didRevokeToken) {
            await this.auditlogService.create({
                action: AuditAction.AUTH_LOGOUT,
                entity: 'User',
                entityId: payload.sub,
                actorId: payload.sub,
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
            });
        }
    }

    /// Helper methods
    private async ensureUserNotExists(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
        if (user) {
            throw new ConflictException('Email already exists');
        }
        return user;

    }
    private async getUserByEmailOrThrow(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('Cannot find user with the provided email');
        }

        return user;
    }
}
