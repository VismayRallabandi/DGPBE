import { Body, Controller, Post} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
     
    const email =  loginDto.email; // Debugging
    const password = loginDto.password;

      // Validate the user's credentials (mock example here)
      const isValidUser = await this.authService.isValidUser(email, password);
      if (!isValidUser) {
          throw new Error('Invalid credentials');
      }
      const { role, building_name } = await this.authService.getInfo(email);
      // Generate a JWT token
      const token = await this.authService.sign(email);
      await this.authService.addAuthKeyToUser(email, token);
      return {
        data: {
          role,
          building_name,
          token,
        },
        message: 'User logged in successfully',
      };

}}