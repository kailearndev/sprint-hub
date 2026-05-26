import { Test, TestingModule } from '@nestjs/testing';
import { AuditlogService } from '@/auditlog/auditlog.service';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/shared/services/hashing.service';
import { AuthService } from './auth.service';
import { TokenService } from './services/token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: HashingService,
          useValue: {},
        },
        {
          provide: AuditlogService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
