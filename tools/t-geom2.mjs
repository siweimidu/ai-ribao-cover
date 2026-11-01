/* 几何体检 v2：只报真问题（图标偏心 / 细线穿物 / 形状压盖 / 出血） */
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

const CHECK = function (sid, lay, ratio) {
  var doc = CV.compose(sid, lay, CV.defaultContent(), ratio);
  var host = document.getElementById('gc');
  host.innerHTML = '';
  CV.render(doc, host, { edit: false });
  var W = doc.w, H = doc.h;
  var L = doc.layers.filter(function (l) { return l.opacity !== 0 && !l.hidden; });
  var rr0 = host.querySelector('.cv') ? host.querySelector('.cv').getBoundingClientRect() : host.getBoundingClientRect();
  var sc = rr0.width / doc.w;
  var B = [];
  L.forEach(function (l) {
    var el = host.querySelector('[data-id="' + l.id + '"]');
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (!r.width) return;
    B.push({ id: l.id, role: l.role, type: l.type, shape: l.shape || '',
      x: (r.left - rr0.left) / sc, y: (r.top - rr0.top) / sc, w: r.width / sc, h: r.height / sc,
      op: l.opacity == null ? 1 : l.opacity, bw: l.bw || 0, color: String(l.color || '') });
  });
  var out = [];
  /* A. 图标偏心：找「最贴近」的圆形容器（直径 1.2~3.5 倍图标宽） */
  B.forEach(function (b) {
    if (b.type !== 'icon') return;
    var best = null, bestD = 1e9;
    B.forEach(function (c) {
      if (c === b) return;
      var isCircle = c.shape === 'circle' || (c.shape === 'round' && Math.abs(c.w - c.h) < 3);
      if (!isCircle) return;
      if (c.w < b.w * 1.15 || c.w > b.w * 2.6) return;
      if (c.op < 0.35 && !(c.bw > 0)) return;
      var dx = Math.abs((c.x + c.w / 2) - (b.x + b.w / 2));
      var dy = Math.abs((c.y + c.h / 2) - (b.y + b.h / 2));
      var d = Math.hypot(dx, dy);
      if (d < bestD) { bestD = d; best = { c: c, dx: dx, dy: dy }; }
    });
    if (!best) return;
    var tol = Math.max(3, best.c.w * 0.05);
    if (best.dx > tol || best.dy > tol) {
      out.push('ICONOFF:' + b.role + '/' + best.c.role + ' 偏' + Math.round(Math.max(best.dx, best.dy)) + 'px');
    }
  });
  /* B. 细线穿过图标或文字 */
  B.forEach(function (b) {
    var thin = Math.min(b.w, b.h) <= 3 && Math.max(b.w, b.h) >= 40;
    if (!thin) return;
    B.forEach(function (c) {
      if (c === b) return;
      if (c.type !== 'icon' && c.type !== 'text') return;
      if (c.op < 0.3) return;
      var ix = Math.max(0, Math.min(b.x + b.w, c.x + c.w) - Math.max(b.x, c.x));
      var iy = Math.max(0, Math.min(b.y + b.h, c.y + c.h) - Math.max(b.y, c.y));
      if (ix > 0 && iy > 0 && ix * iy > Math.min(b.w * b.h, c.w * c.h) * 0.3) out.push('LINEX:' + b.role + '→' + c.role);
    });
  });
  /* C. 出血：可见元素超出画布 */
  B.forEach(function (b) {
    if (b.type === 'shape' && (b.w >= W - 2 || b.h >= H - 2)) return;
    if (b.x < -2 || b.y < -2 || b.x + b.w > W + 2 || b.y + b.h > H + 2) {
      out.push('OUT:' + b.role + '(' + Math.round(b.x) + ',' + Math.round(b.y) + ')');
    }
  });
  /* D. 形状压盖：两个可见形状重叠 >50% */
  for (var i = 0; i < B.length; i++) {
    for (var j = i + 1; j < B.length; j++) {
      var a = B[i], c2 = B[j];
      if (a.type !== 'shape' || c2.type !== 'shape') continue;
      if (a.shape === 'line' || c2.shape === 'line') continue;
      if (a.op < 0.5 || c2.op < 0.5) continue;                            /* 半透明装饰（光晕/淡圆）不算压盖 */
      if (a.bw > 0 && a.color === 'transparent') continue;                /* 描边框 */
      if (c2.bw > 0 && c2.color === 'transparent') continue;
      var aArea = a.w * a.h, cArea = c2.w * c2.h;
      var iArea = Math.max(0, Math.min(a.x + a.w, c2.x + c2.w) - Math.max(a.x, c2.x)) *
                  Math.max(0, Math.min(a.y + a.h, c2.y + c2.h) - Math.max(a.y, c2.y));
      if (iArea >= Math.min(aArea, cArea) * 0.85) continue;               /* 嵌套/包含关系 */
      if (a.w >= W - 4 || c2.w >= W - 4) continue;                        /* 满幅底板不算 */
      var ix2 = Math.max(0, Math.min(a.x + a.w, c2.x + c2.w) - Math.max(a.x, c2.x));
      var iy2 = Math.max(0, Math.min(a.y + a.h, c2.y + c2.h) - Math.max(a.y, c2.y));
      if (ix2 <= 0 || iy2 <= 0) continue;
      var small = Math.min(a.w * a.h, c2.w * c2.h);
      if ((ix2 * iy2) / small > 0.55) out.push('HIT:' + a.role + '×' + c2.role);
    }
  }
  return out;
};

await page.evaluate(function () {
  var d = document.createElement('div');
  d.id = 'gc';
  d.style.cssText = 'position:absolute;left:0;top:0';
  document.body.appendChild(d);
});
const styles = JSON.parse(await page.evaluate('JSON.stringify(CV.STYLES.map(function(s){return s.id}))'));
const layouts = JSON.parse(await page.evaluate('JSON.stringify(CV.LAYOUTS.map(function(l){return l.id}))'));
let total = 0;
const bad = {};
for (const sid of styles) {
  for (const lay of layouts) {
    const ratio = (lay === 'stack' || lay === 'sheet') ? 'xhs' : 'land';
    const probs = await page.evaluate(CHECK, sid, lay, ratio);
    if (probs && probs.length) { total++; (bad[sid] = bad[sid] || []).push(lay + ':' + probs.join(',')); }
  }
}
Object.keys(bad).forEach(sid => console.log(sid + ' || ' + bad[sid].join(' ; ')));
console.log('== 有问题的组合 ' + total + ' / ' + (styles.length * layouts.length) + ' ==');
await browser.close();
server.close();
process.exit(0);
