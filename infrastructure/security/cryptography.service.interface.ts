export interface ICryptographyService {
  hash(data: string): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}

export const CRYPTOGRAPHY_SERVICE_TOKEN = Symbol('ICryptographyService');
