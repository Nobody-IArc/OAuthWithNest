import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable() // 의존성 주입 Provider
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // user 생성
  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  // user 하나 찾기
  async getUser(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  // user 수정
  async updateUser(email: string, _user: User) {
    const user = await this.getUser(email);
    if (!user) {
      throw new Error('User not exists');
    }
    console.log(user);
    user.username = _user.username;
    user.password = _user.password;
    console.log(user);
    return await this.userRepository.save(user);
  }

  // user 삭제
  async deleteUser(email: string) {
    return await this.userRepository.delete({ email });
  }

  // email 로 유저 찾기
  async getUserByEmailOrSave(email: string, username: string, providerId: any) {
    const foundUser = await this.getUser(email);

    // user 가 존재하는 경우 반환
    if (foundUser) {
      return foundUser;
    }

    // user 가 없는 경우
    return await this.userRepository.save({
      email,
      username,
      providerId,
    });
  }
}
