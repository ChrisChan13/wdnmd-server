import { Context } from 'koa';

import ArticleLabelModel, { Status as LabelStatus, getChildrenLabels } from '../../models/article/label';
import Response, { Status as ResponseStatus } from '../../utils/Response';

const ACTIONS = new Map([
  [LabelStatus.OFFLINE, '下架'],
  [LabelStatus.ONLINE, '上架'],
]);

export default (
  options = { status: LabelStatus.OFFLINE },
) => async (ctx: Context) => {
  const action = ACTIONS.get(options.status);
  try {
    const { id } = ctx.params;
    const labels = await getChildrenLabels(id);
    const updated = await ArticleLabelModel.updateMany({
      _id: {
        $in: labels,
      },
    }, { status: options.status });
    if (updated.nModified < 1) {
      ctx.body = new Response(ResponseStatus.ERROR, null, `${action}标签失败`).body;
    } else {
      ctx.body = new Response(ResponseStatus.OK).body;
    }
  } catch (err) {
    ctx.body = new Response(ResponseStatus.ERROR, null, `${action}标签失败`).body;
  }
};
