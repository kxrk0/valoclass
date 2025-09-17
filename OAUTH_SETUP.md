# OAuth Setup Guide for ValoClass

This guide will help you set up OAuth authentication with Google, Discord, and Steam for your ValoClass application.

## Environment Variables

Add the following variables to your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Steam API
STEAM_API_KEY="your-steam-api-key"

# NextAuth URL (for development)
NEXTAUTH_URL="http://localhost:3000"
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/oauth/google` (development)
   - `https://yourdomain.com/api/auth/oauth/google` (production)
7. Copy Client ID and Client Secret to your `.env.local`

## Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URIs:
   - `http://localhost:3000/api/auth/oauth/discord` (development)
   - `https://yourdomain.com/api/auth/oauth/discord` (production)
5. Copy Client ID and Client Secret to your `.env.local`

## Steam API Setup

1. Go to [Steam Web API Key](https://steamcommunity.com/dev/apikey)
2. Register for an API key
3. Copy the API key to your `.env.local`

## Database Migration

After setting up the OAuth providers, you need to update your database schema:

```bash
# Generate Prisma client
npm run db:generate

# Apply database changes
npm run db:push
```

## Testing OAuth Flow

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/login`
3. Click on any OAuth provider button
4. Complete the authentication flow
5. You should be redirected back to the homepage

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Make sure your redirect URI in the provider settings matches exactly
   - Include the protocol (http/https)

2. **"Client not found"**
   - Verify your client ID and secret are correct
   - Check for extra spaces or characters

3. **"Scope not authorized"**
   - Review the requested scopes in your provider settings

### Debug Mode

You can enable debug logging by setting:

```env
DEBUG=oauth*
```

## Security Notes

- Always use HTTPS in production
- Keep your client secrets secure and never expose them in frontend code
- Regularly rotate your API keys
- Use environment-specific redirect URIs

## Features Implemented

✅ Google OAuth 2.0 login
✅ Discord OAuth 2.0 login  
✅ Steam OpenID login
✅ Automatic user creation/linking
✅ JWT token generation
✅ Secure cookie handling
✅ CSRF protection with state parameter
✅ Error handling and logging

## Next Steps

- Set up email verification for OAuth users
- Implement account linking/unlinking
- Add user profile management
- Set up role-based access control
