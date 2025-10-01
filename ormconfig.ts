import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserTypeOrmEntity } from '@package/users/infrastructure/user-typeorm.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT!, 10) || 5432,
  username: process.env.DB_USERNAME || 'chimera_user',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'chimera_db',

  entities: [UserTypeOrmEntity, 'package/**/*.entity.ts'],
  migrations: ['infrastructure/database/migrations/*.ts'],

  synchronize: false,
  logging: true,
});

export default dataSource;
