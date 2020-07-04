import { Context } from 'koa';

import ArticleOperationModel from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

export default () => async (ctx: Context) => {
  try {
    const { query: filters } = ctx.request;
    const limit = filters.limit ? Math.abs(filters.limit) : 30;
    const skip = (filters.page ? Math.abs(filters.page) - 1 : 0) * limit;
    const aggregate = ArticleOperationModel.aggregate();
    aggregate.sort({
      createdAt: -1,
    });
    aggregate.skip(skip);
    aggregate.limit(limit);
    aggregate.lookup({
      from: 'articles',
      let: { article: '$article' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$article'] } } },
        { $project: { title: 1 } },
      ],
      as: 'articles',
    });
    aggregate.replaceRoot({
      $mergeObjects: [{ $arrayElemAt: ['$articles', 0] }, '$$ROOT'],
    });
    aggregate.group({
      _id: {
        createdAt: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
            timezone: 'Asia/Chongqing', // 设置时区
          },
        },
      },
      operations: {
        $push: {
          _id: '$_id', type: '$type', date: '$createdAt', article: '$article', title: '$title',
        },
      },
    });
    aggregate.project({
      _id: 0,
      date: '$_id.createdAt',
      operations: 1,
    });
    const activeness = await aggregate.exec();
    ctx.body = new Response(ResponseStatus.OK, activeness).body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取动态失败', err).body;
  }
};
