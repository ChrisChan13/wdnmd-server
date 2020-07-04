import Router from 'koa-router';

import Response, { Status as ResponseStatus } from '../utils/Response';

import adminRouter from './admin';
import apiRouter from './frontend';

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = new Response(ResponseStatus.OK, 'Hello! WDNMD!').body;
});

router.use('/admin', adminRouter.routes());
router.use('/api', apiRouter.routes());

export default router;
