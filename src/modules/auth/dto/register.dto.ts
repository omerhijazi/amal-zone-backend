import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    MinLength,
    MaxLength,
} from 'class-validator';

export class RegisterDto {
    @IsOptional()
    @IsString()
    avatar?: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}