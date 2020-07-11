import { Context } from 'koa';
import Response, { Status as ResponseStatus } from '../../utils/Response';
import ArticleLabelModel from '../../models/article/label';

export default () => async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { body: labelData } = ctx.request;
    delete labelData.status;
    delete labelData._id;
    delete labelData.createdAt;
    !labelData.parent && Object.assign(labelData, {
      $unset: {
        parent: 1,
      },
    });
    const updated = await ArticleLabelModel.updateOne({ _id: id }, labelData);
    if (updated.nModified !== 1) {
      ctx.body = new Response(ResponseStatus.ERROR, null, '更新标签失败').body;
    } else {
      ctx.body = new Response(ResponseStatus.OK, null, '更新标签成功').body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '更新标签失败', err).body;
  }
};
