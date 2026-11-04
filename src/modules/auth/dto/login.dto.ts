import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'fashion_seller@amalzone.com',
        description: 'User registered email address',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User account password (minimum 8 characters)',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}