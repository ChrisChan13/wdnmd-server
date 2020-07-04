import Koa from 'koa';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';

import { SERVER } from './config';
import router from './router';

import './models';

const app = new Koa();

// 解决跨域
app.use(cors());
// 解析请求体
app.use(bodyParser());
// 挂载路由
app.use(router.routes());

app.listen(SERVER.PORT, (err?: any) => {
  if (err) console.error(err);
  else console.log(`App listen on http://0.0.0.0:${SERVER.PORT}`);
});
