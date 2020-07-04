import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import { getChildrenLabels } from '../../models/article/label';
import Response, { Status as ResponseStatus } from '../../utils/Response';

export default (
  options = { status: ArticleStatus.ONLINE },
) => async (ctx: Context) => {
  try {
    const { query: filters } = ctx.request;
    const query = ArticleModel.find();
    query.populate('labels', 'label alias');
    const conditions = {
      status: options.status,
    };
    filters.search && Object.assign(conditions, {
      title: new RegExp(filters.search, 'i'),
    });
    filters.label && Object.assign(conditions, {
      labels: {
        $elemMatch: {
          $in: await getChildrenLabels(filters.label),
        },
      },
    });
    const limit = filters.limit ? Math.abs(filters.limit) : 10;
    const skip = (filters.page ? Math.abs(filters.page) - 1 : 0) * limit;
    query.setQuery(conditions);
    query.select('title labels cover postedAt updatedAt createdAt');
    query.skip(skip);
    query.limit(limit);
    conditions.status === ArticleStatus.ONLINE
      ? query.sort({ postedAt: -1 })
      : query.sort({ createdAt: -1 });
    const articles = await query.exec();
    ctx.body = new Response(ResponseStatus.OK, articles).body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取文章列表失败', err).body;
  }
};