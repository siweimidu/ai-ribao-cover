/* 全面验证：图标库 / 元素库 / 多选对齐 / 网格 / 纸纹 / 主题 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 940, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1400));

let fails = 0;
const ok = (n, c, extra) => { if (!c) fails++; console.log((c ? 'ok   ' : 'FAIL ') + n + (extra ? '  ' + extra : '')); };

// 1 图标库
await page.click('.panel.left .tab[data-tab="icons"]');
await new Promise(r => setTimeout(r, 900));
const ic = await page.evaluate(function () {
  var t = document.querySelectorAll('#iconList .ictile');
  return { tiles: t.length, badges: document.querySelectorAll('#iconList .ibadge').length, first: t[0] ? t[0].title : '' };
});
ok('一厂商一格 + 每格都有角标', ic.tiles === ic.badges && ic.tiles > 90, JSON.stringify(ic));
await page.click('#iconList .ictile', { button: 'right' });
await new Promise(r => setTimeout(r, 500));
const popOk = await page.evaluate("(function(){var p=document.querySelector('.icpop');return p?p.querySelectorAll('.icp-sec').length:0})()");
ok('右键浮层按模型分组', popOk >= 1, 'sections=' + popOk);
await page.mouse.click(800, 700);
await new Promise(r => setTimeout(r, 300));

// 2 文字元素库
await page.click('.panel.left .tab[data-tab="text"]');
await new Promise(r => setTimeout(r, 400));
const n0 = await page.evaluate('App.doc.layers.length');
const elCount = await page.evaluate('document.querySelectorAll("#paneText .elitem").length');
await page.evaluate("(function(){var b=[].slice.call(document.querySelectorAll('#paneText .elitem')).find(function(x){return x.textContent.indexOf('大标题')>-1});b.click()})()");
await new Promise(r => setTimeout(r, 400));
const n1 = await page.evaluate('App.doc.layers.length');
ok('元素库共 17 项 / 点击可插入', elCount === 17 && n1 === n0 + 1, elCount + ' 项, ' + n0 + '->' + n1);

// 3 多选 + 对齐
await page.evaluate('App.selectAll()');
await new Promise(r => setTimeout(r, 300));
const multi = await page.evaluate('App.multi.length');
await page.evaluate("(function(){var b=[].slice.call(document.querySelectorAll('#paneProps .toolgrid button')).find(function(x){return x.textContent==='左对齐'});b.click()})()");
await new Promise(r => setTimeout(r, 400));
const xs = await page.evaluate('JSON.stringify(App.doc.layers.filter(function(l){return l.type==="text"}).map(function(l){return l.x}))');
ok('多选 ' + multi + ' 个 + 左对齐', multi > 2 && JSON.parse(xs).every(function(v) { return v === 64; }), 'xs=' + xs);

// 4 网格排列
const before = await page.evaluate('JSON.stringify(App.doc.layers.map(function(l){return [l.x,l.y]}))');
await page.evaluate("(function(){var b=[].slice.call(document.querySelectorAll('#paneProps button')).find(function(x){return x.textContent==='应用排布'});b.click()})()");
await new Promise(r => setTimeout(r, 500));
const after = await page.evaluate('JSON.stringify(App.doc.layers.map(function(l){return [l.x,l.y]}))');
ok('网格排列改变了坐标', before !== after);

// 5 整体缩放
const w0 = await page.evaluate('App.doc.layers[0].w');
await page.evaluate("(function(){var b=[].slice.call(document.querySelectorAll('#paneProps .chiprow button')).find(function(x){return x.textContent==='×0.5'});b.click()})()");
await new Promise(r => setTimeout(r, 400));
const w1 = await page.evaluate('App.doc.layers[0].w');
ok('整体缩放 ×0.5', Math.abs(w1 - w0 * 0.5) < 3, w0 + '->' + w1);

// 6 纸纹
await page.click('.panel.right .tab[data-tab="canvas"]');
await new Promise(r => setTimeout(r, 400));
await page.evaluate("(function(){var r=document.querySelectorAll('#paneCanvas input[type=range]')[0];r.value='30';r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}))})()");
await new Promise(r => setTimeout(r, 400));
const pop = await page.evaluate('App.doc.paper.opacity');
ok('纸纹不透明度写入文档', pop === 30, 'opacity=' + pop);

// 7 主题
await page.click('#btnTheme');
await new Promise(r => setTimeout(r, 400));
const th = await page.evaluate("document.documentElement.getAttribute('data-theme')");
ok('深色模式切换', th === 'dark', th);
await page.screenshot({ path: 'out/qa/_ui-dark.png' });
await page.click('#btnTheme');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'out/qa/_ui-light.png' });

console.log('');
console.log(errs.length ? 'JS 错误 ' + errs.length + '：' + errs.slice(0, 5).join(' | ') : '无 JS 错误');
console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
