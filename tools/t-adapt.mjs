import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1400 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base + '/render.html', { waitUntil: 'load' });
const styles = ['swiss','newspaper','zine','bauhaus','flat','editorial'];
const ratios = ['square','43','34','169','916','67','1610'];
for (const s of styles) {
  for (const r of ratios) {
    const dim = await page.evaluate(function (st, rt) {
      var doc = window.CV.compose(st, 'hero', window.CV.defaultContent(), rt);
      document.body.innerHTML = '';
      document.body.style.cssText = 'margin:0;padding:0;width:' + doc.w + 'px;height:' + doc.h + 'px';
      var host = document.createElement('div');
      document.body.appendChild(host);
      window.CV.render(doc, host, { edit: false });
      return { w: doc.w, h: doc.h, layout: doc.layout, master: doc.master && doc.master.w };
    }, s, r);
    await page.setViewport({ width: dim.w, height: dim.h });
    await new Promise(res => setTimeout(res, 140));
    await page.screenshot({ path: 'out/qa/adapt-' + s + '-' + r + '.png', clip: { x: 0, y: 0, width: dim.w, height: dim.h } });
    console.log(s.padEnd(11) + r.padEnd(6) + dim.w + 'x' + dim.h + '  layout=' + dim.layout + ' master=' + dim.master);
  }
}
await browser.close();
server.close();
process.exit(0);