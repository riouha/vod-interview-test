import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { LoginDto } from './dtos/login.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @Post('/signup')
  async signupUser(@Body() body: UserDto) {
    return this.userService.signupUser(body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @Post('/login')
  async loginUser(@Body() body: LoginDto) {
    return this.userService.loginUser(body);
  }
}
