import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard, LocalAuthGuard, AuthenticateGuard, GoogleAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') // 회원 가입
  async register(@Body() userDto: CreateUserDto) {
    // ^ Service 의 Validator 로 유효성 검증
    return await this.authService.register(userDto);
  }

  @Post('login') // 로그인
  async login(@Request() req: any, @Response() res: any) {
    const { email, password } = req.body;
    const userInfo = await this.authService.validateUser(email, password);

    if (userInfo) {
      res.cookie('login', JSON.stringify(userInfo), {
        httpOnly: true, // 브라우저에서 읽기 불가
        maxAge: 1000 * 60 * 60 * 24 * 7, // 밀리 초 단위
      });
    }
    return res.send({ message: 'User logged in successfully' });
  }

  @UseGuards(AuthGuard) // AuthGuard 사용
  @Post('login-en')
  loginEn(@Request() req: any, @Response() res: any) {
    if (!req.cookies['login'] && req.user) {
      res.cookie('login', JSON.stringify(req.user), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
    }
    return res.send({ message: 'User logged in successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('guard-test')
  guardTest() {
    return 'Need to be logged in';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login-session')
  loginSession(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AuthenticateGuard)
  @Get('auth-test')
  testGuardWithSession(@Request() req: any) {
    return req.user;
  }

  @Get('re-to-google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req: any) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req: any, @Response() res: any) {
    const { user } = req;
    return res.send(user);
  }
}
