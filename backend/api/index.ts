import { Router } from 'express';
import authRouter from './auth';
import adminUsersRouter from './admin/users';
import adminReportsRouter from './admin/reports';
import adminAnalyticsRouter from './admin/analytics';
import adminSystemRouter from './admin/system';
// Import other routers as we create them
// import crosshairRouter from './crosshairs';
// import lineupRouter from './lineups';
// import statsRouter from './stats';
// import userRouter from './users';

const router = Router();

// Mount API routes
router.use('/auth', authRouter);
router.use('/admin/users', adminUsersRouter);
router.use('/admin/reports', adminReportsRouter);
router.use('/admin/analytics', adminAnalyticsRouter);
router.use('/admin/system', adminSystemRouter);
// router.use('/crosshairs', crosshairRouter);
// router.use('/lineups', lineupRouter);
// router.use('/stats', statsRouter);
// router.use('/users', userRouter);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'ValorantGuides Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      admin: {
        users: '/api/admin/users',
        reports: '/api/admin/reports',
        analytics: '/api/admin/analytics',
        system: '/api/admin/system'
      },
      // crosshairs: '/api/crosshairs',
      // lineups: '/api/lineups',
      // stats: '/api/stats',
      // users: '/api/users',
    }
  });
});

export default router;
