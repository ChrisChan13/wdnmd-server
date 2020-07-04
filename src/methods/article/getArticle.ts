import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import Response, { Status as ResponseStatus } from '../../utils/Response';

export default (
  options = { status: ArticleStatus.ONLINE },
) => async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const query = ArticleModel.findOne();
    const conditions = {
      _id: id,
      status: options.status,
    };
    query.setQuery(conditions);
    query.populate('labels', 'label alias');
    query.select('title cover labels markdown content postedAt updatedAt createdAt');
    const article = await query.exec();
    if (article) {
      ctx.body = new Response(ResponseStatus.OK, article).body;
    } else {
      ctx.body = new Response(ResponseStatus.ERROR, null, '文章不存在或已被删除').body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取文章内容失败', err).body;
  }
};
