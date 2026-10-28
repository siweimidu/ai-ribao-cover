/* 无头自检（puppeteer 内核）：模拟真实操作并收集 JS 错误 */
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

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('requestfailed', r => { const u = r.url(); if (u.indexOf('favicon') < 0) errors.push('reqfail: ' + u); });

const sleep = ms => new Promise(r => setTimeout(r, ms));
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await sleep(1200);

let fails = 0;
async function step(name, fn) {
  const before = errors.length;
  try { await fn(); } catch (e) { errors.push('STEP ' + name + ': ' + e.message); }
  const added = errors.slice(before);
  if (added.length) fails++;
  console.log((added.length ? 'FAIL ' : 'ok   ') + name + (added.length ? '  >> ' + added.join(' | ') : ''));
}

await step('默认渲染图层 >= 10', async () => {
  const n = await page.evaluate('document.querySelectorAll("#cover .cv-el").length');
  if (n < 10) throw new Error('图层 ' + n);
});

await step('切到风格页签并点击 包豪斯', async () => {
  await page.click('.panel.left .tab[data-tab="style"]');
  await sleep(250);
  const n = await page.evaluate('document.querySelectorAll(".style-card").length');
  if (n !== 11) throw new Error('风格卡 ' + n);
  await page.click('.style-card[data-style="bauhaus"]');
  await sleep(350);
  const s = await page.evaluate('App.doc.style');
  if (s !== 'bauhaus') throw new Error('style=' + s);
});

await step('切版式为 通栏大标', async () => {
  const n = await page.evaluate('document.querySelectorAll(".lay").length');
  if (n !== 4) throw new Error('版式 ' + n);
  await page.click('.lay[data-layout="poster"]');
  await sleep(350);
  if (await page.evaluate('App.doc.layout') !== 'poster') throw new Error('layout 未变');
});

await step('点选图层出现选择框', async () => {
  await page.click('#cover .cv-text');
  await sleep(250);
  if (!await page.evaluate('!!App.sel')) throw new Error('未选中');
  if (!await page.$('#selLayer .sel')) throw new Error('无选择框');
  if (!await page.$('#selLayer .sel .h')) throw new Error('无手柄');
});

await step('属性面板生成控件', async () => {
  const n = await page.evaluate('document.querySelectorAll("#paneProps .field").length');
  if (n < 6) throw new Error('属性项 ' + n);
});

await step('拖拽移动', async () => {
  const before = await page.evaluate('App.selLayer().x');
  const bb = await (await page.$('#cover .cv-text')).boundingBox();
  await page.mouse.move(bb.x + 40, bb.y + 12);
  await page.mouse.down();
  await page.mouse.move(bb.x + 150, bb.y + 62, { steps: 10 });
  await page.mouse.up();
  await sleep(300);
  const after = await page.evaluate('App.selLayer().x');
  if (Math.abs(after - before) < 20) throw new Error(before + '->' + after);
});

await step('双击进入编辑并写入文字', async () => {
  const bb = await (await page.$('#cover .cv-text')).boundingBox();
  await page.mouse.click(bb.x + 40, bb.y + 12);
  await sleep(150);
  await page.keyboard.press('Enter');
  await sleep(300);
  const active = await page.evaluate('document.activeElement && document.activeElement.className');
  if (String(active).indexOf('cv-text') < 0) throw new Error('焦点不在文字上: ' + active);
  await page.keyboard.type('测试ABC');
  await sleep(200);
  const diag = await page.evaluate('JSON.stringify({editing:App.editing, active:(document.activeElement||{}).className, html:(document.activeElement||{}).innerHTML})');
  await page.mouse.click(8, 300);
  await sleep(400);
  const t = await page.evaluate('App.doc.layers.filter(function(l){return l.type==="text"}).map(function(l){return l.text}).join("|")');
  if (t.indexOf('测试ABC') < 0) throw new Error('未写入 diag=' + diag + ' doc=' + t.slice(0, 50));
});

await step('滑块改字号', async () => {
  await page.click('#cover .cv-text');
  await sleep(200);
  const before = await page.evaluate('App.selLayer().size');
  await page.evaluate('(function(){var r=document.querySelector("#paneProps input[type=range]");r.value="150";r.dispatchEvent(new Event("input",{bubbles:true}))})()');
  await sleep(250);
  const after = await page.evaluate('App.selLayer().size');
  if (after === before) throw new Error('字号未变');
});

await step('图标库：11 个分类 + 搜索 + 放置', async () => {
  await page.click('.panel.left .tab[data-tab="icons"]');
  await sleep(600);
  const chips = await page.evaluate('document.querySelectorAll("#vendorChips .chip").length');
  const tiles = await page.evaluate('document.querySelectorAll("#iconGrid .ictile").length');
  if (chips < 20) throw new Error('厂商 chip ' + chips);
  if (tiles < 20) throw new Error('图标 ' + tiles);
  await page.evaluate('(function(){var i=document.querySelector("#paneIcons input.input");i.value="kimi";i.dispatchEvent(new Event("input",{bubbles:true}))})()');
  await sleep(350);
  const m = await page.evaluate('document.querySelectorAll("#iconGrid .ictile").length');
  if (m < 1) throw new Error('搜索无结果');
  await page.click('#iconGrid .ictile');
  await sleep(350);
  const ic = await page.evaluate('App.doc.layers.filter(function(l){return l.role==="icon"})[0].icon');
  if (String(ic).indexOf('Kimi') < 0) throw new Error('icon=' + ic);
});

await step('撤销 / 重做', async () => {
  const h = await page.evaluate('App.hi');
  await page.keyboard.down('Control');
  await page.keyboard.press('z');
  await page.keyboard.up('Control');
  await sleep(300);
  const h2 = await page.evaluate('App.hi');
  if (h2 >= h) throw new Error('撤销无效 ' + h + '->' + h2);
  await page.keyboard.down('Control'); await page.keyboard.down('Shift');
  await page.keyboard.press('z');
  await page.keyboard.up('Shift'); await page.keyboard.up('Control');
  await sleep(300);
  if (await page.evaluate('App.hi') <= h2) throw new Error('重做无效');
});

await step('11 风格 × 4 版式 全量重排无异常', async () => {
  for (const s of ['swiss', 'broadsheet', 'matrix', 'paperdoodle', 'cardlight', 'beigeRed', 'noir', 'data', 'pastel', 'constructivism', 'bauhaus']) {
    for (const l of ['hero', 'poster', 'split', 'feature']) {
      await page.evaluate('App.recompose({style:"' + s + '",layout:"' + l + '"})');
    }
  }
  await sleep(400);
  const n = await page.evaluate('document.querySelectorAll("#cover .cv-el").length');
  if (n < 6) throw new Error('图层 ' + n);
});

await step('AI 弹窗 · 离线智能解析', async () => {
  await page.click('#btnAi');
  await page.waitForSelector('#mask.on');
  await page.evaluate('(function(){var t=document.querySelector(".modal textarea");t.value="智谱 GLM5.3 灰度推送，Orion 3 万亿参数曝光";t.dispatchEvent(new Event("input",{bubbles:true}))})()');
  await page.click('.modal-f .btn.primary');
  await sleep(600);
  if (await page.evaluate('document.querySelector("#mask").classList.contains("on")')) throw new Error('未关闭弹窗');
  const ttl = await page.evaluate('App.doc.layers.filter(function(l){return l.role==="title"})[0].text');
  if (!ttl) throw new Error('标题为空');
});

await step('出图 API 返回 PNG', async () => {
  const j = await page.evaluate(function () {
    return fetch('/api/render', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc: window.App.doc, name: 'selftest', scale: 2 })
    }).then(function (r) { return r.json(); });
  });
  if (!j.ok) throw new Error('出图失败 ' + j.error);
  console.log('     出图 ' + j.name + ' ' + j.size + ' ' + Math.round(j.bytes / 1024) + 'KB');
});

await step('宽屏截图', async () => {
  await page.evaluate('App.recompose({style:"swiss",layout:"hero"})');
  await sleep(400);
  await page.screenshot({ path: 'out/_ui.png' });
});

console.log('');
console.log(errors.length ? '发现 ' + errors.length + ' 个问题' : 'PASS · 全部通过，无 JS 错误');
errors.slice(0, 25).forEach(e => console.log('  ! ' + e));
await browser.close();
server.close();
process.exitCode = errors.length ? 1 : 0;
