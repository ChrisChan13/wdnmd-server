import Router from 'koa-router';

import { Status as ArticleStatus } from '../../models/article';
import getArticles from '../../methods/article/getArticles';
import getArticle from '../../methods/article/getArticle';
import deleteArticle from '../../methods/article/deleteArticle';
import updateArticleStatus from '../../methods/article/updateArticleStatus';

const router = new Router();

router.get('/', getArticles({ status: ArticleStatus.TRASH })); // 查询垃圾箱文章
router.get('/:id', getArticle({ isAdmin: true, status: ArticleStatus.TRASH })); // 查询垃圾箱文章内容
router.post('/:id/draft', updateArticleStatus({ status: ArticleStatus.DRAFT })); // 恢复垃圾箱文章为草稿
router.del('/:id', deleteArticle()); // 永久删除垃圾箱文章

export default router;
