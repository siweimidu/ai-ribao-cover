/* 启动工作室：node tools/serve.mjs [port] */
import { createServer } from './server.mjs';
import { exec } from 'node:child_process';

const startPort = Number(process.argv[2] || 7788);
const server = createServer();

let port = startPort;
let tries = 0;

function listen() {
  server.listen(port, '127.0.0.1', () => {
    const url = 'http://127.0.0.1:' + port + '/';
    console.log('');
    console.log('  AI Daily Cover Studio / AI 日报封面工作室');
    console.log('  ' + url);
    console.log('  out/ 出图目录  ·  Ctrl+C 或关闭窗口停止');
    console.log('');
    if (!process.env.COVER_NO_OPEN) exec('cmd /c start "" "' + url + '"', () => { });
  });
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE' && tries < 12) {
    tries++;
    port++;
    console.log('  端口 ' + (port - 1) + ' 被占用，改用 ' + port);
    setTimeout(listen, 60);
    return;
  }
  console.error('启动失败：', e.message);
  process.exit(1);
});

listen();
