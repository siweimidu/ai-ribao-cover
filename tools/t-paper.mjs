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
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto(base + '/', { waitUntil: 'load' });
await page.evaluate("try{localStorage.removeItem('cover-studio-doc')}catch(e){}");
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('#cover .cv');
await new Promise(r => setTimeout(r, 1300));
let fails = 0;
const ok = (n, c, x) => { if (!c) fails++; console.log((c ? 'ok   ' : 'FAIL ') + n + (x ? '  ' + x : '')); };
const has = sel => page.evaluate("!!document.querySelector('" + sel + "')");

ok('新文档默认没有纸纹（swiss 无自带纸纹）', !(await has('.cv-fx.paper')));
await page.click('.panel.right .tab[data-tab="canvas"]');
await new Promise(r => setTimeout(r, 400));
ok('开关默认是关的', !(await page.evaluate("document.querySelector('#paperSwitch').classList.contains('on')")));
await page.click('#paperSwitch');
await new Promise(r => setTimeout(r, 500));
ok('打开开关后才出现纸纹', await has('.cv-fx.paper'));
await page.click('#paperSwitch');
await new Promise(r => setTimeout(r, 500));
ok('再关掉纸纹消失', !(await has('.cv-fx.paper')));

/* 风格自带的纸纹不能被开关误杀 */
await page.evaluate("App.recompose({style:'broadsheet',layout:'hero'})");
await new Promise(r => setTimeout(r, 700));
ok('开关关闭时风格自带纸纹也被抑制', !(await has('.cv-fx.paper')), '（新规则：开关是权威）');
await page.evaluate("App.recompose({style:'xiaoxinya',layout:'hero'})");
await new Promise(r => setTimeout(r, 700));
ok('小心鸦风格没有纸纹', !(await has('.cv-fx.paper')));

console.log('build =', await page.evaluate('App.BUILD'));
console.log(fails ? 'FAILURES=' + fails : 'ALL PASS');
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
