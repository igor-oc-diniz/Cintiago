import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    generateDevToken: jest.fn().mockResolvedValue('dev-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('devToken', () => {
    it('returns the token outside production', async () => {
      process.env.NODE_ENV = 'development';
      await expect(controller.devToken()).resolves.toEqual({
        token: 'dev-token',
      });
    });

    it('blocks with 404 when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production';
      await expect(controller.devToken()).rejects.toThrow(NotFoundException);
      expect(authService.generateDevToken).not.toHaveBeenCalled();
    });
  });
});
