import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase, CreateUserCommand } from './create-user.use-case';
import { IUserRepository } from '@package/users/domain/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from '@package/users/domain/user.repository.interface';
import { User } from '@package/users/domain/user.entity';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(USER_REPOSITORY_TOKEN);

    jest.clearAllMocks();
  });

  it('should successfully create and save a new user if email is unique', async () => {
    const command: CreateUserCommand = {
      email: 'newuser@chimera.com',
      passwordPlain: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    };
    userRepository.findByEmail.mockResolvedValue(null);

    const mockUser = await User.create(
      command.email,
      command.passwordPlain,
      command.firstName,
      command.lastName,
      'mock-id-123',
    );
    userRepository.save.mockResolvedValue(mockUser);

    const result = await useCase.execute(command);

    expect(result.email).toBe(command.email);
    expect(result).toHaveProperty('id');
    expect(result.fullName).toBe('Test User');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(command.email);
    expect(userRepository.save).toHaveBeenCalledTimes(1);

    const savedUser = userRepository.save.mock.calls[0][0];
    expect(savedUser instanceof User).toBe(true);
    expect(await savedUser.comparePassword('Password123')).toBe(true);
  });

  it('shold throw ConflictException if user with email already exists', async () => {
    const command: CreateUserCommand = {
      email: 'existing@chimera.com',
      passwordPlain: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const existingUser = await (User as any).reconstructFromDB(
      'id-existente',
      command.email,
      'hash-mock',
      command.firstName,
      command.lastName,
      new Date(),
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(command)).rejects.toThrow(ConflictException);

    expect(userRepository.save).not.toHaveBeenCalled();
    expect(userRepository.findByEmail).toHaveBeenCalledWith(command.email);
  });
});
