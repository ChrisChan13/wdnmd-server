import Router from 'koa-router';

import { Status as ArticleStatus } from '../../models/article';
import getArticles from '../../methods/article/getArticles';
import getArticle from '../../methods/article/getArticle';
import addArticle from '../../methods/article/addArticle';
import updateArticle from '../../methods/article/updateArticle';
import updateArticleStatus from '../../methods/article/updateArticleStatus';

const router = new Router();

router.get('/', getArticles({ status: ArticleStatus.DRAFT })); // 查询草稿箱文章
router.get('/:id', getArticle({ status: ArticleStatus.DRAFT })); // 查询草稿箱文章内容
router.put('/', addArticle({ status: ArticleStatus.DRAFT })); // 添加草稿箱文章
router.post('/:id', updateArticle({ status: ArticleStatus.DRAFT })); // 更新草稿箱文章内容
router.post('/:id/online', updateArticleStatus({ status: ArticleStatus.ONLINE })); // 上架草稿箱文章
router.post('/:id/trash', updateArticleStatus({ status: ArticleStatus.TRASH })); // 草稿箱文章移入垃圾箱

export default router;
