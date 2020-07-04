import Router from 'koa-router';

import getLabels from '../../methods/label/getLabels';

const router = new Router();

router.get('/', getLabels()); // 查询标签列表

export default router;
