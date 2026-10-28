/* 共享：路径 / MIME / 静态文件 / Playwright 出图 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const OUT = path.join(ROOT, 'out');
export const TMP = path.join(ROOT, 'out', '_tmp');

const CHROME_HELPER = process.env.COVER_CHROME_HELPER
  || 'C:/Users/35238/.agents/skills/ai-daily-video/scripts/chrome.mjs';
const FONT_DIRS = [
  path.join('C:', 'Windows', 'Fonts'),
  path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'Windows', 'Fonts')
];

export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon'
};

export function ensureDirs() {
  for (const d of [OUT, TMP]) fs.mkdirSync(d, { recursive: true });
}

export function sendJson(res, code, obj) {
  const b = Buffer.from(JSON.stringify(obj));
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': b.length, 'Cache-Control': 'no-store' });
  res.end(b);
}

export function sendFile(res, abs, extraHeaders) {
  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); res.end('not found'); return; }
    const ext = path.extname(abs).toLowerCase();
    const h = Object.assign({
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': st.size
    }, extraHeaders || {});
    res.writeHead(200, h);
    fs.createReadStream(abs).pipe(res);
  });
}

export function findFont(name) {
  const safe = path.basename(String(name || ''));
  if (!/\.(ttf|otf)$/i.test(safe)) return null;
  for (const d of FONT_DIRS) {
    const p = path.join(d, safe);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/* ------------------ Playwright ------------------ */
let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    try {
      const mod = await import(pathToFileURL(CHROME_HELPER).href);
      browserPromise = mod.launch();
    } catch (e) {
      const p = await import('puppeteer');
      browserPromise = p.default.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    }
  }
  return browserPromise;
}
export async function closeBrowser() {
  if (!browserPromise) return;
  try { const b = await browserPromise; await b.close(); } catch (e) { }
  browserPromise = null;
}

export async function renderDoc(doc, outName, scale, baseUrl) {
  ensureDirs();
  const name = String(outName || 'cover').replace(/[\\/:*?"<>|\s]+/g, '_');
  const tmpJson = path.join(TMP, name + '.json');
  fs.writeFileSync(tmpJson, JSON.stringify(doc), 'utf8');
  const outPng = path.join(OUT, name + '.png');
  const rel = '/out/_tmp/' + encodeURIComponent(name + '.json');
  const url = baseUrl + '/render.html?doc=' + encodeURIComponent(rel);

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: doc.w, height: doc.h, deviceScaleFactor: scale || 2 });
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction('window.__ready === true || window.__error', { timeout: 30000 });
    const err = await page.evaluate('window.__error || null');
    if (err) throw new Error(err);
    await page.evaluate('document.fonts.ready');
    await page.screenshot({ path: outPng, type: 'png', clip: { x: 0, y: 0, width: doc.w, height: doc.h } });
  } finally {
    await page.close();
  }
  const st = fs.statSync(outPng);
  return {
    ok: true, name: name + '.png', path: outPng, url: '/out/' + encodeURIComponent(name + '.png'),
    size: doc.w * (scale || 2) + '×' + doc.h * (scale || 2), bytes: st.size
  };
}

/* ------------------ AI ------------------ */
export function aiConfig() {
  const p = path.join(ROOT, 'studio.ai.json');
  let cfg = {};
  try { if (fs.existsSync(p)) cfg = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { }
  const key = process.env.COVER_AI_KEY || process.env.DEEPSEEK_API_KEY || cfg.apiKey || '';
  return {
    baseURL: (cfg.baseURL || 'https://api.deepseek.com').replace(/\/$/, ''),
    model: cfg.model || 'deepseek-chat',
    apiKey: key
  };
}

export function promptTemplate(styles, layouts) {
  return [
    '你是资深中文视觉编辑，为「AI 日报」设计 B 站竖版封面文案与版式。',
    '只输出 JSON，不要解释、不要 markdown 代码块。',
    '',
    '可选 style（风格）：' + styles,
    '可选 layout（版式）：' + layouts,
    '',
    '输出结构：',
    '{"style":"bauhaus","layout":"poster","content":{',
    '  "series":"频道名，6-14字",',
    '  "title":"主标题，用 \\n 分成 2 行，每行不超过 8 字，要有信息量和张力",',
    '  "sub":"副标题，14-26字，可把最关键的一句用 [[ ]] 包住作为高亮",',
    '  "kicker":"顶部小字，日期 · 期号",',
    '  "date":"YYYY.MM.DD",',
    '  "foot":"底部信息，12-20字",',
    '  "badge":"2-3 位数字，用于大水印",',
    '  "icon":"从以下品牌里选最贴切的：OpenAI/OpenAI, Anthropic/Claude, Google/Gemini, DeepSeek/DeepSeek, 月之暗面/Kimi, 智谱 AI/智谱 AI, MiniMax/MiniMax, 阿里通义/Qwen, xAI/Grok, 字节跳动/豆包"',
    '}}',
    '',
    '硬性要求：标题不能超过 16 字；不要出现书名号；不要出现"震惊""炸裂"这类口水词。',
    '',
    '创作简报：{{BRIEF}}',
    '指定风格（可空）：{{STYLE}}'
  ].join('\n');
}
