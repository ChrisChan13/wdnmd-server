import Router from 'koa-router';

import { Status as ArticleStatus } from '../../models/article';
import getArticles from '../../methods/article/getArticles';
import getArticle from '../../methods/article/getArticle';
import addArticle from '../../methods/article/addArticle';
import updateArticle from '../../methods/article/updateArticle';
import updateArticleStatus from '../../methods/article/updateArticleStatus';

const router = new Router();

router.get('/', getArticles()); // 查询文章列表
router.get('/:id', getArticle()); // 查询文章内容
router.put('/', addArticle()); // 添加文章
router.post('/:id', updateArticle()); // 更新文章内容
router.post('/:id/offline', updateArticleStatus()); // 下架文章
router.post('/:id/online', updateArticleStatus({ status: ArticleStatus.ONLINE })); // 上架文章
router.post('/:id/trash', updateArticleStatus({ status: ArticleStatus.TRASH })); // 文章移入垃圾箱

export default router;
