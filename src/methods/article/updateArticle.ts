import { Context } from 'koa';

import ArticleModel, { Status as ArticleStatus } from '../../models/article';
import ArticleOperationModel, { Types as OperationTypes, WEIGHTS } from '../../models/article/operation';
import Response, { Status as ResponseStatus } from '../../utils/Response';

const ACTIONS = new Map([
  [ArticleStatus.DRAFT, { text: '草稿', type: OperationTypes.DRAFTED, weight: WEIGHTS.get(OperationTypes.DRAFTED) }],
  [ArticleStatus.ONLINE, { text: '文章', type: OperationTypes.UPDATED, weight: WEIGHTS.get(OperationTypes.UPDATED) }],
]);

export default (
  options = { status: ArticleStatus.ONLINE },
) => async (ctx: Context) => {
  const action = ACTIONS.get(options.status);
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
      ctx.body = new Response(ResponseStatus.ERROR, null, `修改${action?.text}失败`).body;
    } else {
      const articleOperation = new ArticleOperationModel({
        article: id,
        type: action?.type,
        weight: action?.weight,
      });
      await articleOperation.save();
      ctx.body = new Response(ResponseStatus.OK, null, `修改${action?.text}成功`).body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, `修改${action?.text}失败`, err).body;
  }
};
