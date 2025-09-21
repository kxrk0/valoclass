import { PrismaClient } from '@prisma/client';
import { AnalyticsService } from '../lib/analytics';

const prisma = new PrismaClient();

/**
 * Seed script to create sample analytics data for the admin panel
 */
async function seedAnalyticsData() {
  console.log('🌱 Seeding analytics data...');

  try {
    // Create sample users if they don't exist
    const existingUsers = await prisma.user.findMany();
    
    if (existingUsers.length === 0) {
      console.log('Creating sample users...');
      
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@valoclass.com',
          username: 'admin',
          displayName: 'Admin User',
          role: 'ADMIN',
          isVerified: true,
          isActive: true,
          passwordHash: 'hashed_password_here',
        }
      });

      // Create sample regular users
      const users = [];
      for (let i = 1; i <= 50; i++) {
        const user = await prisma.user.create({
          data: {
            email: `user${i}@example.com`,
            username: `user${i}`,
            displayName: `User ${i}`,
            role: 'USER',
            isVerified: Math.random() > 0.3,
            isActive: Math.random() > 0.05,
            isPremium: Math.random() > 0.8,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          }
        });
        users.push(user);
      }

      console.log(`✅ Created ${users.length + 1} users`);
    }

    // Create sample content
    const users = await prisma.user.findMany();
    
    console.log('Creating sample content...');
    
    // Create lineups
    const agents = ['Sova', 'Viper', 'Sage', 'Killjoy', 'Cypher', 'Omen', 'Phoenix', 'Jett', 'Reyna', 'Raze'];
    const maps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus'];
    
    for (let i = 0; i < 100; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomMap = maps[Math.floor(Math.random() * maps.length)];
      
      await prisma.lineup.create({
        data: {
          title: `${randomAgent} ${randomMap} Lineup ${i + 1}`,
          description: `Advanced ${randomAgent} lineup for ${randomMap}`,
          agent: randomAgent,
          ability: 'Shock Bolt',
          map: randomMap,
          side: Math.random() > 0.5 ? 'ATTACKER' : 'DEFENDER',
          difficulty: ['EASY', 'MEDIUM', 'HARD'][Math.floor(Math.random() * 3)],
          position: {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            z: Math.random() * 100
          },
          instructions: [
            'Stand at the marked position',
            'Aim at the crosshair location',
            'Use ability'
          ],
          images: [`/images/lineup-${i + 1}.jpg`],
          createdById: randomUser.id,
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        }
      });
    }

    // Create crosshairs
    for (let i = 0; i < 50; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      await prisma.crosshair.create({
        data: {
          name: `Pro Crosshair ${i + 1}`,
          description: `Professional crosshair setup ${i + 1}`,
          shareCode: `CROSSHAIR-${Math.random().toString(36).substr(2, 9)}`,
          settings: {
            innerLines: {
              color: '#00FF00',
              opacity: 1,
              thickness: 2,
              length: 4
            },
            outerLines: {
              color: '#FFFFFF',
              opacity: 0.5,
              thickness: 1,
              length: 2
            },
            center: {
              dot: true,
              size: 2,
              color: '#FF0000'
            }
          },
          createdById: randomUser.id,
          views: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 50),
          downloads: Math.floor(Math.random() * 200),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        }
      });
    }

    console.log('✅ Created sample content');

    // Generate sample activities and analytics data
    console.log('Generating sample activities...');
    
    const now = new Date();
    const activityTypes = [
      'LOGIN', 'LOGOUT', 'LINEUP_CREATED', 'LINEUP_VIEWED', 'LINEUP_LIKED',
      'CROSSHAIR_CREATED', 'CROSSHAIR_VIEWED', 'CROSSHAIR_DOWNLOADED',
      'COMMENT_POSTED', 'USER_FOLLOWED', 'SEARCH_PERFORMED', 'API_REQUEST_MADE'
    ];

    // Generate activities for the last 7 days
    for (let day = 0; day < 7; day++) {
      const dayDate = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
      
      // Generate 50-200 activities per day
      const activitiesPerDay = 50 + Math.floor(Math.random() * 150);
      
      for (let i = 0; i < activitiesPerDay; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const activityTime = new Date(dayDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        
        await prisma.activity.create({
          data: {
            type: randomActivityType as any,
            userId: randomUser.id,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
            deviceInfo: {
              deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
              browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
              os: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'][Math.floor(Math.random() * 5)]
            },
            duration: randomActivityType === 'API_REQUEST_MADE' ? Math.floor(Math.random() * 500) + 50 : null,
            success: Math.random() > 0.05, // 95% success rate
            metadata: {
              timestamp: activityTime,
              randomData: Math.random()
            },
            createdAt: activityTime,
          }
        });
      }
    }

    console.log('✅ Generated sample activities');

    // Generate sample page views
    console.log('Generating sample page views...');
    
    const paths = [
      '/', '/lineups', '/crosshairs', '/community', '/profile',
      '/lineups/sova', '/lineups/viper', '/crosshairs/pro',
      '/user/profile', '/settings'
    ];

    for (let day = 0; day < 7; day++) {
      const dayDate = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
      const viewsPerDay = 200 + Math.floor(Math.random() * 300);
      
      for (let i = 0; i < viewsPerDay; i++) {
        const randomUser = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : null;
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        const viewTime = new Date(dayDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        
        await prisma.pageView.create({
          data: {
            userId: randomUser?.id,
            path: randomPath,
            title: `ValoClass - ${randomPath}`,
            referrer: Math.random() > 0.5 ? 'https://google.com' : null,
            sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
            browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
            os: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'][Math.floor(Math.random() * 5)],
            country: ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP', 'BR'][Math.floor(Math.random() * 8)],
            city: ['New York', 'London', 'Berlin', 'Paris', 'Toronto', 'Sydney', 'Tokyo', 'São Paulo'][Math.floor(Math.random() * 8)],
            loadTime: Math.floor(Math.random() * 2000) + 500,
            timeOnPage: Math.floor(Math.random() * 300) + 10,
            scrollDepth: Math.random() * 100,
            clicks: Math.floor(Math.random() * 10),
            viewedAt: viewTime,
          }
        });
      }
    }

    console.log('✅ Generated sample page views');

    // Generate sample error logs
    console.log('Generating sample error logs...');
    
    const errorTypes = ['ValidationError', 'DatabaseError', 'NetworkError', 'AuthenticationError', 'NotFoundError'];
    const endpoints = ['/api/auth/login', '/api/lineups', '/api/crosshairs', '/api/users', '/api/admin/users'];
    
    for (let i = 0; i < 20; i++) {
      const randomUser = Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)] : null;
      const randomErrorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const errorTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      await prisma.errorLog.create({
        data: {
          userId: randomUser?.id,
          errorType: randomErrorType,
          errorMessage: `Sample ${randomErrorType} occurred`,
          errorCode: `ERR_${Math.floor(Math.random() * 1000)}`,
          statusCode: [400, 401, 403, 404, 500, 502, 503][Math.floor(Math.random() * 7)],
          method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
          endpoint: randomEndpoint,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          stackTrace: `Error: ${randomErrorType}\n    at Function.handler\n    at /app/api/${randomEndpoint}`,
          isResolved: Math.random() > 0.3,
          resolvedAt: Math.random() > 0.3 ? new Date(errorTime.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null,
          occurredAt: errorTime,
        }
      });
    }

    console.log('✅ Generated sample error logs');

    // Generate sample system metrics
    console.log('Generating sample system metrics...');
    
    const metricTypes = ['response_time', 'memory_usage', 'cpu_usage', 'disk_usage', 'network_latency'];
    
    for (let hour = 0; hour < 24 * 7; hour++) { // Last 7 days, hourly
      const metricTime = new Date(now.getTime() - hour * 60 * 60 * 1000);
      
      for (const metricType of metricTypes) {
        let value;
        let unit;
        
        switch (metricType) {
          case 'response_time':
            value = Math.random() * 200 + 50; // 50-250ms
            unit = 'ms';
            break;
          case 'memory_usage':
            value = Math.random() * 40 + 40; // 40-80%
            unit = 'percentage';
            break;
          case 'cpu_usage':
            value = Math.random() * 60 + 20; // 20-80%
            unit = 'percentage';
            break;
          case 'disk_usage':
            value = Math.random() * 30 + 50; // 50-80%
            unit = 'percentage';
            break;
          case 'network_latency':
            value = Math.random() * 50 + 10; // 10-60ms
            unit = 'ms';
            break;
          default:
            value = Math.random() * 100;
            unit = 'unit';
        }
        
        await prisma.systemMetric.create({
          data: {
            metricType,
            value,
            unit,
            source: 'api_server',
            endpoint: metricType === 'response_time' ? '/api' : undefined,
            recordedAt: metricTime,
          }
        });
      }
    }

    console.log('✅ Generated sample system metrics');

    // Generate hourly analytics aggregations
    console.log('Generating sample analytics aggregations...');
    
    for (let hour = 0; hour < 24 * 7; hour++) { // Last 7 days, hourly
      const analyticsTime = new Date(now.getTime() - hour * 60 * 60 * 1000);
      const date = new Date(analyticsTime.getFullYear(), analyticsTime.getMonth(), analyticsTime.getDate());
      const hourOfDay = analyticsTime.getHours();
      
      await prisma.analytics.create({
        data: {
          date,
          hour: hourOfDay,
          activeUsers: Math.floor(Math.random() * 50) + 10,
          newUsers: Math.floor(Math.random() * 5),
          returningUsers: Math.floor(Math.random() * 30) + 5,
          premiumUsers: Math.floor(Math.random() * 10),
          lineupsCreated: Math.floor(Math.random() * 3),
          lineupsViewed: Math.floor(Math.random() * 50) + 20,
          lineupsLiked: Math.floor(Math.random() * 10),
          crosshairsCreated: Math.floor(Math.random() * 2),
          crosshairsViewed: Math.floor(Math.random() * 30) + 10,
          crosshairsDownloaded: Math.floor(Math.random() * 15),
          commentsPosted: Math.floor(Math.random() * 8),
          avgSessionDuration: Math.random() * 15 + 5, // 5-20 minutes
          pageViews: Math.floor(Math.random() * 100) + 50,
          uniquePageViews: Math.floor(Math.random() * 80) + 30,
          bounceRate: Math.random() * 30 + 20, // 20-50%
          apiRequests: Math.floor(Math.random() * 200) + 100,
          errors: Math.floor(Math.random() * 5),
          responseTime: Math.random() * 100 + 80, // 80-180ms
        }
      });
    }

    console.log('✅ Generated sample analytics aggregations');

    console.log('🎉 Analytics data seeding completed successfully!');
    
    // Print summary
    const summary = await Promise.all([
      prisma.user.count(),
      prisma.lineup.count(),
      prisma.crosshair.count(),
      prisma.activity.count(),
      prisma.pageView.count(),
      prisma.errorLog.count(),
      prisma.systemMetric.count(),
      prisma.analytics.count(),
    ]);

    console.log('\n📊 Database Summary:');
    console.log(`Users: ${summary[0]}`);
    console.log(`Lineups: ${summary[1]}`);
    console.log(`Crosshairs: ${summary[2]}`);
    console.log(`Activities: ${summary[3]}`);
    console.log(`Page Views: ${summary[4]}`);
    console.log(`Error Logs: ${summary[5]}`);
    console.log(`System Metrics: ${summary[6]}`);
    console.log(`Analytics Records: ${summary[7]}`);

  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedAnalyticsData();
}

export default seedAnalyticsData;
