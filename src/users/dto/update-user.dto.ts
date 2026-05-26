import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from "@/generated/prisma/enums";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    role: UserRole;
    @ApiProperty({ example: 'John Doe' })
    name: string;
    @ApiProperty({ example: 'https://example.com/avatar.png' })
    @IsOptional()
    avatarUrl?: string;
}