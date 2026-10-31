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

await page.evaluate(function () {
  App.doc.layers = []; App.apply();
  App.addLayer(CV.I('icon', 'OpenAI/OpenAI#symbol-color', { x: 400, y: 260, w: 200, h: 200 }), true);
  App.select(App.doc.layers[0].id);
});
await new Promise(r => setTimeout(r, 500));

const before = JSON.parse(await page.evaluate("JSON.stringify({hist: App.hist.length, node: (App.map[App.doc.layers[0].id]||{}).__tag = 1})"));

// 连续 6 次 input（模拟拖动）
const res = await page.evaluate(function () {
  var seen = [], sameNode = true, firstNode = App.map[App.doc.layers[0].id];
  var histStart = App.hist.length;
  var r = (function () {
    var f = [].slice.call(document.querySelectorAll('#paneProps .field')).filter(function (x) { return x.textContent.indexOf('旋转到') > -1; })[0];
    return f ? f.querySelector('input[type=range]') : null;
  })();
  [-120, -60, -20, 15, 40, 75].forEach(function (v) {
    r.value = String(v);
    r.dispatchEvent(new Event('input', { bubbles: true }));
    var el = App.map[App.doc.layers[0].id];
    if (el !== firstNode) sameNode = false;
    seen.push((el.style.transform || '').replace(/\s/g, ''));
  });
  return JSON.stringify({ seen: seen, sameNode: sameNode, histDelta: App.hist.length - histStart, rot: App.doc.layers[0].rot });
});
const R = JSON.parse(res);
console.log('变换序列 =', JSON.stringify(R.seen));
ok('每一帧都跟手改变 transform', R.seen.length === 6 && R.seen[5] === 'rotate(75deg)', JSON.stringify(R.seen));
ok('滑动期间没有重绘（同一 DOM 节点）', R.sameNode === true, String(R.sameNode));
ok('滑动期间不写撤销栈', R.histDelta === 0, 'histDelta=' + R.histDelta);

// 松手 commit
const h0 = await page.evaluate('App.hist.length');
await page.evaluate(function () {
  var r = (function () {
    var f = [].slice.call(document.querySelectorAll('#paneProps .field')).filter(function (x) { return x.textContent.indexOf('旋转到') > -1; })[0];
    return f ? f.querySelector('input[type=range]') : null;
  })();
  r.dispatchEvent(new Event('change', { bubbles: true }));
});
await new Promise(r => setTimeout(r, 400));
const h1 = await page.evaluate('App.hist.length');
ok('松手后进撤销栈', h1 > h0, h0 + ' -> ' + h1);

console.log('build =', await page.evaluate('App.BUILD'));
console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
