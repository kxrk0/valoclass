import { Router } from 'express';
import loginRouter from './login';
import registerRouter from './register';
import logoutRouter from './logout';
import refreshRouter from './refresh';
import oauthRouter from './oauth';

const router = Router();

// Mount auth routes
router.use('/', loginRouter);
router.use('/', registerRouter);
router.use('/', logoutRouter);
router.use('/', refreshRouter);
router.use('/oauth', oauthRouter);

export default router;
