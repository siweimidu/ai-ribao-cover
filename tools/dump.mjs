/* 打印某个 风格/版式 下每一层的真实盒模型，用于定位穿模 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1160, height: 720, deviceScaleFactor: 1 });
await page.goto(base + '/render.html', { waitUntil: 'load' });

const pairs = process.argv.slice(2);
for (const pair of pairs) {
  const [s, l] = pair.split('/');
  const rows = await page.evaluate(function (styleId, layoutId) {
    var doc = window.CV.compose(styleId, layoutId, window.CV.defaultContent());
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:0;width:1160px;height:720px';
    var host = document.createElement('div');
    document.body.appendChild(host);
    window.CV.render(doc, host, { edit: false });
    return doc.layers.map(function (l) {
      var el = host.querySelector('[data-id="' + l.id + '"]');
      if (!el) return l.role + ' MISSING';
      var cs = getComputedStyle(el);
      return (l.role || l.type).padEnd(10) + ' ' + l.type.padEnd(5) +
        ' box=' + [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight].join(',') +
        ' client=' + el.clientHeight + ' scroll=' + el.scrollHeight +
        ' fs=' + Math.round(parseFloat(cs.fontSize)) + ' lh=' + cs.lineHeight +
        ' maxH=' + (cs.maxHeight === 'none' ? '-' : cs.maxHeight) +
        ' op=' + l.opacity;
    });
  }, s, l);
  console.log('==== ' + pair + ' ====');
  rows.forEach(r => console.log('  ' + r));
}
await browser.close();
server.close();
process.exit(0);
