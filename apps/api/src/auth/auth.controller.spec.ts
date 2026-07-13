import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    generateDevToken: jest.fn().mockResolvedValue('dev-token'),
    generateTokens: jest.fn().mockReturnValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    }),
    saveRefreshToken: jest.fn().mockResolvedValue(undefined),
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

  describe('googleCallback', () => {
    interface MockRes {
      cookie: jest.Mock;
      redirect: jest.Mock;
    }

    const buildReq = (state?: string, client: object | null = {}) =>
      ({
        user: { id: 1, client },
        query: state !== undefined ? { state } : {},
      }) as never;

    const buildRes = (): MockRes => ({
      cookie: jest.fn(),
      redirect: jest.fn(),
    });

    beforeEach(() => {
      delete process.env.FRONTEND_URL;
      delete process.env.BACKOFFICE_URL;
    });

    it('redirects to the web app when state is missing', async () => {
      const res = buildRes();
      await controller.googleCallback(buildReq(), res as never);
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:5174');
    });

    it('redirects to the backoffice when state=backoffice', async () => {
      const res = buildRes();
      await controller.googleCallback(buildReq('backoffice'), res as never);
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:5175');
    });

    it('sends a web user without address to onboarding', async () => {
      const res = buildRes();
      await controller.googleCallback(buildReq(undefined, null), res as never);
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:5174/onboarding',
      );
    });

    it('sets the auth cookies before redirecting', async () => {
      const res = buildRes();
      await controller.googleCallback(buildReq('backoffice'), res as never);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(authService.saveRefreshToken).toHaveBeenCalledWith(1, 'refresh');
    });
  });
});
