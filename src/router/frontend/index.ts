import Router from 'koa-router';

import Response, { Status as ResponseStatus } from '../../utils/Response';
import articleRouter from './article';
import labelRouter from './label';
import profile from '../../profile';
import getHeatmap from '../../methods/operation/getHeatmap';

const router = new Router();

router.get('/profile', (ctx) => { // 查询个人资料
  ctx.body = new Response(ResponseStatus.OK, profile).body;
});
router.get('/heatmap', getHeatmap()); // 查询活跃度

router.use('/articles', articleRouter.routes());
router.use('/labels', labelRouter.routes());

export default router;
