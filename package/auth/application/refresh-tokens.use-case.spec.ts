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

const mockUserRepository: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockJwtService: jest.Mocked<JwtService> = {
  verifyAsync: jest.fn(),
  signAsync: jest.fn(),
} as any;

const mockGenerateTokenPairUseCase: jest.Mocked<GenerateTokenPairUseCase> = {
  execute: jest.fn(),
} as any;

describe('RefreshTokensUseCase', () => {
  let useCase: RefreshTokensUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensUseCase,
        { provide: USER_REPOSITORY_TOKEN, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: GenerateTokenPairUseCase, useValue: mockGenerateTokenPairUseCase },
      ],
    }).compile();

    useCase = module.get<RefreshTokensUseCase>(RefreshTokensUseCase);
    userRepository = module.get(USER_REPOSITORY_TOKEN);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  const mockUser = { getId: () => 'mock-user-id', getEmail: () => 'test@chimera.com' } as User;
  const mockTokenPair = {
    accessToken: 'new.access.token',
    refreshToken: 'new.refresh.token',
    accessTokenExpiresIn: '1h',
  };

  it('should successfully generate new token pair if refresh token is valid', async () => {
    const command: RefreshTokenCommand = { refreshToken: 'valid.refresh.token' };

    jwtService.verifyAsync.mockResolvedValue({ sub: 'mock-user-id', email: 'test@chimera.com' });

    userRepository.findById.mockResolvedValue(mockUser);

    mockGenerateTokenPairUseCase.execute.mockResolvedValue(mockTokenPair);

    const result = await useCase.execute(command);

    expect(result).toEqual(mockTokenPair);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(command.refreshToken);
    expect(userRepository.findById).toHaveBeenCalledWith('mock-user-id');
    expect(mockGenerateTokenPairUseCase.execute).toHaveBeenCalledWith(mockUser);
  });

  it('should throw UnauthorizedException if refresh token is invalid or expired', async () => {
    const command: RefreshTokenCommand = { refreshToken: 'expired-token' };

    jwtService.verifyAsync.mockRejectedValue(new Error('Jwt expired'));

    await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedException);

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(mockGenerateTokenPairUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is not found for given token', async () => {
    const command: RefreshTokenCommand = { refreshToken: 'token.for.ghost' };

    jwtService.verifyAsync.mockResolvedValue({ sub: 'ghost-id', email: 'ghost@chimera.com' });
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedException);

    expect(jwtService.verifyAsync).toHaveBeenCalled();
    expect(userRepository.findById).toHaveBeenCalledWith('ghost-id');
    expect(mockGenerateTokenPairUseCase.execute).not.toHaveBeenCalled();
  });
});
