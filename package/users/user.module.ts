import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USER_REPOSITORY_TOKEN } from './domain/user.repository.interface';

import { UserTypeOrmEntity } from './infrastructure/user-typeorm.entity';
import { UserRepository } from './infrastructure/user.repository';
import { CreateUserUseCase } from './application/create-user.use-case';
import { UsersController } from './interface/dto/users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    CreateUserUseCase,
  ],
  exports: [
    USER_REPOSITORY_TOKEN,
    TypeOrmModule.forFeature([UserTypeOrmEntity]),
    CreateUserUseCase,
  ],
})
export class UsersModule {}
