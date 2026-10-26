import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    MinLength,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiPropertyOptional({
        example: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        description: "URL to the user's avatar image",
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({
        example: 'John',
        description: "User's first name",
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiPropertyOptional({
        example: 'Doe',
        description: "User's last name",
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'Unique username (between 3 and 20 characters)',
        minLength: 3,
        maxLength: 20,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Unique user email address',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User account password (minimum 8 characters)',
        minLength: 8,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({
        example: '1995-05-15',
        description: "User's date of birth in YYYY-MM-DD format",
    })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiPropertyOptional({
        example: '+966501234567',
        description: "User's contact phone number",
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}