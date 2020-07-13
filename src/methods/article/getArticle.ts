import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import Response, { Status as ResponseStatus } from '../../utils/Response';

export default (options = {
  isAdmin: false,
  status: (ArticleStatus.ONLINE as any),
}) => async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const query = ArticleModel.findOne();
    const conditions = {
      _id: id,
    };
    if (options.status instanceof Array) {
      Object.assign(conditions, {
        $or: options.status.map((item) => ({ status: item })),
      });
    } else {
      Object.assign(conditions, {
        status: options.status,
      });
    }
    query.setQuery(conditions);
    !options.isAdmin && query.populate({
      path: 'labels',
      select: 'label alias parent',
      populate: {
        path: 'parent',
        select: 'label alias',
      },
    });
    query.select(`title cover labels ${options.isAdmin ? 'markdown' : 'richtext'} postedAt updatedAt createdAt`);
    const article = await query.exec();
    if (article) {
      ctx.body = new Response(ResponseStatus.OK, article, '获取文章内容成功').body;
    } else {
      ctx.body = new Response(ResponseStatus.ERROR, null, '文章不存在或已被删除').body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取文章内容失败', err).body;
  }
};
