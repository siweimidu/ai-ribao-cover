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
await page.evaluateOnNewDocument(function () {
  window.__T = { t0: performance.now() };
  var mark = function (n) { window.__T[n] = Math.round(performance.now() - window.__T.t0); };
  document.addEventListener('DOMContentLoaded', function () { mark('dom'); });
  window.addEventListener('load', function () { mark('load'); });
  window.__mark = mark;
});
await page.goto(base + '/', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 2500));
const t = await page.evaluate(function () {
  var out = Object.assign({}, window.__T);
  out.cv = !!document.querySelector('#cover .cv');
  out.tiles = document.querySelectorAll('#iconList .ictile').length;
  out.styleCards = document.querySelectorAll('.style-card').length;
  return JSON.stringify(out);
});
console.log('BOOT', t);
/* 再测：点风格页签的耗时 */
const t1 = Date.now();
await page.evaluate(function () { var x=[].slice.call(document.querySelectorAll('.panel.left .tab')).filter(function(t){return t.textContent.trim()==='风格'})[0]; if(x) x.click(); });
await new Promise(r => setTimeout(r, 400));
console.log('STYLE_TAB_MS', Date.now() - t1);
const t2 = Date.now();
await page.evaluate(function () { var x=[].slice.call(document.querySelectorAll('.panel.left .tab')).filter(function(t){return t.textContent.trim()==='图标'})[0]; if(x) x.click(); });
await page.waitForFunction("document.querySelectorAll('#iconList .ictile').length > 100", { timeout: 8000 }).catch(()=>{});
console.log('ICON_TAB_MS', Date.now() - t2);
await browser.close();
server.close();
process.exit(0);
