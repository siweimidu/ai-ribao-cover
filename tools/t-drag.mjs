/* 真·鼠标事件验证：图标从库里拖到画布 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1560, height: 900 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1200));

await page.click('.panel.left .tab[data-tab="icons"]');
await new Promise(r => setTimeout(r, 900));

const before = await page.evaluate('App.doc.layers.filter(function(l){return l.type==="icon"}).length');
const tile = await page.$('#iconList .ictile');
if (!tile) { console.log('FAIL 找不到图标 tile'); process.exit(1); }
const tb = await tile.boundingBox();
const cvBox = await (await page.$('#cover .cv')).boundingBox();
console.log('tile', JSON.stringify(tb), 'canvas', JSON.stringify(cvBox));

const targetX = cvBox.x + cvBox.width * 0.62;
const targetY = cvBox.y + cvBox.height * 0.55;

await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
await page.mouse.down();
await new Promise(r => setTimeout(r, 60));
for (let i = 1; i <= 12; i++) {
  await page.mouse.move(tb.x + (targetX - tb.x) * i / 12, tb.y + (targetY - tb.y) * i / 12);
  await new Promise(r => setTimeout(r, 16));
}
const ghost = await page.evaluate('!!document.querySelector(".icdrag")');
await new Promise(r => setTimeout(r, 60));
await page.mouse.up();
await new Promise(r => setTimeout(r, 500));

const after = await page.evaluate('App.doc.layers.filter(function(l){return l.type==="icon"}).length');
const last = await page.evaluate('(function(){var L=App.doc.layers.filter(function(l){return l.type==="icon"});var l=L[L.length-1];return JSON.stringify({icon:l.icon,x:l.x,y:l.y,w:l.w});})()');
console.log('ghost 出现过 =', ghost);
console.log('图标层 ' + before + ' -> ' + after);
console.log('新层 =', last);
console.log(after > before ? 'PASS 拖拽落位成功' : 'FAIL 拖拽无效');

// 点击路径仍要能设主视觉
await page.click('#iconList .ictile');
await new Promise(r => setTimeout(r, 400));
const main = await page.evaluate('App.doc.layers.filter(function(l){return l.role==="icon"})[0].icon');
console.log('点击后主视觉 =', main);

await browser.close();
server.close();
process.exit(after > before ? 0 : 1);
