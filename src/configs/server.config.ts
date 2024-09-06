import { registerAs } from '@nestjs/config';

export const ServerConfigName = 'server';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

export interface ServerConfig {
  environment: string;
  port: number;
  timezone: string;
  host: string;
}

export default registerAs(ServerConfigName, () => ({
  environment: process.env.ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  timezone: process.env.TZ,
  host: process.env.APP_ADDRESS,
}));


export const appConfig = {
  appPort: process.env.APP_PORT,
  appHost: process.env.APP_ADDRESS,
};
