/* 用户真实用法：中键框选图标 → 应用排布 → 应得到整齐网格 */
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

// 先清干净，只放 8 个图标
await page.evaluate(function () {
  App.doc.layers = [];
  App.apply();
  var ids = ['OpenAI/OpenAI#symbol-color', 'Anthropic/Claude#symbol-color', 'Google/Gemini#symbol-color',
    'DeepSeek/DeepSeek#symbol-color', '月之暗面/Kimi#symbol-color', '智谱 AI/智谱 AI#symbol-color',
    'MiniMax/MiniMax#symbol-color', 'xAI/Grok#symbol-color'];
  ids.forEach(function (r, i) {
    App.addLayer(CV.I('icon', r, { x: 80 + (i % 3) * 40, y: 80 + i * 30, w: 150, h: 150 }), true);
  });
  App.deselect();
});
await new Promise(r => setTimeout(r, 600));
let fails = 0;
const ok = (n, c, x) => { if (!c) fails++; console.log((c ? 'ok   ' : 'FAIL ') + n + (x ? '  ' + x : '')); };

const cv = await (await page.$('#cover .cv')).boundingBox();
await page.mouse.move(cv.x + 6, cv.y + 6);
await page.mouse.down({ button: 'middle' });
for (let i = 1; i <= 10; i++) await page.mouse.move(cv.x + 6 + cv.width * 0.95 * i / 10, cv.y + 6 + cv.height * 0.95 * i / 10);
await page.mouse.up({ button: 'middle' });
await new Promise(r => setTimeout(r, 500));
const n0 = await page.evaluate('App.multi.length');
ok('中键框选到 8 个图标', n0 === 8, 'multi=' + n0);

await page.evaluate("(function(){var b=[].slice.call(document.querySelectorAll('#paneProps button')).filter(function(x){return x.textContent==='应用排布'})[0];b&&b.click()})()");
await new Promise(r => setTimeout(r, 600));

const rep = JSON.parse(await page.evaluate(function () {
  var W = App.doc.w, H = App.doc.h, M = 64;
  var boxes = App.selSet().map(function (l) { return [l.role || l.id, l.x, l.y, l.w, l.h || l.w]; });
  var over = 0, out = 0;
  boxes.forEach(function (b) { if (b[1] < M - 1 || b[2] < M - 1 || b[1] + b[3] > W - M + 1 || b[2] + b[4] > H - M + 1) out++; });
  for (var i = 0; i < boxes.length; i++) for (var j = i + 1; j < boxes.length; j++) {
    var a = boxes[i], c = boxes[j];
    var ix = Math.max(0, Math.min(a[1] + a[3], c[1] + c[3]) - Math.max(a[1], c[1]));
    var iy = Math.max(0, Math.min(a[2] + a[4], c[2] + c[4]) - Math.max(a[2], c[2]));
    var sm = Math.min(a[3] * a[4], c[3] * c[4]);
    if (sm > 0 && (ix * iy) / sm > 0.1) over++;
  }
  /* 列对齐检查：同一列的 x 应相同 */
  var xs = boxes.map(function (b) { return b[1]; });
  var uniqX = xs.filter(function (v, i, arr) { return arr.indexOf(v) === i; }).length;
  return JSON.stringify({ n: boxes.length, out: out, over: over, cols: uniqX, boxes: boxes });
}));
ok('8 个图标全部在安全区内', rep.out === 0, 'out=' + rep.out);
ok('图标之间互不重叠', rep.over === 0, 'overlapPairs=' + rep.over);
ok('排成整齐列（列数=ceil(sqrt(8))=3）', rep.cols === 3, 'uniqX=' + rep.cols);
console.log('  坐标 =', JSON.stringify(rep.boxes));
await page.screenshot({ path: 'out/qa/_grid-icons.png' });
console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
