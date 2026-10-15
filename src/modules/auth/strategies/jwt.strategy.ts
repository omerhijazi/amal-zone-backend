import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../models/user.model.js';
import { JwtPayload } from '../../../common/types/jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        @InjectModel(User) private readonly userModel: typeof User,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userModel.findOne({
            where: { id: payload.userId },
        });

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('Account has been deleted');
        }

        return payload;
    }
}