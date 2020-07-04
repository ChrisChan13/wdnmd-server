import Router from 'koa-router';

import getArticles from '../../methods/article/getArticles';
import getArticle from '../../methods/article/getArticle';

const router = new Router();

router.get('/', getArticles()); // 查询文章列表
router.get('/:id', getArticle()); // 查询文章内容

export default router;
