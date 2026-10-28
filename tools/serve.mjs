/* 启动工作室：node tools/serve.mjs [port] */
import { createServer } from './server.mjs';
import { exec } from 'node:child_process';

const port = Number(process.argv[2] || 7788);
const server = createServer();
server.listen(port, '127.0.0.1', () => {
  const url = 'http://127.0.0.1:' + port + '/';
  console.log('');
  console.log('  AI 日报封面工作室');
  console.log('  ' + url);
  console.log('  out/ 出图目录：' + new Date().toLocaleString());
  console.log('');
  if (!process.env.COVER_NO_OPEN) {
    exec('cmd /c start "" "' + url + '"', () => { });
  }
});
server.on('error', (e) => { console.error('启动失败：', e.message); process.exit(1); });
