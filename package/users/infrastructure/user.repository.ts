import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@package/users/domain/user.entity';
import { IUserRepository } from '@package/users/domain/user.repository.interface';
import { UserTypeOrmEntity } from './user-typeorm.entity';

/**
 * Mapper: Converte a Entidade de Dominio (Pura) para a Entidade ORM (TypeORM)
 */
const toTypeOrmEntity = (user: User): UserTypeOrmEntity => {
  const entity = new UserTypeOrmEntity();
  entity.id = user.getId();
  entity.email = user.getEmail();
  entity.passwordHash = user.getPasswordHash();
  entity.firstName = user.getFirstName();
  entity.lastName = user.getLastName();
  entity.createdAt = user.getCreatedAt();
  entity.updatedAt = user.getUpdatedAt();
  return entity;
};

/**
 */ const toDomainEntity = (entity: UserTypeOrmEntity): User => {
  return User.reconstructFromDB(
    entity.id,
    entity.email,
    entity.passwordHash,
    entity.firstName,
    entity.lastName,
    entity.createdAt,
    entity.updatedAt,
  );
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? toDomainEntity(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    return entity ? toDomainEntity(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = toTypeOrmEntity(user);
    const result = await this.repository.save(entity);
    return toDomainEntity(result);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
