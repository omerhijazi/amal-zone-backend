import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userModel.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.userModel.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            username: registerDto.username,
            email: registerDto.email,
            password: hashedPassword,
            birthOfDate: registerDto.birthOfDate,
            phoneNumber: registerDto.phoneNumber,
            avatar: registerDto.avatar,
        });

        const payload = {
            userId: user.id,
            role: user.role,
            isSellerApproved: false,
        };

        return {
            token: this.jwtService.sign(payload),
            role: user.role,
        };
    }

    async login(loginDto: any) {
        // to be implemented
    }
}