/* 封面质量门禁：44 种组合逐个渲染 + 几何体检（越界 / 溢出 / 穿模 / 贴边） */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';

const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const QADIR = path.join('out', 'qa');
fs.mkdirSync(QADIR, { recursive: true });

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1160, height: 720, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base + '/render.html', { waitUntil: 'load' });

const meta = await page.evaluate(function () {
  return { styles: window.CV.STYLES.map(function (s) { return s.id; }), bleeds: window.CV.STYLES.reduce(function (o, s) { o[s.id] = !!s.qaBleed; return o; }, {}), layouts: window.CV.LAYOUTS.map(function (l) { return l.id; }) };
});

const ANALYZE = function (styleId, layoutId, ratioId, bleed) {
  var doc = window.CV.compose(styleId, layoutId, window.CV.defaultContent(), ratioId);
  document.body.innerHTML = '';
  document.body.style.cssText = 'margin:0;padding:0;overflow:hidden;background:#fff;width:' + doc.w + 'px;height:' + doc.h + 'px';
  var host = document.createElement('div');
  host.id = 'qastage';
  document.body.appendChild(host);
  window.CV.render(doc, host, { edit: false });
  var W = doc.w, H = doc.h;
  var boxes = [];
  doc.layers.forEach(function (l) {
    var el = host.querySelector('[data-id="' + l.id + '"]');
    if (!el || l.hidden) return;
    if (el.offsetWidth === 0) return;
    boxes.push({
      id: l.id, type: l.type, role: l.role || l.type,
      x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,
      op: l.opacity == null ? 1 : l.opacity
    });
  });
  var probs = [];
  boxes.forEach(function (b) {
    if (b.type === 'shape' || b.type === 'raw' || b.type === 'image') return;
    if (b.op < 0.35) return;
    if (!bleed && (b.x < -1 || b.y < -1 || b.x + b.w > W + 1 || b.y + b.h > H + 1)) {
      probs.push('OUT:' + b.role + '(' + Math.round(b.x) + ',' + Math.round(b.y) + ' ' + Math.round(b.w) + 'x' + Math.round(b.h) + ')');
    }
  });
  doc.layers.forEach(function (l) {
    if (l.type !== 'text') return;
    var el = host.querySelector('[data-id="' + l.id + '"]');
    if (!el) return;
    var fs0 = parseFloat(getComputedStyle(el).fontSize) || 20;
    var tol = Math.max(4, fs0 * 0.5);
    if (el.scrollHeight > el.clientHeight + tol) probs.push('CLIP:' + (l.role || l.id) + '(' + el.scrollHeight + '>' + el.clientHeight + ')');
    if (el.scrollWidth > el.clientWidth + tol) probs.push('WIDE:' + (l.role || l.id));
  });
  var solid = boxes.filter(function (b) { return (b.type === 'text' || b.type === 'icon') && b.op > 0.35; });
  for (var i = 0; i < solid.length; i++) {
    for (var j = i + 1; j < solid.length; j++) {
      var a = solid[i], c = solid[j];
      var ix = Math.max(0, Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x));
      var iy = Math.max(0, Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y));
      if (ix <= 0 || iy <= 0) continue;
      var small = Math.min(a.w * a.h, c.w * c.h);
      var ratio = (ix * iy) / small;
      if (ratio > 0.1) probs.push('HIT:' + a.role + '×' + c.role + '(' + Math.round(ratio * 100) + '%)');
    }
  }
  boxes.forEach(function (b) {
    if (b.type !== 'text') return;
    if (bleed) return;
    if (b.x < 14 || b.y < 14 || b.x + b.w > W - 14 || b.y + b.h > H - 14) probs.push('EDGE:' + b.role);
  });
  return { probs: probs, n: boxes.length, w: W, h: H };
};

let total = 0, bad = 0;
const rows = [];
for (const s of meta.styles) {
  if (only && s !== only) continue;
  for (const l of meta.layouts) {
    total++;
    const ratio = l === 'stack' || l === 'sheet' ? 'xhs' : 'land';
    const r = await page.evaluate(ANALYZE, s, l, ratio, !!(meta.bleeds && meta.bleeds[s]));
    const flag = r.probs.length;
    if (flag) bad++;
    rows.push({ k: s + '/' + l, p: r.probs });
    const file = path.join(QADIR, s + '-' + l + '.png');
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: r.w, height: r.h } });
    console.log((flag ? 'X ' : 'ok ') + (s + '/' + l).padEnd(26) + (flag ? r.probs.join('  ') : ''));
  }
}
console.log('');
console.log('组合 ' + total + ' · 有问题 ' + bad);
fs.writeFileSync(path.join(QADIR, 'report.json'), JSON.stringify(rows, null, 1), 'utf8');
await browser.close();
server.close();
process.exit(bad ? 2 : 0);
