# ValoClass - Valorant Community Hub
## Comprehensive Context Engineering Document

### Project Overview

ValoClass is a comprehensive Valorant community platform built with Next.js 15, TypeScript, and SCSS. It provides essential tools and features for Valorant players including lineup sharing, crosshair customization, player statistics, and community interaction.

### Tech Stack

#### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** SCSS with CSS Custom Properties
- **UI Components:** Custom components with Lucide React icons
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Animations:** Framer Motion
- **HTTP Client:** Axios

#### Backend
- **API Routes:** Next.js API Routes
- **Authentication:** JWT with HTTP-only cookies
- **Database:** Mock database implementation (ready for Prisma/PostgreSQL)
- **External APIs:** Valorant API integration
- **File Storage:** Local/CDN ready structure

#### Development Tools
- **Linting:** ESLint with Next.js config
- **Type Checking:** TypeScript strict mode
- **Package Manager:** npm
- **Build Tool:** Next.js built-in bundler

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── lineups/       # Lineup management
│   │   ├── crosshairs/    # Crosshair management
│   │   ├── stats/         # Player statistics
│   │   └── users/         # User management
│   ├── auth/              # Authentication pages
│   ├── community/         # Community features
│   ├── crosshairs/        # Crosshair builder
│   ├── lineups/           # Lineup browser
│   ├── profile/           # User profiles
│   ├── stats/             # Player statistics
│   ├── user/              # Public user profiles
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error boundary
│   ├── not-found.tsx      # 404 page
│   ├── manifest.ts        # PWA manifest
│   ├── robots.ts          # SEO robots.txt
│   └── sitemap.ts         # SEO sitemap
├── components/            # React components
│   ├── auth/              # Authentication forms
│   ├── community/         # Community features
│   ├── crosshair/         # Crosshair builder
│   ├── home/              # Homepage sections
│   ├── layout/            # Layout components
│   ├── lineup/            # Lineup components
│   ├── profile/           # Profile components
│   ├── stats/             # Statistics components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Theme management
├── data/                  # Static data
│   ├── agents.ts          # Valorant agents data
│   └── maps.ts            # Valorant maps data
├── hooks/                 # Custom React hooks
│   └── usePWA.ts          # PWA functionality
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication service
│   └── database.ts        # Database interface
├── services/              # External service integrations
│   └── valorantAPI.ts     # Valorant API client
├── styles/                # SCSS styling
│   ├── _variables.scss    # CSS custom properties
│   ├── _mixins.scss       # SCSS mixins
│   ├── components.scss    # Component styles
│   └── globals.scss       # Global styles
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types
└── utils/                 # Utility functions
    └── index.ts           # Helper functions
```

### Core Features

#### 1. Authentication System
- **JWT-based authentication** with HTTP-only cookies
- **User registration and login** with validation
- **Password hashing** using bcryptjs
- **Session management** with refresh tokens
- **Role-based access control** (user, admin, moderator)

#### 2. Lineup Management
- **Lineup creation and sharing** with detailed instructions
- **Agent and map filtering** with difficulty levels
- **Image and video support** for visual guides
- **Search and discovery** with tags and categories
- **Moderation system** for content quality

#### 3. Crosshair Builder
- **Real-time crosshair preview** with customizable settings
- **Share codes** for easy crosshair sharing
- **Public/private crosshairs** with user permissions
- **Download tracking** and popularity metrics
- **Gallery browsing** with filtering options

#### 4. Player Statistics
- **Valorant API integration** for real-time stats
- **Rank tracking** and match history
- **Player search** by Riot ID
- **Statistics caching** for performance
- **Leaderboard features** (planned)

#### 5. Community Features
- **User profiles** with customizable information
- **Follow system** for community building
- **Comment system** for content interaction
- **Rating and review** system for quality control
- **Activity feeds** and social features

#### 6. Progressive Web App
- **PWA manifest** with app icons and metadata
- **Service worker** for offline functionality
- **Install prompts** for native app experience
- **Push notifications** support
- **Background sync** capabilities

#### 7. Theme System
- **Dark/Light/System themes** with CSS custom properties
- **Smooth transitions** between themes
- **Persistent theme selection** with localStorage
- **Responsive theme switching** based on system preferences

### API Endpoints

#### Authentication
```
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
POST /api/auth/logout     # User logout
POST /api/auth/refresh    # Token refresh
```

#### Lineups
```
GET  /api/lineups         # Get lineups with filters
POST /api/lineups         # Create new lineup
GET  /api/lineups/[id]    # Get specific lineup
PUT  /api/lineups/[id]    # Update lineup
DELETE /api/lineups/[id]  # Delete lineup
```

#### Crosshairs
```
GET  /api/crosshairs      # Get crosshairs
POST /api/crosshairs      # Create crosshair
GET  /api/crosshairs?shareCode=XXXX # Get by share code
PUT  /api/crosshairs/[id] # Update crosshair
DELETE /api/crosshairs/[id] # Delete crosshair
```

#### Player Statistics
```
GET  /api/stats?gameName=X&tagLine=Y # Get player stats
POST /api/stats           # Cache player stats
```

#### Users
```
GET  /api/users/[id]      # Get user profile
PUT  /api/users/[id]      # Update user profile
GET  /api/users/[id]/lineups # Get user lineups
GET  /api/users/[id]/crosshairs # Get user crosshairs
```

### Database Schema

#### Core Entities
- **Users:** Authentication, profiles, preferences, statistics
- **Lineups:** Agent lineups with positions, instructions, media
- **Crosshairs:** Custom crosshair configurations and settings
- **Comments:** User comments on lineups and crosshairs
- **Ratings:** 5-star rating system for content quality
- **Follows:** User following relationships
- **Bookmarks:** User favorites and collections
- **Analytics:** Usage tracking and metrics

#### Relationships
- Users → Lineups (1:many)
- Users → Crosshairs (1:many)
- Users → Comments (1:many)
- Users → Follows (many:many)
- Content → Ratings (1:many)
- Content → Bookmarks (1:many)

### Performance Optimizations

#### Frontend Optimizations
- **Next.js Image optimization** with automatic WebP conversion
- **Dynamic imports** for code splitting
- **React.memo** for component memoization
- **Intersection Observer** for lazy loading
- **CSS-in-JS optimization** with SCSS compilation

#### Backend Optimizations
- **Response caching** for static content
- **Database indexing** on frequently queried fields
- **Image optimization** with sharp
- **API rate limiting** for abuse prevention
- **CDN integration** for asset delivery

#### SEO Features
- **Server-side rendering** with Next.js
- **Dynamic meta tags** for each page
- **Structured data** for rich snippets
- **XML sitemap** generation
- **Robots.txt** configuration
- **Open Graph** and Twitter Card meta tags

### Security Features

#### Authentication Security
- **Password hashing** with bcrypt and salt
- **JWT token expiration** and rotation
- **HTTP-only cookies** to prevent XSS
- **CSRF protection** with SameSite cookies
- **Rate limiting** on authentication endpoints

#### Input Validation
- **Server-side validation** for all inputs
- **XSS prevention** with input sanitization
- **SQL injection prevention** with parameterized queries
- **File upload validation** with type checking
- **Content moderation** tools for user-generated content

#### Privacy & Compliance
- **GDPR compliance** with data export/deletion
- **Privacy policy** and terms of service
- **Cookie consent** management
- **User data encryption** at rest and in transit
- **Audit logging** for security monitoring

### Deployment & DevOps

#### Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

#### Production Deployment
- **Vercel deployment** optimized for Next.js
- **Environment variables** for configuration
- **Database migrations** with version control
- **Asset optimization** and compression
- **Monitoring** with error tracking
- **Backup strategies** for data protection

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DATABASE_DIRECT_URL="postgresql://..."

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"

# External APIs
NEXT_PUBLIC_VALORANT_API="https://api.henrikdev.xyz/valorant/v1"
NEXT_PUBLIC_TRACKER_API_KEY="your-api-key"

# PWA
NEXT_PUBLIC_VAPID_KEY="your-vapid-key"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Testing Strategy

#### Unit Testing
- **Component testing** with React Testing Library
- **Utility function testing** with Jest
- **API endpoint testing** with Supertest
- **Database function testing** with test database

#### Integration Testing
- **End-to-end testing** with Playwright
- **API integration testing** with real endpoints
- **Authentication flow testing** with session management
- **Cross-browser testing** for compatibility

#### Performance Testing
- **Lighthouse audits** for web vitals
- **Load testing** for API endpoints
- **Memory leak detection** for client-side performance
- **Database query optimization** testing

### Monitoring & Analytics

#### Application Monitoring
- **Error tracking** with Sentry
- **Performance monitoring** with Web Vitals
- **Uptime monitoring** for service availability
- **Log aggregation** for debugging

#### User Analytics
- **Google Analytics 4** for user behavior
- **Custom event tracking** for feature usage
- **Conversion funnel analysis** for optimization
- **A/B testing** framework for experiments

### Future Enhancements

#### Planned Features
1. **Mobile Application** - React Native companion app
2. **Real-time Chat** - WebSocket-based messaging
3. **Tournament System** - Bracket management and scoring
4. **Coaching Platform** - Mentor-student matching
5. **AI Recommendations** - Machine learning for personalized content
6. **Voice Chat Integration** - Discord-style voice channels
7. **Screen Sharing** - Web RTC for coaching sessions
8. **Marketplace** - Paid coaching and content monetization

#### Technical Improvements
1. **Microservices Architecture** - Service decomposition
2. **GraphQL API** - Flexible data fetching
3. **Real-time Subscriptions** - Live data updates
4. **Advanced Caching** - Redis implementation
5. **CDN Integration** - Global content delivery
6. **Kubernetes Deployment** - Container orchestration
7. **CI/CD Pipeline** - Automated testing and deployment
8. **Machine Learning** - Recommendation algorithms

### Contributing Guidelines

#### Development Workflow
1. **Fork repository** and create feature branch
2. **Follow coding standards** with ESLint and Prettier
3. **Write tests** for new functionality
4. **Update documentation** for API changes
5. **Submit pull request** with detailed description

#### Code Standards
- **TypeScript strict mode** for type safety
- **Component naming** with PascalCase
- **Function naming** with camelCase
- **File organization** by feature
- **Comment documentation** for complex logic

### Support & Maintenance

#### Issue Tracking
- **GitHub Issues** for bug reports and feature requests
- **Issue templates** for structured reporting
- **Priority labeling** for triage
- **Milestone planning** for releases

#### Documentation Updates
- **API documentation** with OpenAPI/Swagger
- **Component documentation** with Storybook
- **User guides** for feature usage
- **Developer documentation** for contributors

---

This document serves as a comprehensive guide for understanding, developing, and maintaining the ValoClass platform. It should be updated regularly as the project evolves and new features are implemented.
