/* 逐套真实渲染（16:9 + 两行长标题，最严苛的内容），截图存档 */
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

const C = { title: 'GLM 5.3 灰度推送\n模型价格战开打',
  sub: '图表数据：GLM 5.3 灰度推送 模型价格战开打 冲刺 3.5 万亿参数',
  kicker: '2026.10.28 · 第 561 期 · 22 条', series: '白鸦 · AI 日报',
  foot: 'AI 前沿速览 · 每日 18:00 更新 · 参考 22 条', date: '2026.10.28',
  icon: 'DeepSeek/DeepSeek#symbol-color' };

const ids = JSON.parse(await page.evaluate('JSON.stringify(CV.STYLES.map(function(s){return s.id}))'));
fs.mkdirSync('out/look', { recursive: true });
await page.evaluate("App.setRatio('169')");
await new Promise(r => setTimeout(r, 400));
for (const id of ids) {
  await page.evaluate(async function (a) {
    await document.fonts.ready;
    App.recompose({ style: a.id, content: a.c });
    await new Promise(function (r) { setTimeout(r, 320); });
  }, { id, c: C });
  await new Promise(r => setTimeout(r, 320));
  const el = await page.$('#cover .cv');
  await el.screenshot({ path: 'out/look/' + id + '.png' });
}
console.log('shot 完成 ' + ids.length + ' 套');
console.log('ERRS ' + JSON.stringify(errs.slice(0, 5)));
await browser.close();
server.close();
process.exit(0);
