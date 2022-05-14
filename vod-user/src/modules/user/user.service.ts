import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from '../auth/services/password.service';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from '../auth/services/auth.service';
import { StorageService } from '../storage/services/storage.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private passwordService: PasswordService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  async signupUser(dto: UserDto) {
    const duplicate = await this.userRepo.findOne({ where: { username: dto.username } });
    if (duplicate) throw new ConflictException('duplicate username');

    const user = new User();
    user.username = dto.username;
    user.password = await this.passwordService.toHash(dto.password);
    await this.userRepo.save(user);

    await this.storageService.createStorage({ bucket: 'testbucket' }, user.id);
    return user;
  }

  async loginUser(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('invalid username or password');

    const passwordIsValid = await this.passwordService.compare(dto.password, user.password);
    if (!passwordIsValid) throw new UnauthorizedException('invalid username or password');

    const token = this.authService.generateToken({ sub: user.id, username: user.username, isActive: user.isActive });
    return { token, user };
  }
}
