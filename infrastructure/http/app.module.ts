import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { UsersModule } from '@package/users/user.module';
import { SecurityModule } from '@infra/security/security.module';
import { AuthModule } from '@package/auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, SecurityModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
