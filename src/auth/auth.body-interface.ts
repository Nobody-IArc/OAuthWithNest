import { Request } from 'express';
import { User } from '../user/user.entity';

// User 에서 'password' 를 제외한 값을 가져오기 위한 인터페이스
export interface RequestWithUser extends Request {
  user?: Omit<User, 'password'>;
}

