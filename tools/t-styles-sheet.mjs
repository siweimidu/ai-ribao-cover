/* 把 24 套风格各渲一张 1920x1080 缩略，供总览对照 */
import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
import fs from 'node:fs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 2100, height: 1250 });
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1500));
const styles = await page.evaluate("JSON.stringify(CV.STYLES.map(function(s){return {id:s.id,name:s.name,sub:s.sub||''}}))");
const list = JSON.parse(styles);
console.log('STYLES', list.length);
const dir = 'out/qa/styles';
fs.mkdirSync(dir, { recursive: true });
let i = 0;
for (const s of list) {
  i++;
  await page.evaluate(function (sid) {
    App.recompose({ style: sid, layout: 'hero', ratio: '169' });
    document.body.innerHTML = '<div id="shot" style="position:absolute;left:0;top:0"></div>';
    document.body.style.margin = '0';
    document.body.style.background = '#fff';
    CV.render(App.doc, document.getElementById('shot'));
  }, s.id);
  await new Promise(r => setTimeout(r, 260));
  const g = await page.evaluate(function () {
    var r = document.querySelector('#shot .cv').getBoundingClientRect();
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height });
  });
  const G = JSON.parse(g);
  const file = dir + '/' + String(i).padStart(2, '0') + '-' + s.id + '.png';
  await page.screenshot({ path: file, clip: { x: G.x, y: G.y, width: G.w, height: G.h } });
  /* 回首页准备下一次 */
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForSelector('#cover .cv');
  await new Promise(r => setTimeout(r, 500));
}
fs.writeFileSync('out/qa/styles/list.json', JSON.stringify(list, null, 1), 'utf8');
console.log('DONE', i);
await browser.close();
server.close();
process.exit(0);
