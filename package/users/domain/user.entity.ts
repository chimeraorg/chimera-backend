import { hash, compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade de Domínio: User
 * Representa um usuário no CORE do negócio.
 * Contém regras e lógica de negócio (e. g., hash de senha, calidação interna).
 */
export class User {
  private id!: string;
  private email!: string;
  private passwordHash!: string;
  private firstName!: string;
  private lastName!: string;
  private createdAt!: Date;
  private updatedAt!: Date;

  public getId(): string {
    return this.id;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPasswordHash(): string {
    return this.passwordHash;
  }
  public getFirstName(): string {
    return this.firstName;
  }
  public getLastName(): string {
    return this.lastName;
  }
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public async setPassword(passwordPlain: string): Promise<void> {
    const SALT_ROUNDS = 10;
    this.passwordHash = await hash(passwordPlain, SALT_ROUNDS);
    this.updatedAt = new Date();
  }

  public async comparePassword(passwordPlain: string): Promise<boolean> {
    return compare(passwordPlain, this.passwordHash);
  }

  public updateProfile(firstName: string, lastName: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.updatedAt = new Date();
  }

  private constructor() {}

  public static async create(
    email: string,
    passwordPlain: string,
    firstName: string,
    lastName: string,
    id?: string,
  ): Promise<User> {
    const user = new User();
    user.id = id || uuidv4();
    user.email = email.toLowerCase();
    user.firstName = firstName;
    user.lastName = lastName;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await user.setPassword(passwordPlain);

    return user;
  }

  public static reconstructFromDB(
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    const user = new User();
    user.id = id;
    user.email = email;
    user.passwordHash = passwordHash;
    user.firstName = firstName;
    user.lastName = lastName;
    user.createdAt = createdAt;
    user.updatedAt = updatedAt;
    return user;
  }
}
