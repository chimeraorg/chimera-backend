import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { ICryptographyService } from './cryptography.service.interface';

@Injectable()
export class BCryptService implements ICryptographyService {
  private readonly SALT_ROUNDS = 10;

  async hash(data: string): Promise<string> {
    return hash(data, this.SALT_ROUNDS);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
