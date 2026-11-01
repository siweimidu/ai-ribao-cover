import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1500));

const CHECK = function (sid, lay, ratio, overlapOK) {
  var doc = CV.compose(sid, lay, CV.defaultContent(), ratio);
  var host = document.getElementById('gc');
  host.innerHTML = '';
  CV.render(doc, host, { edit: false });
  var W = doc.w, H = doc.h;
  var rr0 = host.querySelector('.cv').getBoundingClientRect(), sc = rr0.width / doc.w;
  var B = [];
  doc.layers.filter(function (l) { return l.opacity !== 0 && !l.hidden; }).forEach(function (l) {
    var el = host.querySelector('[data-id="' + l.id + '"]');
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (!r.width) return;
    B.push({ role: l.role, type: l.type, shape: l.shape || '',
      x: (r.left - rr0.left) / sc, y: (r.top - rr0.top) / sc, w: r.width / sc, h: r.height / sc,
      op: l.opacity == null ? 1 : l.opacity, bw: l.bw || 0, color: String(l.color || '').slice(0, 20) });
  });
  var out = [];
  B.forEach(function (b) {
    if (b.type !== 'icon') return;
    var best = null, bestD = 1e9;
    B.forEach(function (c) {
      if (c === b) return;
      var isC = c.shape === 'circle' || (c.shape === 'round' && Math.abs(c.w - c.h) < 3);
      if (!isC) return;
      if (c.w < b.w * 1.15 || c.w > b.w * 2.6) return;
      if (c.op < 0.35 && !(c.bw > 0)) return;
      var d = Math.hypot((c.x + c.w / 2) - (b.x + b.w / 2), (c.y + c.h / 2) - (b.y + b.h / 2));
      if (d < bestD) { bestD = d; best = { c: c, d: d }; }
    });
    if (best && best.d > Math.max(3, best.c.w * 0.05)) out.push({ k: 'ICONOFF', a: b.role, b: best.c.role, px: Math.round(best.d), aop: b.op, bop: best.c.op });
  });
  B.forEach(function (b) {
    var thin = Math.min(b.w, b.h) <= 3 && Math.max(b.w, b.h) >= 40;
    if (!thin) return;
    B.forEach(function (c) {
      if (c === b || (c.type !== 'icon' && c.type !== 'text')) return;
      if (c.op < 0.3) return;
      var ix = Math.max(0, Math.min(b.x + b.w, c.x + c.w) - Math.max(b.x, c.x));
      var iy = Math.max(0, Math.min(b.y + b.h, c.y + c.h) - Math.max(b.y, c.y));
      if (ix > 0 && iy > 0 && ix * iy > Math.min(b.w * b.h, c.w * c.h) * 0.3) out.push({ k: 'LINEX', a: b.role, b: c.role, aop: b.op, bop: c.op });
    });
  });
  B.forEach(function (b) {
    if (b.x < -2 || b.y < -2 || b.x + b.w > W + 2 || b.y + b.h > H + 2) out.push({ k: 'OUT', a: b.role, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h), op: b.op });
  });
  for (var i = 0; i < B.length; i++) {
    for (var j = i + 1; j < B.length; j++) {
      var a = B[i], c2 = B[j];
      if (a.type !== 'shape' || c2.type !== 'shape') continue;
      if (a.shape === 'line' || c2.shape === 'line') continue;
      if (a.op < 0.5 || c2.op < 0.5) continue;
      if (a.bw > 0 && a.color === 'transparent') continue;
      if (c2.bw > 0 && c2.color === 'transparent') continue;
      var iArea = ix2 * iy2, mn = Math.min(a.w * a.h, c2.w * c2.h);
      if (iArea >= mn * 0.85) continue;                                   /* 嵌套/包含 */
      if (a.w >= W - 4 || c2.w >= W - 4) continue;
      var ix2 = Math.max(0, Math.min(a.x + a.w, c2.x + c2.w) - Math.max(a.x, c2.x));
      var iy2 = Math.max(0, Math.min(a.y + a.h, c2.y + c2.h) - Math.max(a.y, c2.y));
      if (ix2 <= 0 || iy2 <= 0) continue;
      var small = Math.min(a.w * a.h, c2.w * c2.h);
      if ((ix2 * iy2) / small > 0.55 && !overlapOK) out.push({ k: 'HIT', a: a.role, b: c2.role, aop: a.op, bop: c2.op, aShape: a.shape, bShape: c2.shape });
    }
  }
  return out;
};

await page.evaluate(function () {
  var d = document.createElement('div');
  d.id = 'gc'; d.style.cssText = 'position:absolute;left:0;top:0';
  document.body.appendChild(d);
});
const meta = JSON.parse(await page.evaluate('JSON.stringify(CV.STYLES.map(function(s){return {id:s.id,ov:!!s.qaOverlap}}))'));
const styles = meta.map(function (s) { return s.id; });
const OVERLAP = {};
meta.forEach(function (s) { OVERLAP[s.id] = s.ov; });
const layouts = JSON.parse(await page.evaluate('JSON.stringify(CV.LAYOUTS.map(function(l){return l.id}))'));
const rows = [];
for (const sid of styles) {
  for (const lay of layouts) {
    const ratio = (lay === 'stack' || lay === 'sheet') ? 'xhs' : 'land';
    const probs = await page.evaluate(CHECK, sid, lay, ratio, !!OVERLAP[sid]);
    if (probs && probs.length) rows.push({ sid, lay, probs });
  }
}
/* 归并：同风格同问题只记一次，标注出现次数 */
const agg = {};
rows.forEach(r => r.probs.forEach(p => {
  const key = r.sid + '|' + p.k + '|' + p.a + '×' + (p.b || '') + '|' + (p.aShape || '') + '/' + (p.bShape || '');
  agg[key] = agg[key] || { sid: r.sid, k: p.k, a: p.a, b: p.b, px: p.px, x: p.x, y: p.y, w: p.w, h: p.h, n: 0, lays: [] };
  agg[key].n++;
  agg[key].lays.push(r.lay);
}));
const list = Object.values(agg);
list.sort((x, y) => x.sid.localeCompare(y.sid) || x.k.localeCompare(y.k));
console.log('=== 共 ' + list.length + ' 类问题（' + rows.length + ' 个组合）===');
list.forEach(o => {
  let desc = o.k + ' ' + o.a + (o.b ? '×' + o.b : '');
  if (o.px) desc += ' 偏' + o.px + 'px';
  if (o.x != null) desc += ' @(' + o.x + ',' + o.y + ') ' + o.w + 'x' + o.h;
  console.log(o.sid.padEnd(15) + ' ' + desc.padEnd(46) + ' ×' + o.n + ' [' + o.lays.join(',') + ']');
});
await browser.close();
server.close();
process.exit(0);
