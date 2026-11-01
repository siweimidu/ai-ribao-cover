import { pathToFileURL } from 'node:url';
import { createServer } from './server.mjs';
const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const mod = await import(pathToFileURL(HELPER).href);
const browser = await mod.launch();
const page = await browser.newPage();
await page.setViewport({ width: 2100, height: 1250 });
const cases = [
  { id: 'press',  out: '_style-press.png',  c: { title: 'OpenAI 发布\nGPT-6.1 Terra', icon: 'OpenAI/ChatGPT#symbol-color', foot: 'AI 日报 · 今天 · 来源已核对', badge: '' } },
  { id: 'swiss2', out: '_style-swiss2.png', c: { title: 'DeepSeek\nV4.1 Flash', icon: 'DeepSeek/DeepSeek#symbol-color' } }
];
for (const cs of cases) {
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForSelector('#cover .cv');
  await new Promise(r => setTimeout(r, 1200));
  const info = await page.evaluate(async function (a) {
    await document.fonts.ready;
    App.recompose({ style: a.id, layout: 'hero', ratio: '169', content: a.c });
    document.body.innerHTML = '<div id="shot" style="position:absolute;left:0;top:0"></div>';
    document.body.style.margin = '0'; document.body.style.background = '#fff';
    CV.render(App.doc, document.getElementById('shot'));
    var r = document.querySelector('#shot .cv').getBoundingClientRect();
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, n: App.doc.layers.length });
  }, { id: cs.id, c: cs.c });
  await new Promise(r => setTimeout(r, 1200));
  const G = JSON.parse(info);
  await page.screenshot({ path: 'out/qa/' + cs.out, clip: { x: G.x, y: G.y, width: G.w, height: G.h } });
  console.log('shot ' + cs.id + ' layers=' + G.n);
}
await browser.close();
server.close();
process.exit(0);
