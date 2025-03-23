import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user') // 주소가 'user' 로 시작됨
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  async createUser(@Body() user: CreateUserDto) {
    // DTO 에서 밭은 값과 필요한 값을 매핑해서 전송
    const sendUser = Object.assign(new User(), user, { createdAt: new Date() });
    return await this.userService.createUser(sendUser);
  }

  @Get('/getUser/:email')
  async getUser(@Param('email') email: string) {
    const user = await this.userService.getUser(email);
    console.log(user);
    return user;
  }

  @Put('/update/:email')
  async updateUser(@Param('email') email: string, @Body() user: UpdateUserDto) {
    console.log(user);
    // DTO 에서 밭은 값과 기존 값(email)을 매핑해서 전송
    const sendUser = new User();
    sendUser.username = user.username;
    sendUser.password = user.password;
    sendUser.email = email;
    console.log('Changed: \n', sendUser);
    return await this.userService.updateUser(email, sendUser);
  }

  @Delete('/delete/:email')
  async deleteUser(@Param('email') email: string) {
    return await this.userService.deleteUser(email);
  }
}
