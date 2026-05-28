import { UserRole } from '@/generated/prisma/enums';
import type { JwtPayload } from '@/types/jwt-payload.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { Roles } from 'common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user.query.dto';
import type { Request } from 'express';

function getAuditContext(req: Request, user?: JwtPayload) {
  return {
    actorId: user?.sub,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
}
// @Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.create(createUserDto, getAuditContext(req, user));
  }

  @Get()
  findAll(@Query() query: UserQueryDto, @CurrentUser() user: JwtPayload) {
    return this.usersService.findAll(query, user?.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
      getAuditContext(req, user),
    );
  }
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.remove(id, getAuditContext(req, user));
  }
}
