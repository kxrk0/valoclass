import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

// Environment variable schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8000').transform(Number),
  
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().min(32, 'Refresh token secret must be at least 32 characters'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  
  // Riot API
  RIOT_API_KEY: z.string().min(1, 'Riot API key is required'),
  RIOT_API_BASE_URL: z.string().url().default('https://americas.api.riotgames.com'),
  RIOT_REGIONAL_URLS: z.string().default('{}'),
  
  // OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'Discord Client ID is required'),
  DISCORD_CLIENT_SECRET: z.string().min(1, 'Discord Client Secret is required'),
  
  // App Settings
  API_BASE_URL: z.string().url().default('http://localhost:8000'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  
  // File Upload
  MAX_FILE_SIZE: z.string().default('5242880').transform(Number),
  UPLOAD_DIR: z.string().default('uploads'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
    throw error;
  }
};

export const env = parseEnv();

// Type for environment variables
export type Environment = z.infer<typeof envSchema>;
