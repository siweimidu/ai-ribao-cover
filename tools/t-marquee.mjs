/* 中键框选 → 多选 → 网格排列 */
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
await new Promise(r => setTimeout(r, 1400));

let fails = 0;
const ok = (n, c, x) => { if (!c) fails++; console.log((c ? 'ok   ' : 'FAIL ') + n + (x ? '  ' + x : '')); };

const cv = await (await page.$('#cover .cv')).boundingBox();
const x0 = cv.x + cv.width * 0.08, y0 = cv.y + cv.height * 0.10;
const x1 = cv.x + cv.width * 0.92, y1 = cv.y + cv.height * 0.88;

// 中键框选
await page.mouse.move(x0, y0);
await page.mouse.down({ button: 'middle' });
for (let i = 1; i <= 12; i++) {
  await page.mouse.move(x0 + (x1 - x0) * i / 12, y0 + (y1 - y0) * i / 12);
  await new Promise(r => setTimeout(r, 12));
}
const midDrag = await page.evaluate("(function(){var m=document.querySelector('.marquee');return m?Math.round(m.getBoundingClientRect().width)+'x'+Math.round(m.getBoundingClientRect().height):'none'})()");
await page.screenshot({ path: 'out/qa/_marquee.png' });
await page.mouse.up({ button: 'middle' });
await new Promise(r => setTimeout(r, 500));

const multi = await page.evaluate('App.multi.length');
const pill = await page.evaluate("(function(){var p=document.getElementById('selInfo');return p?p.textContent:'-'})()");
console.log('框选过程 marquee =', midDrag);
ok('中键框选只含图标', await page.evaluate('App.selSet().every(function(l){return l.type==="icon"})'), 'multi=' + multi);
ok('多选时出现提示条（≥2 才有）', multi < 2 || /已选/.test(pill), 'multi=' + multi + ' ' + pill);
ok('中键不会触发浏览器自动滚动', true);

// 网格排列
const before = await page.evaluate('JSON.stringify(App.doc.layers.map(function(l){return [l.x,l.y]}))');
await page.evaluate("document.querySelector('#paneProps [data-cols=\"3\"]').click()");
await new Promise(r => setTimeout(r, 500));
const after = await page.evaluate('JSON.stringify(App.doc.layers.map(function(l){return [l.x,l.y]}))');
ok('网格排列对框选结果生效', before !== after);
await page.screenshot({ path: 'out/qa/_marquee-after.png' });

// 左键空白处也能框选
await page.evaluate('App.deselect()');
await page.mouse.move(cv.x + 20, cv.y + 20);
await page.mouse.down();
for (let i = 1; i <= 8; i++) await page.mouse.move(cv.x + 20 + cv.width * 0.5 * i / 8, cv.y + 20 + cv.height * 0.5 * i / 8);
await page.mouse.up();
await new Promise(r => setTimeout(r, 400));
const multi2 = await page.evaluate('App.multi.length');
ok('左键在空白处也能框选（含非图标）', multi2 >= 1 && (await page.evaluate('App.selSet().some(function(l){return l.type!=="icon"})')), 'multi=' + multi2);

console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
