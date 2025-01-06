import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthKey } from './entity/auth-key.entity'; // Adjust to your entity path
import { User } from './entity/user.entity'; // Adjust to your entity path
import { sign } from 'jsonwebtoken'; // Import the sign function from jsonwebtoken

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthKey) private authKeyRepository: Repository<AuthKey>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async sign(userId: string): Promise<string> { // Define the sign function
    const payload = { userId }; // Create a payload with the user ID
    const secret = 'your_jwt_secret'; // Replace with your actual secret
    const options = { expiresIn: '1h' }; // Set token expiration time

    return sign(payload, secret, options); // Generate and return the JWT token
  }
  async isValidUser(email: string, password: string): Promise<boolean> {
  
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return false;
    // Assuming there's a method to compare passwords in the User entity
    return user.password === password;
  }
  async addAuthKeyToUser(email: string, token: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('User:', user);
    if (!user) throw new Error('User not found');
    const authKey = new AuthKey();
    authKey.user = user;
    authKey.key = token;
    const result = await this.authKeyRepository.save(authKey);
    console.log('Auth key saved:', result);
  }
  async getInfo(email: string): Promise<{ role: string; building_name: string }> { // Define the getRole function
    const user = await this.userRepository.findOne({ where: { email }, relations: ['location'] });
     // Find the user by email
    return Promise.resolve({ role: user.role, building_name: user.location.building_name }); // Return the user's role and building name
  }
}