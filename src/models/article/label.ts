import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';

// 标签状态
export enum Status {
  OFFLINE = '0', // 下架
  ONLINE = '1', // 上架
}

@modelOptions({
  schemaOptions: { timestamps: true, versionKey: false },
  options: { customName: 'article_label' },
})
export class ArticleLabel {
  @prop({ enum: Status, type: String, default: Status.ONLINE })
  status!: Status; // 标签状态

  @prop({ ref: 'article_label' })
  parent?: Ref<ArticleLabel>; // 父标签

  @prop({ trim: true, required: [true, '标签内容不能为空'] })
  label!: string; // 标签内容

  @prop({ trim: true, required: [true, '标签别名不能为空'] })
  alias!: string; // 标签别名
}

const ArticleLabelModel = getModelForClass(ArticleLabel);

/**
 * 获取所传标签的所有子孙标签
 * @param id 标签id
 * @returns 包括所传标签自身的所有子孙标签数组
 */
export const getChildrenLabels = async (id: string) => {
  const labels = await ArticleLabelModel.find({
    parent: id,
  }, '_id');
  const children: Array<any> = await Promise.all(
    labels.map((label) => getChildrenLabels(label._id)),
  );
  children.unshift(id);
  const filter = children.join().split(','); // 数组扁平化
  return filter;
};

export default ArticleLabelModel;
