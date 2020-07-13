import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import ArticleOperationModel, { Types as OperationTypes, WEIGHTS } from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

const ACTIONS = new Map([
  [ArticleStatus.DRAFT, { text: '草稿', type: OperationTypes.DRAFTED, weight: WEIGHTS.get(OperationTypes.DRAFTED) }],
  [ArticleStatus.ONLINE, { text: '文章', type: OperationTypes.ONLINE, weight: WEIGHTS.get(OperationTypes.ONLINE) }],
]);

export default (
  options = { status: ArticleStatus.ONLINE },
) => async (ctx: Context) => {
  const action = ACTIONS.get(options.status);
  try {
    const { body: articleData } = ctx.request;
    delete articleData._id;
    Object.assign(articleData, {
      status: options.status,
    });
    articleData.status === ArticleStatus.ONLINE && Object.assign(articleData, {
      postedAt: Date.now(),
    });
    const article = new ArticleModel(articleData);
    await article.save();
    const articleOperation = new ArticleOperationModel({
      article: article._id,
      type: action?.type,
      weight: action?.weight,
    });
    await articleOperation.save();
    ctx.body = new Response(ResponseStatus.OK, { article: article._id }, `添加${action?.text}成功`).body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, `添加${action?.text}失败`, err).body;
  }
};
