/* 逐套真实渲染：走 App.recompose 的真实路径，截图存档 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
import fs from 'node:fs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 900, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1600));

const C = { title: 'DeepSeekV4.1flash-1017', icon: 'DeepSeek/DeepSeek#symbol-color',
  kicker: 'AI 日报', series: '2026.10.28 · 第 561 期 · 22 条',
  sub: '冲刺 3.5 万亿参数，Codex 第 23 天重置',
  foot: 'AI 前沿速递 · 每日 18:00 更新 · 参考 22 条', date: '2026.10.28' };

const ids = JSON.parse(await page.evaluate('JSON.stringify(CV.STYLES.map(function(s){return s.id}))'));
fs.mkdirSync('out/look', { recursive: true });
for (const id of ids) {
  await page.evaluate(async function (a) {
    await document.fonts.ready;
    App.recompose({ style: a.id, ratio: '169', layout: 'hero', content: a.c });
    await new Promise(function (r) { setTimeout(r, 260); });
  }, { id, c: C });
  await new Promise(r => setTimeout(r, 260));
  const el = await page.$('#cover .cv');
  await el.screenshot({ path: 'out/look/' + id + '.png' });
  console.log('shot ' + id);
}
console.log('ERRS ' + JSON.stringify(errs.slice(0, 5)));
await browser.close();
server.close();
process.exit(0);
