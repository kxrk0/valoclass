import { Router } from 'express';
import loginRouter from './login';
import registerRouter from './register';
import logoutRouter from './logout';
import refreshRouter from './refresh';
import oauthRouter from './oauth';
import statusRouter from './status';
import { adminLogin } from './admin/login';

const router = Router();

// Mount auth routes
router.use('/', loginRouter);
router.use('/', registerRouter);
router.use('/', logoutRouter);
router.use('/', refreshRouter);
router.use('/oauth', oauthRouter);
router.use('/', statusRouter);

// Admin routes
router.post('/admin/login', adminLogin);

export default router;
