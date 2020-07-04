import { Context } from 'koa';

import ArticleOperationModel from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

export default () => async (ctx: Context) => {
  try {
    const end = new Date();
    const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
    const before = new Date(end.getTime() - ONE_YEAR);
    const start = new Date(`${before.getFullYear()}-${before.getMonth() + 1}-${before.getDate()} 00:00:00`);
    const aggregate = ArticleOperationModel.aggregate();
    aggregate.match({
      createdAt: {
        $gte: start,
        $lte: end,
      },
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
      weights: { $sum: '$weight' },
    });
    aggregate.sort({ _id: 1 });
    aggregate.project({
      _id: 0,
      date: '$_id.createdAt',
      heat: '$weights',
    });
    const heatmap = await aggregate.exec();
    ctx.body = new Response(ResponseStatus.OK, heatmap).body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '获取活跃度失败', err).body;
  }
};
