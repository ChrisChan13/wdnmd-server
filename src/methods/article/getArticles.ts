import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import { getChildrenLabels } from '../../models/article/label';
import Response, { Status as ResponseStatus } from '../../utils/Response';

export default (options = {
  status: (ArticleStatus.ONLINE as any),
}) => async (ctx: Context) => {
  try {
    const { query: filters } = ctx.request;
    const query = ArticleModel.find();
    query.populate({
      path: 'labels',
      select: 'label alias parent',
      populate: {
        path: 'parent',
        select: 'label alias',
      },
    });
    const conditions: any = {};
    if (options.status instanceof Array) {
      Object.assign(conditions, {
        $or: options.status.map((item) => ({ status: item })),
      });
    } else {
      Object.assign(conditions, {
        status: options.status,
      });
    }
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
    query.select('title labels status cover postedAt updatedAt createdAt');
    query.skip(skip);
    query.limit(limit);
    conditions.status === ArticleStatus.ONLINE
      ? query.sort({ postedAt: -1 })
      : query.sort({ createdAt: -1 });
    const articles = await query.exec();
    ctx.body = new Response(ResponseStatus.OK, articles, '获取文章列表成功').body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取文章列表失败', err).body;
  }
};
