# ValoClass Backend

Modern, secure, and scalable backend API for ValoClass - Valorant community platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **Rate Limiting**: Configurable rate limiting for API endpoints
- **Security**: Helmet, CORS, input validation, password hashing
- **Database**: PostgreSQL with Prisma ORM
- **Logging**: Structured logging with different levels
- **Environment-based Configuration**: Type-safe environment variables
- **Cookie-based Sessions**: Secure HTTP-only cookies
- **Role-based Access Control**: User, Moderator, Admin roles

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jose library)
- **Validation**: Zod
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Development**: tsx, TypeScript, ESLint

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   Edit `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/valoclass_db"
   
   # JWT Secrets (Generate secure random strings)
   JWT_SECRET="your-super-secret-jwt-key-here"
   REFRESH_TOKEN_SECRET="your-refresh-token-secret-here"
   
   # App Settings
   NODE_ENV="development"
   PORT=8000
   API_BASE_URL="http://localhost:8000"
   FRONTEND_URL="http://localhost:3000"
   
   # Optional: Riot API
   RIOT_API_KEY="your-riot-api-key-here"
   ```

5. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # (Optional) Seed database
   npm run db:seed
   ```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

### Development Tools
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
npm run test:watch
npm run test:coverage
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Application health status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### API Info
- `GET /api/` - API information and available endpoints

## 🔒 Security Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Secure HTTP-only cookies
- Token expiration and refresh mechanism
- Password hashing with bcrypt

### Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- API: 100 requests per minute per IP
- Strict: 10 requests per minute per IP

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention with Prisma

### Authorization
- Role-based access control (User, Moderator, Admin)
- Route-level authorization middleware
- Resource-level permissions

## 🏗️ Project Structure

```
backend/
├── api/                 # API routes
│   ├── auth/           # Authentication routes
│   └── index.ts        # Main API router
├── config/             # Configuration files
│   ├── cors.ts         # CORS configuration
│   ├── database.ts     # Database connection
│   └── env.ts          # Environment validation
├── lib/                # Core utilities
│   ├── auth.ts         # Authentication service
│   ├── logger.ts       # Logging utility
│   ├── middleware.ts   # Express middleware
│   └── prisma.ts       # Prisma client
├── prisma/             # Database schema and migrations
├── services/           # External services
├── types/              # TypeScript type definitions
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── index.ts           # Application entry point
```

## 🔧 Configuration

### Environment Variables
All environment variables are validated using Zod schemas. See `config/env.ts` for all available options.

### Database
The application uses PostgreSQL with Prisma ORM. Schema is defined in `prisma/schema.prisma`.

### CORS
CORS is configured in `config/cors.ts` with allowlist for trusted origins.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Logging

The application uses structured logging with different levels:
- `error`: Error conditions
- `warn`: Warning conditions  
- `info`: Informational messages
- `debug`: Debug information (development only)

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure production CORS origins

### Database Migration
```bash
npm run db:migrate
```

### Build and Start
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
