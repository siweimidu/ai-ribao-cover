/* 验证：一模型一格 + 右键深色浮层 + 拖拽落位 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1560, height: 900, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1300));
await page.click('.panel.left .tab[data-tab="icons"]');
await new Promise(r => setTimeout(r, 1000));

const tiles = await page.evaluate('document.querySelectorAll("#iconList .ictile").length');
const badges = await page.evaluate('document.querySelectorAll("#iconList .ibadge").length');
const countTxt = await page.evaluate('document.querySelector("#iconCount").textContent');
console.log('格子=' + tiles + ' 徽章=' + badges + ' 计数=' + countTxt);

// 右键第一格
const t0 = await page.$('#iconList .ictile');
const bb = await t0.boundingBox();
await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2, { button: 'right' });
await new Promise(r => setTimeout(r, 600));
const popInfo = await page.evaluate(function () {
  var p = document.querySelector('.icpop');
  if (!p) return 'no-popover';
  return JSON.stringify({
    vendor: p.querySelector('.icp-ht b').textContent,
    meta: p.querySelector('.icp-ht span').textContent,
    sections: p.querySelectorAll('.icp-sec').length,
    variants: p.querySelectorAll('.icp-i').length,
    bg: getComputedStyle(p).backgroundColor
  });
});
console.log('右键浮层 =', popInfo);
const pbox = await (await page.$('.icpop')).boundingBox();
await page.screenshot({ path: 'out/qa/_icons-popover.png', clip: { x: Math.max(0,pbox.x-8), y: Math.max(0,pbox.y-8), width: Math.min(1560,pbox.width+16), height: Math.min(900,pbox.height+16) } });
await page.keyboard.press('Escape');
await page.mouse.click(760, 500);
await new Promise(r => setTimeout(r, 300));

// 拖拽
const before = await page.evaluate('App.doc.layers.filter(function(l){return l.type==="icon"}).length');
const tb = await (await page.$('#iconList .ictile')).boundingBox();
const cvBox = await (await page.$('#cover .cv')).boundingBox();
await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
await page.mouse.down();
for (let i = 1; i <= 12; i++) {
  await page.mouse.move(tb.x + (cvBox.x + cvBox.width * 0.6 - tb.x) * i / 12, tb.y + (cvBox.y + cvBox.height * 0.5 - tb.y) * i / 12);
  await new Promise(r => setTimeout(r, 14));
}
await page.mouse.up();
await new Promise(r => setTimeout(r, 500));
const after = await page.evaluate('App.doc.layers.filter(function(l){return l.type==="icon"}).length');
console.log('拖拽 ' + before + ' -> ' + after);
await page.screenshot({ path: 'out/qa/_ui-app.png' });
console.log(after > before && popInfo !== 'no-popover' ? 'PASS' : 'FAIL');
await browser.close();
server.close();
process.exit(0);
