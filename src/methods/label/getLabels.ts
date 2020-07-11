import { Context } from 'koa';

import Response, { Status as ResponseStatus } from '../../utils/Response';
import ArticleLabelModel, { Status as LabelStatus } from '../../models/article/label';

export default (options = {
  isAdmin: false,
}) => async (ctx: Context) => {
  try {
    const conditions = {};
    const query = ArticleLabelModel.find();
    if (options.isAdmin) {
      query.populate('parent', 'label');
    } else {
      Object.assign(conditions, {
        status: LabelStatus.ONLINE,
      });
      query.setQuery(conditions);
      query.select('label alias parent');
    }
    const labels = await query.exec();
    ctx.body = new Response(ResponseStatus.OK, labels, '获取标签列表成功').body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取标签列表失败', err).body;
  }
};
