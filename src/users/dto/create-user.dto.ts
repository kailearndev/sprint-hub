import { UserRole } from "@/generated/prisma/enums";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @ApiProperty({ example: 'password123' })
    password: string;
    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    role: UserRole;
    @ApiProperty({ example: 'John Doe' })
    name: string;
    @ApiProperty({ example: 'https://example.com/avatar.png' })
    @IsOptional()
    avatarUrl?: string;
}
