/* 导出「只有信息底纹」的干净背景：图层全部清空，只留 .cv-bgp */
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
await new Promise(r => setTimeout(r, 1600));

const list = JSON.parse(await page.evaluate("JSON.stringify(CV.BG_PATTERNS.map(function(p){return {id:p.id,name:p.name}}))"));
const CN = { bauhaus:'包豪斯', constructivism:'构成主义', destijl:'荷兰风格派', swiss:'瑞士国际主义',
  artdeco:'装饰艺术ArtDeco', artnouveau:'新艺术运动', brutalism:'粗野主义', neubrutalism:'新粗野主义', memphis:'孟菲斯',
  vaporwave:'蒸汽波', y2k:'Y2K千禧风', cyberpunk:'赛博朋克', glass:'玻璃拟态', neumorphism:'新拟态', clay:'黏土拟态',
  flat:'扁平化', skeuomorphism:'拟物化', material:'MaterialDesign', aurora:'极光UI', lowpoly:'低多边形',
  isometric:'等距插画', acid:'酸性平面', glitch:'故障艺术', psychedelic:'迷幻', nordic:'北欧极简',
  editorial:'杂志编辑风', dopamine:'多巴胺设计', mono:'单色设计', grid:'网格排版主义', retroweb:'复古网页风',
  darkacademia:'暗黑学院', gradmesh:'渐变网格' };
const outDir = 'out/背景';
fs.mkdirSync(outDir, { recursive: true });
let i = 0;
for (const p of list) {
  i++;
  await page.evaluate(function (id) {
    App.doc.layers = [];                 /* 清掉所有内容图层 */
    App.doc.bgPattern = id;
    App.sel = null; App.multi = [];
    App.apply();
    /* 渲染到干净容器，只保留底纹层 */
    document.body.innerHTML = '<div id="shot" style="position:absolute;left:0;top:0"></div>';
    document.body.style.margin = '0'; document.body.style.background = '#fff';
    CV.render(App.doc, document.getElementById('shot'));
  }, p.id);
  await new Promise(r => setTimeout(r, 260));
  const g = await page.evaluate(function () {
    var r = document.querySelector('#shot .cv').getBoundingClientRect();
    var n = document.querySelectorAll('#shot .cv > *').length;
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, kids: n });
  });
  const G = JSON.parse(g);
  const file = outDir + '/' + String(i).padStart(2, '0') + '-' + (CN[p.id] || p.name) + '.png';
  await page.screenshot({ path: file, clip: { x: G.x, y: G.y, width: G.w, height: G.h } });
  console.log('shot ' + file + '  children=' + G.kids);
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForSelector('#cover .cv');
  await new Promise(r => setTimeout(r, 500));
}
await browser.close();
server.close();
process.exit(0);
