/* 命令行出图
   node tools/render.mjs <doc.json> [outName] [scale]
   node tools/render.mjs --batch content.json [--style bauhaus] [--layout poster] [--scale 2]
*/
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderDoc, closeBrowser } from './core.mjs';
import { createServer } from './server.mjs';

const args = process.argv.slice(2);
function flag(n, d) { const i = args.indexOf(n); return i > -1 && args[i + 1] ? args[i + 1] : d; }

const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const HELPER = 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
let composeBrowser = null;
async function composeDoc(item, style, layout) {
  if (!composeBrowser) {
    const mod = await import(pathToFileURL(HELPER).href);
    composeBrowser = await mod.launch();
  }
  const page = await composeBrowser.newPage();
  try {
    await page.goto(base + '/render.html', { waitUntil: 'load' });
    return await page.evaluate(function (it, st, ly) {
      return window.CV.compose(st || it.style || 'swiss', ly || it.layout || 'hero', it.content || it);
    }, item, style, layout);
  } finally { await page.close(); }
}

async function one(doc, name, scale) {
  const r = await renderDoc(doc, name, scale || 2, base);
  console.log('  OK  ' + r.name + '   ' + r.size + '   ' + Math.round(r.bytes / 1024) + ' KB   -> ' + r.path);
  return r;
}

try {
  if (args[0] === '--batch') {
    const raw = JSON.parse(fs.readFileSync(args[1], 'utf8'));
    const list = Array.isArray(raw) ? raw : raw.items || [];
    const style = flag('--style', null), layout = flag('--layout', null), scale = Number(flag('--scale', 2));
    console.log('批量出图 ' + list.length + ' 张…');
    let i = 0;
    for (const it of list) {
      i++;
      const doc = await composeDoc(it, style, layout);
      await one(doc, it.name || (doc.style + '-' + i), it.scale || scale);
    }
  } else if (args[0]) {
    const doc = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    await one(doc, args[1] || path.basename(args[0]).replace(/\.json$/, ''), Number(args[2] || 2));
  } else {
    console.log('用法: node tools/render.mjs <doc.json> [outName] [scale]');
    console.log('      node tools/render.mjs --batch content.json --style bauhaus --layout poster');
  }
} catch (e) {
  console.error('出图失败：' + (e && e.stack || e));
  process.exitCode = 1;
} finally {
  if (composeBrowser) await composeBrowser.close();
  await closeBrowser();
  server.close();
}
