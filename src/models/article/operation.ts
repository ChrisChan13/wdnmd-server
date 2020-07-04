import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import { Article } from './index';

// 操作类型
export enum Types {
  TRASHED = '-3', // 移入垃圾箱
  OFFLINE = '-2', // 下架
  DRAFTED = '-1', // 保存草稿
  POSTED = '0', // 发布文章
  UPDATED = '1', // 更新
  ONLINE = '2', // 上架
  RESTORED = '3', // 恢复文章
}

// 操作权重
export const WEIGHTS = new Map([
  [Types.DRAFTED, 0.05],
  [Types.UPDATED, 0.25],
  [Types.POSTED, 1],
  [Types.TRASHED, 0],
  [Types.OFFLINE, 0],
  [Types.ONLINE, 0],
  [Types.RESTORED, 0],
]);

@modelOptions({
  schemaOptions: { timestamps: true, versionKey: false },
  options: { customName: 'article_operation' },
})
export class ArticleOpearion {
  @prop({ enum: Types, type: String })
  type!: Types; // 操作类型

  @prop({ ref: 'article' })
  article: Ref<Article>; // 操作文章

  @prop()
  weight!: Number; // 操作权重
}

const ArticleOpearionModel = getModelForClass(ArticleOpearion);

export default ArticleOpearionModel;
