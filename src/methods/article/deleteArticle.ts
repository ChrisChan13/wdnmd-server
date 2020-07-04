import { Context } from 'koa';

import Response, { Status as ResponseStatus } from '../../utils/Response';
import ArticleModel from '../../models/article';
import ArticleOperationModel from '../../models/article/operation';

export default () => async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const article = await ArticleModel.findByIdAndDelete({
      _id: id,
    });
    if (article) {
      await ArticleOperationModel.deleteMany({ article: id });
      ctx.body = new Response(ResponseStatus.OK).body;
    } else {
      ctx.body = new Response(ResponseStatus.ERROR, null, '删除文章失败').body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '删除文章失败', err).body;
  }
};
