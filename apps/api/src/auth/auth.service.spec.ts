import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from './enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    user: { upsert: jest.fn() },
  };
  const jwt = { sign: jest.fn().mockReturnValue('signed-jwt') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateDevToken', () => {
    it('ensures (upserts) the dev OPERATOR user and signs the token with their real id', async () => {
      const devUser = {
        id: 42,
        email: 'dev@dev.com',
        role: Role.OPERATOR,
      };
      prisma.user.upsert.mockResolvedValue(devUser);

      const token = await service.generateDevToken();

      expect(prisma.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email: 'dev@dev.com' } }),
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 42, role: Role.OPERATOR }),
      );
      expect(token).toBe('signed-jwt');
    });
  });
});
