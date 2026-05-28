import { UserRole, UserStatus } from '@/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({ enum: UserRole, required: false, example: UserRole.USER })
  role?: UserRole;

  @IsOptional()
  @ApiProperty({
    enum: UserStatus,
    required: false,
    example: UserStatus.ACTIVE,
  })
  status?: UserStatus;
}
