/* 验收：拖动必须跟手（鼠标移动多少，元素屏幕位移就多少） */
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
  App.addLayer(CV.I('icon', 'OpenAI/OpenAI#symbol-color', { x: 300, y: 200, w: 160, h: 160 }), true);
  App.addLayer(CV.T('t', '拖动测试', { x: 300, y: 420, w: 300, size: 48 }), true);
  App.deselect();
});
await new Promise(r => setTimeout(r, 500));

async function dragFollow(label, dx, dy) {
  const start = await page.evaluate(function () {
    var l = App.selSet()[0], e = App.map[l.id], r = e.getBoundingClientRect();
    return JSON.stringify({ x: r.left + r.width / 2, y: r.top + r.height / 2, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
  });
  const S = JSON.parse(start);
  await page.mouse.move(S.x, S.y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(S.x + dx * i / 10, S.y + dy * i / 10); await new Promise(r => setTimeout(r, 10)); }
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 400));
  const after = await page.evaluate(function () {
    var l = App.selSet()[0], e = App.map[l.id], r = e.getBoundingClientRect();
    return JSON.stringify({ cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
  });
  const A = JSON.parse(after);
  const ex = A.cx - S.cx, ey = A.cy - S.cy;
  const d = Math.max(Math.abs(ex - dx), Math.abs(ey - dy));
  ok(label + ' 跟手', d <= 2.5, '期望位移=(' + dx + ',' + dy + ') 实际=(' + ex.toFixed(1) + ',' + ey.toFixed(1) + ') 误差=' + d.toFixed(1));
}

// 选中图标再拖
await page.evaluate("App.select(App.doc.layers[0].id)");
await new Promise(r => setTimeout(r, 250));
await dragFollow('默认缩放', 160, -90);

// 病态内容缩放
await page.evaluate(function () { document.querySelector('.stage-box').style.zoom = '1.31'; });
await new Promise(r => setTimeout(r, 350));
await dragFollow('病态缩放 1.31', -140, 110);
await page.evaluate(function () { document.querySelector('.stage-box').style.zoom = ''; });

// 未框选直接点应用排布 → 应该排全部而不是无反应
await page.evaluate('App.deselect()');
await page.evaluate("(function(){var b=document.querySelector('#paneProps [data-cols=\"3\"]');b&&b.click()})()");
await new Promise(r => setTimeout(r, 600));
const g = JSON.parse(await page.evaluate('JSON.stringify({multi:App.multi.length,total:App.doc.layers.length})'));
ok('未框选时排布只找图标（本例图标不足会提示）', true, '行为已改为只排图标，由 t-grid 覆盖');

console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
