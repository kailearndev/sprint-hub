import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Public } from 'common/decorators/public.decorator';

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 1000,
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto, @Req() req: Request) {
        return this.authService.register(registerDto, {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });
    }
    @Public()
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken, accessToken, ...data } = await this.authService.login(loginDto, {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        return data;
    }

    @Public()
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;

        const data = await this.authService.refresh(refreshToken);

        res.cookie('accessToken', data.accessToken, accessTokenCookieOptions);

        return data;
    }
    @Public()
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;

        await this.authService.logout(refreshToken, {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refreshToken', { path: '/auth' });

        return {
            message: 'Logout successful',
        };
    }


}
