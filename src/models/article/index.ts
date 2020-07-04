import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';

import { ArticleLabel } from './label';

// 文章状态
export enum Status {
  TRASH = '-2', // 垃圾箱
  DRAFT = '-1', // 草稿箱
  OFFLINE = '0', // 下架
  ONLINE = '1', // 上架
}

@modelOptions({
  schemaOptions: { timestamps: true, versionKey: false },
  options: { customName: 'article' },
})
export class Article {
  @prop({ enum: Status, type: String, default: Status.DRAFT })
  status!: Status; // 文章状态

  @prop({ trim: true, required: [true, '文章标题不能为空'] })
  title!: string; // 文章标题

  @prop({ ref: 'article_label' })
  labels!: Ref<ArticleLabel>[]; // 文章标签

  @prop()
  cover?: string; // 文章封面

  @prop({ required: [true, '文章内容不能为空'] })
  markdown!: string; // 文章 markdown 内容

  @prop({ required: [true, '文章内容不能为空'] })
  richtext!: string; // 文章 richtext 内容

  @prop()
  postedAt?: Date; // 文章发布时间
}

const ArticleModel = getModelForClass(Article);

export default ArticleModel;
