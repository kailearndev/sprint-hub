import { Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';

@Injectable()
export class AuthService {
    constructor(private readonly tokenService: TokenService) { }
}
