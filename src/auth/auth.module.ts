import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { HashingService } from '../shared/services/hashing.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN as any || '1h',
      },
    }),
  ],
  providers: [
    AuthService,
    TokenService,

  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
