import { Module } from '@nestjs/common';
import { CRYPTOGRAPHY_SERVICE_TOKEN, ICryptographyService } from './cryptography.service.interface';
import { BCryptService } from './bcrypt.service';

@Module({
  imports: [],
  providers: [
    {
      provide: CRYPTOGRAPHY_SERVICE_TOKEN,
      useClass: BCryptService,
    },
  ],
  exports: [CRYPTOGRAPHY_SERVICE_TOKEN],
})
export class SecurityModule {}
