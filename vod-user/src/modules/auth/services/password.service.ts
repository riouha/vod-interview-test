import { Injectable } from '@nestjs/common';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class PasswordService {
  async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await promisify(scrypt)(password, salt, 64)) as Buffer;
    return `${buffer.toString('hex')}.${salt}`;
  }

  async compare(enteredPassword: string, truePassword: string) {
    const [hashedPasswored, salt] = truePassword.split('.');
    const buffer = (await promisify(scrypt)(enteredPassword, salt, 64)) as Buffer;
    return buffer.toString('hex') === hashedPasswored;
  }
}
