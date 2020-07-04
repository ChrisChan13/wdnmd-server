import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import ArticleOperationModel, { Types as OperationTypes } from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

const TYPES = new Map([
  [ArticleStatus.DRAFT, OperationTypes.DRAFTED],
  [ArticleStatus.ONLINE, OperationTypes.POSTED],
]);

export default (
  options = { status: ArticleStatus.ONLINE },
) => async (ctx: Context) => {
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
    const type = TYPES.get(article.status);
    const articleOperation = new ArticleOperationModel({
      article: article._id,
      type,
    });
    await articleOperation.save();
    ctx.body = new Response(ResponseStatus.OK, { article: article._id }).body;
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '添加文章失败', err).body;
  }
};
