import { UserRepository } from '@/lib/repositories/user.repository';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { APIError } from '@/lib/middleware/error-handler';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new APIError('User not found', 404);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new APIError('User not found', 404);
    }
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.getUserById(userId);

    const isValid = await verifyPassword(oldPassword, user.password);
    if (!isValid) {
      throw new APIError('Current password is incorrect', 401);
    }

    const hashedPassword = await hashPassword(newPassword);
    return this.userRepo.update(userId, { password: hashedPassword } as any);
  }

  async updateProfile(userId: string, data: any) {
    const allowedFields = ['name', 'phone', 'email'];
    const filtered = Object.keys(data)
      .filter(k => allowedFields.includes(k))
      .reduce((obj: any, k) => {
        obj[k] = data[k];
        return obj;
      }, {});

    return this.userRepo.update(userId, {
      ...filtered,
      updated_at: new Date(),
    } as any);
  }
}
