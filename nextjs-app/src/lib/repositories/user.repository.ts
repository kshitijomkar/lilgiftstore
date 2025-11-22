import { BaseRepository } from './base.repository';

interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.findAll({ role });
  }
}
