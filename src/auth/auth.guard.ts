import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestWithUser } from './auth.body-interface';
import { AuthGuard as AGuard } from '@nestjs/passport';

@Injectable() // Provider
export class AuthGuard implements CanActivate {
  // ^ CanActive Interface
  // 생성자
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (request.cookies['login']) {
      return true;
    }

    const { email, password } = request.body;
    if (!email || !password) {
      return false;
    }

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}

// 로컬 인증 가드
@Injectable()
export class LocalAuthGuard extends AGuard('local') {
  async canActive(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}

@Injectable()
export class AuthenticateGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}

// 구글 인증 가드
@Injectable()
export class GoogleAuthGuard extends AGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request); // 세션 적용
    return result;
  }
}
