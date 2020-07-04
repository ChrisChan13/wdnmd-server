import Router from 'koa-router';

import { Status as LabelStatus } from '../../models/article/label';
import getLabels from '../../methods/label/getLabels';
import getLabel from '../../methods/label/getLabel';
import addLabel from '../../methods/label/addLabel';
import updateLabel from '../../methods/label/updateLabel';
import updateLabelStatus from '../../methods/label/updateLabelStatus';

const router = new Router();

router.get('/', getLabels({ isAdmin: true })); // 查询标签列表
router.get('/:id', getLabel()); // 查询标签信息
router.put('/', addLabel()); // 添加标签
router.post('/:id', updateLabel()); // 更新标签信息
router.post('/:id/offline', updateLabelStatus()); // 下架标签
router.post('/:id/online', updateLabelStatus({ status: LabelStatus.ONLINE })); // 上架标签

export default router;
