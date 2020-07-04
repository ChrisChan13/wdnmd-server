import { Context } from 'koa';
import Response, { Status as ResponseStatus } from '../../utils/Response';
import ArticleLabelModel from '../../models/article/label';

export default () => async (ctx: Context) => {
  try {
    const { body: labelData } = ctx.request;
    delete labelData._id;
    const label = new ArticleLabelModel(labelData);
    await label.save();
    ctx.body = new Response(ResponseStatus.OK, { label: label._id }).body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '添加标签失败', err).body;
  }
};
