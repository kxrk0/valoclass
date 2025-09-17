// This file MUST be imported first before any other imports
// It sets up environment variables for the application

console.log('🔧 Setting up environment variables...');

// Set environment variables directly for development
// Using mock PostgreSQL URL (database connection will fail but server will still run)
process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/valoclass_dev";
process.env.JWT_SECRET = "valoclass-super-secret-jwt-key-development-only-change-in-production-123456789";
process.env.REFRESH_TOKEN_SECRET = "valoclass-refresh-token-secret-development-only-change-in-production-987654321";
process.env.NODE_ENV = "development";
process.env.PORT = "8000";
process.env.API_BASE_URL = "http://localhost:8000";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:3000";

// Riot API Configuration
process.env.RIOT_API_KEY = "RGAPI-c8b0dfbe-aab0-470b-911e-ce40139d7d5e";
process.env.RIOT_API_BASE_URL = "https://americas.api.riotgames.com";
process.env.RIOT_REGIONAL_URLS = JSON.stringify({
  "na1": "https://na1.api.riotgames.com",
  "euw1": "https://euw1.api.riotgames.com", 
  "kr": "https://kr.api.riotgames.com",
  "br1": "https://br1.api.riotgames.com",
  "la1": "https://la1.api.riotgames.com",
  "la2": "https://la2.api.riotgames.com",
  "oc1": "https://oc1.api.riotgames.com",
  "tr1": "https://tr1.api.riotgames.com",
  "ru": "https://ru.api.riotgames.com",
  "jp1": "https://jp1.api.riotgames.com",
  "eune1": "https://eune1.api.riotgames.com"
});
process.env.JWT_EXPIRES_IN = "7d";
process.env.REFRESH_TOKEN_EXPIRES_IN = "30d";
process.env.MAX_FILE_SIZE = "5242880";
process.env.UPLOAD_DIR = "uploads";
process.env.RATE_LIMIT_WINDOW_MS = "900000";
process.env.RATE_LIMIT_MAX_REQUESTS = "100";

console.log('✅ Environment variables configured successfully');

// Try to load from .env file as well (as backup)
try {
  const { config } = require('dotenv');
  const result = config();
  if (!result.error) {
    console.log('📁 Additional .env file loaded');
  }
} catch (error) {
  console.log('⚠️ .env file not found, using defaults');
}
