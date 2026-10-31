/* 把 assets/js/*.js 按依赖顺序拼成一个 bundle.js
   用法：node tools/bundle.mjs
   开发时 serve.mjs 会在源文件更新后自动重跑 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const ORDER = ['model.js', 'ratios.js', 'bgpatterns.js', 'presets.js', 'render.js', 'panels.js', 'studio.js'];

export function bundlePath() {
  return path.join(ROOT, 'assets', 'js', 'bundle.js');
}

function mtime(p) {
  try { return fs.statSync(p).mtimeMs; } catch (e) { return 0; }
}

/* 源文件比 bundle 新时返回 true */
export function isStale() {
  const out = bundlePath();
  const t = mtime(out);
  if (!t) return true;
  return ORDER.some(f => mtime(path.join(ROOT, 'assets', 'js', f)) > t);
}

export function build(force) {
  const out = bundlePath();
  if (!force && !isStale()) return { built: false, bytes: fs.statSync(out).size };
  let code = '/* AI 日报封面工作室 · bundle（自动生成，勿手改） · ' + new Date().toISOString() + ' */\n';
  for (const f of ORDER) {
    const src = fs.readFileSync(path.join(ROOT, 'assets', 'js', f), 'utf8');
    code += '\n/* ==== ' + f + ' ==== */\n' + src + '\n';
  }
  fs.writeFileSync(out, code, 'utf8');
  return { built: true, bytes: code.length };
}

if (process.argv[1] && process.argv[1].endsWith('bundle.mjs')) {
  const r = build(true);
  console.log('bundle ' + (r.bytes / 1024).toFixed(1) + ' KB');
}
