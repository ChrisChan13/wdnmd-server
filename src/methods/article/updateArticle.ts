import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import ArticleOperationModel, { Types as OperationTypes } from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

const TYPES = new Map([
  [ArticleStatus.DRAFT, OperationTypes.DRAFTED],
  [ArticleStatus.ONLINE, OperationTypes.UPDATED],
]);

export default (
  options = { status: ArticleStatus.ONLINE },
) => async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { body: articleData } = ctx.request;
    delete articleData.status;
    delete articleData._id;
    delete articleData.createdAt;
    delete articleData.postedAt;
    const updated = await ArticleModel.updateOne({ _id: id }, articleData, {
      runValidators: true,
    });
    if (updated.nModified !== 1) {
      ctx.body = new Response(ResponseStatus.ERROR, null, '修改文章失败').body;
    } else {
      const articleOperation = new ArticleOperationModel({
        article: id,
        type: TYPES.get(options.status),
      });
      await articleOperation.save();
      ctx.body = new Response(ResponseStatus.OK).body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, '修改文章失败', err).body;
  }
};
