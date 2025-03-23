import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails } = profile;
    console.log(profile);
    console.log(accessToken);
    console.log(refreshToken);

    if (!emails) {
      throw new Error('Email is Required');
    }

    if (!name) {
      throw new Error('Name is required');
    }

    const providerId: string = id;
    const email = emails[0].value;

    return await this.userService.getUserByEmailOrSave(
      email,
      name.familyName + name.givenName,
      providerId,
    ) as User;
  }
}