import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

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
            dateOfBirth: registerDto.dateOfBirth,
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

    async login(loginDto: LoginDto) {
        const user = await this.userModel.findOne({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = {
            userId: user.id,
            role: user.role,
        };

        return {
            token: this.jwtService.sign(payload),
            role: user.role,
        };
    }
}