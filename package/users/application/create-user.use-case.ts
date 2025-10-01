import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User } from '../domain/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@package/users/domain/user.repository.interface';

export interface CreateUserCommand {
  email: string;
  passwordPlain: string;
  firstName: string;
  lastName: string;
}

export interface UserCreatedOutput {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(command: CreateUserCommand): Promise<UserCreatedOutput> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const newUser = await User.create(
      command.email,
      command.passwordPlain,
      command.firstName,
      command.lastName,
    );

    const savedUser = await this.userRepository.save(newUser);

    return {
      id: savedUser.getId(),
      email: savedUser.getEmail(),
      fullName: savedUser.getFullName(),
      createdAt: savedUser.getCreatedAt(),
    };
  }
}
