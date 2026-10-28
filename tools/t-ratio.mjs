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
await page.evaluate(function () { App.toast = function () {}; });
const ids = await page.evaluate('CV.RATIOS.map(function(r){return r.id})');
console.log('画幅数 =', ids.length);
for (const id of ids) {
  const info = await page.evaluate(function (rid) {
    App.setRatio(rid);
    var d = App.doc;
    var cv = document.querySelector('#cover .cv');
    return JSON.stringify({ w: d.w, h: d.h, ratio: d.ratio, domW: cv.offsetWidth, domH: cv.offsetHeight });
  }, id);
  const o = JSON.parse(info);
  const ok = o.w === o.domW && o.h === o.domH;
  console.log((ok ? 'ok  ' : 'BAD ') + id.padEnd(15) + info);
  const cvb = await (await page.$('#cover .cv')).boundingBox();
  await page.screenshot({ path: 'out/qa/ratio-' + id + '.png', clip: { x: cvb.x, y: cvb.y, width: Math.max(1,cvb.width), height: Math.max(1,cvb.height) } });
}
await page.evaluate('App.setRatio("land")');
await new Promise(r => setTimeout(r, 300));
await page.click('#cover .cv-text');
await new Promise(r => setTimeout(r, 300));
await page.evaluate(function () { var i = document.querySelector('#paneProps input[type=color]'); if (i) i.dataset.probe = 'A'; });
const before = await page.evaluate('!!document.querySelector("#paneProps input[type=color][data-probe=A]")');
await page.evaluate(function () {
  var i = document.querySelector('#paneProps input[type=color]');
  ['#ff0000', '#00b894', '#7b2ff7'].forEach(function (c) { i.value = c; i.dispatchEvent(new Event('input', { bubbles: true })); });
});
await new Promise(r => setTimeout(r, 300));
const after = await page.evaluate('!!document.querySelector("#paneProps input[type=color][data-probe=A]")');
const color = await page.evaluate('App.selLayer().color');
const swFirst = await page.evaluate(function () { var s = document.querySelector('#paneProps .sw-btn'); return s ? getComputedStyle(s).backgroundColor : 'none'; });
console.log('颜色控件存活 =', before && after, ' 图层色 =', color, ' 当前色块 =', swFirst);
console.log((before && after && /7b2ff7/i.test(color)) ? 'PASS 颜色可用且不重建' : 'FAIL 颜色');
await browser.close();
server.close();
process.exit(0);