import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokensUseCase, RefreshTokenCommand } from './refresh-tokens.use-case';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@package/users/domain/user.repository.interface';
import { User } from '@package/users/domain/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenPairUseCase } from './generate-token-pair.use-case';

const VALID_PAYLOAD = { sub: 'mock-user-id', email: 'test@chimera.com' };

const createMockRepository = () => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const createMockJwtService = () => ({
  verifyAsync: jest.fn(),
  signAsync: jest.fn(),
});

const createMockGenerateTokenPairUseCase = () => ({
  execute: jest.fn(),
});

describe('RefreshTokensUseCase', () => {
  let useCase: RefreshTokensUseCase;
  let userRepository: ReturnType<typeof createMockRepository>;
  let jwtService: ReturnType<typeof createMockJwtService>;
  let generateTokenPairUseCase: ReturnType<typeof createMockGenerateTokenPairUseCase>;

  const mockUser = { getId: () => VALID_PAYLOAD.sub, getEmail: () => VALID_PAYLOAD.email } as User;
  const mockTokenPair = {
    accessToken: 'new.access.token',
    refreshToken: 'new.refresh.token',
    accessTokenExpiresIn: '1h',
  };

  const command: RefreshTokenCommand = { refreshToken: 'valid.refresh.token' };

  beforeEach(async () => {
    userRepository = createMockRepository();
    jwtService = createMockJwtService();
    generateTokenPairUseCase = createMockGenerateTokenPairUseCase();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensUseCase,
        { provide: USER_REPOSITORY_TOKEN, useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
        { provide: GenerateTokenPairUseCase, useValue: generateTokenPairUseCase },
      ],
    }).compile();

    useCase = module.get<RefreshTokensUseCase>(RefreshTokensUseCase);
  });

  it('should successfully generate new token pair if refresh token is valid and user exists', async () => {
    jwtService.verifyAsync.mockResolvedValue(VALID_PAYLOAD);
    userRepository.findById.mockResolvedValue(mockUser);
    generateTokenPairUseCase.execute.mockResolvedValue(mockTokenPair);

    const result = await useCase.execute(command);

    expect(result).toEqual(mockTokenPair);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(command.refreshToken);
    expect(userRepository.findById).toHaveBeenCalledWith(VALID_PAYLOAD.sub);
    expect(generateTokenPairUseCase.execute).toHaveBeenCalledWith(mockUser);
  });

  it('should throw UnauthorizedException if JWT verification fails (e.g., expired)', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('Token signature is invalid'));

    await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedException);

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(generateTokenPairUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedExpection if user is not found based on token payload', async () => {
    jwtService.verifyAsync.mockResolvedValue(VALID_PAYLOAD);
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedException);

    expect(userRepository.findById).toHaveBeenCalledWith(VALID_PAYLOAD.sub);
    expect(generateTokenPairUseCase.execute).not.toHaveBeenCalled();
  });
});
