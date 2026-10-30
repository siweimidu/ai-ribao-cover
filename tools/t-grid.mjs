/* 验收：网格排列只作用于图标，非图标位置不动 */
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

// 造 6 个图标 + 3 个文字，全选
await page.evaluate(function () {
  App.doc.layers = []; App.apply();
  ['OpenAI/OpenAI#symbol-color', 'Anthropic/Claude#symbol-color', 'Google/Gemini#symbol-color',
   'DeepSeek/DeepSeek#symbol-color', '月之暗面/Kimi#symbol-color', 'xAI/Grok#symbol-color'].forEach(function (r, i) {
    App.addLayer(CV.I('icon', r, { x: 80 + (i % 3) * 60, y: 80 + i * 40, w: 150, h: 150 }), true);
  });
  ['t1', 't2', 't3'].forEach(function (id, i) {
    App.addLayer(CV.T(id, '文字 ' + i, { x: 500 + i * 20, y: 500 + i * 30, w: 300, size: 32 }), true);
  });
  App.selectAll();
  App.__before = {};
  App.doc.layers.forEach(function (l) { App.__before[l.id] = [l.x, l.y]; });
});
await new Promise(r => setTimeout(r, 500));
const n0 = JSON.parse(await page.evaluate("JSON.stringify({all:App.doc.layers.length, icons:App.doc.layers.filter(function(l){return l.type==='icon'}).length})"));
ok('左键框选拿到全部元素', n0.all === 9 && n0.icons === 6, JSON.stringify(n0));

await page.evaluate("document.querySelector('#paneProps [data-cols=\"3\"]').click()");
await new Promise(r => setTimeout(r, 700));

const rep = JSON.parse(await page.evaluate(function () {
  var W = App.doc.w, H = App.doc.h, M = 64;
  var icons = App.doc.layers.filter(function (l) { return l.type === 'icon'; });
  var inside = 0, cols = {}, over = 0;
  icons.forEach(function (l) {
    if (l.x >= M - 1 && l.y >= M - 1 && l.x + l.w <= W - M + 1 && l.y + l.h <= H - M + 1) inside++;
    cols[l.x] = 1;
  });
  for (var i = 0; i < icons.length; i++) for (var j = i + 1; j < icons.length; j++) {
    var a = icons[i], b = icons[j];
    if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) over++;
  }
  var moved = [];
  App.doc.layers.forEach(function (l) {
    if (l.type === 'icon') return;
    var p = App.__before[l.id];
    if (p && (p[0] !== l.x || p[1] !== l.y)) moved.push(l.role || l.id);
  });
  return JSON.stringify({ icons: icons.length, inside: inside, over: over, uniqX: Object.keys(cols).length, moved: moved });
}));
ok('6 个图标全部进安全区', rep.inside === rep.icons, rep.inside + '/' + rep.icons);
ok('图标互不重叠', rep.over === 0, 'overlap=' + rep.over);
ok('排成 3 列', rep.uniqX === 3, 'uniqX=' + rep.uniqX);
ok('非图标图层一个都没动', rep.moved.length === 0, 'moved=' + JSON.stringify(rep.moved));

console.log('build =', await page.evaluate('App.BUILD'));
console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
