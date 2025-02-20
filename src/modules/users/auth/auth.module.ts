import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthKey } from './entity/auth-key.entity';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthKey])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
