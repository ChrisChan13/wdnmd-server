import Router from 'koa-router';

import articleRouter from './article';
import draftRouter from './draft';
import trashRouter from './trash';
import labelRouter from './label';
import getDailyActiveness from '../../methods/operation/getDailyActiveness';

const router = new Router();

router.get('/activiness', getDailyActiveness()); // 查询动态

router.use('/articles', articleRouter.routes());
router.use('/drafts', draftRouter.routes());
router.use('/trashes', trashRouter.routes());
router.use('/labels', labelRouter.routes());

export default router;
