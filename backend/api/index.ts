import { Router } from 'express';
import authRouter from './auth';
// Import other routers as we create them
// import crosshairRouter from './crosshairs';
// import lineupRouter from './lineups';
// import statsRouter from './stats';
// import userRouter from './users';

const router = Router();

// Mount API routes
router.use('/auth', authRouter);
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
      // crosshairs: '/api/crosshairs',
      // lineups: '/api/lineups',
      // stats: '/api/stats',
      // users: '/api/users',
    }
  });
});

export default router;
