import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import ArticleOperationModel, { Types as OperationTypes, WEIGHTS } from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

const ACTIONS = new Map([
  [ArticleStatus.TRASH, { text: '删除', type: OperationTypes.TRASHED, weight: WEIGHTS.get(OperationTypes.TRASHED) }],
  [ArticleStatus.DRAFT, { text: '恢复', type: OperationTypes.RESTORED, weight: WEIGHTS.get(OperationTypes.RESTORED) }],
  [ArticleStatus.OFFLINE, { text: '下架', type: OperationTypes.ONLINE, weight: WEIGHTS.get(OperationTypes.ONLINE) }],
  [ArticleStatus.ONLINE, { text: '上架', type: OperationTypes.OFFLINE, weight: WEIGHTS.get(OperationTypes.OFFLINE) }],
]);

export default (
  options = { status: ArticleStatus.OFFLINE },
) => async (ctx: Context) => {
  const action = ACTIONS.get(options.status);
  try {
    const { id } = ctx.params;
    const articleData = {
      status: options.status,
    };
    articleData.status === ArticleStatus.ONLINE && Object.assign(articleData, {
      postedAt: Date.now(),
    });
    const updated = await ArticleModel.updateOne({ _id: id }, articleData);
    if (updated.nModified !== 1) {
      ctx.body = new Response(ResponseStatus.ERROR, null, `${action?.text}文章失败`).body;
    } else {
      const articleOperation = new ArticleOperationModel({
        article: id,
        type: action?.type,
        weight: action?.weight,
      });
      await articleOperation.save();
      ctx.body = new Response(ResponseStatus.OK).body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, `${action?.text}文章失败`, err).body;
  }
};
