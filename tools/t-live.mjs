/* 验收：纸纹 / 间距滑块拖动时就实时变化 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1680, height: 1000 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1300));
let fails = 0;
const ok = (n, c, x) => { if (!c) fails++; console.log((c ? 'ok   ' : 'FAIL ') + n + (x ? '  ' + x : '')); };

// 1 纸纹：swiss 默认 fx 里没有 paper，开关打开后应被注入
await page.click('.panel.right .tab[data-tab="canvas"]');
await new Promise(r => setTimeout(r, 400));
const hasPaper = await page.evaluate("!!document.querySelector('.cv-fx.paper')");
ok('纸纹默认关闭（不注入）', !hasPaper, 'hasPaper=' + hasPaper);

// 2 拖动不透明度滑块 → 立刻改变 fx 的 opacity（不需要松手）
const r0 = JSON.parse(await page.evaluate(function () {
  var e = document.querySelector('.cv-fx.paper');
  return JSON.stringify({ op: parseFloat(getComputedStyle(e).opacity), size: getComputedStyle(e).backgroundSize });
}));
await page.evaluate(function () {
  var r = document.querySelectorAll('#paneCanvas input[type=range]')[0];
  r.value = '20'; r.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise(r => setTimeout(r, 150));
const r1 = JSON.parse(await page.evaluate(function () {
  var e = document.querySelector('.cv-fx.paper');
  return JSON.stringify({ op: parseFloat(getComputedStyle(e).opacity), size: getComputedStyle(e).backgroundSize });
}));
ok('纸纹不透明度拖动即变化', Math.abs(r1.op - r0.op) > 0.05, r0.op + ' → ' + r1.op);

await page.evaluate(function () {
  var r = document.querySelectorAll('#paneCanvas input[type=range]')[2];
  r.value = '480'; r.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise(r => setTimeout(r, 150));
const r2 = JSON.parse(await page.evaluate("(function(){var e=document.querySelector('.cv-fx.paper');return JSON.stringify({size:getComputedStyle(e).backgroundSize})})()"));
ok('纹理尺寸拖动即变化', r2.size.indexOf('480') === 0, r0.size + ' → ' + r2.size);

// 3 间距滑块：拖动时图层坐标立即变
await page.evaluate(function () {
  App.doc.layers = []; App.apply();
  for (var i = 0; i < 6; i++) App.addLayer(CV.I('icon', 'OpenAI/OpenAI#symbol-color', { x: 100, y: 100, w: 140, h: 140 }), true);
  App.selectAll();
});
await new Promise(r => setTimeout(r, 500));
await page.click('.panel.right .tab[data-tab="props"]');
await new Promise(r => setTimeout(r, 400));
const g0 = await page.evaluate('JSON.stringify(App.doc.layers.map(function(l){return l.x}))');
await page.evaluate(function () {
  var sliders = document.querySelectorAll('#paneProps input[type=range]');
  var gap = sliders[sliders.length - 3] || sliders[0];
  gap.value = '90'; gap.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise(r => setTimeout(r, 200));
const g1 = await page.evaluate('JSON.stringify(App.doc.layers.map(function(l){return l.x}))');
ok('间距滑块拖动时坐标立即变化', g0 !== g1, g0 + ' → ' + g1);
await page.screenshot({ path: 'out/qa/_live-panel.png' });

console.log('build =', await page.evaluate('App.BUILD'));
console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
