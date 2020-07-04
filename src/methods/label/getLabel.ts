import { Context } from 'koa';

import Response, { Status as ResponseStatus } from '../../utils/Response';
import ArticleLabelModel from '../../models/article/label';

export default () => async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const label = await ArticleLabelModel.findById(id);
    if (label) {
      ctx.body = new Response(ResponseStatus.OK, label).body;
    } else {
      ctx.body = new Response(ResponseStatus.ERROR, null, '该标签不存在').body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取标签信息失败', err).body;
  }
};
