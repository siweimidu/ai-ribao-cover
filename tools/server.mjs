/* 本地服务：静态托管 + 字体代理 + 出图 API + AI 代理 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, OUT, MIME, sendJson, sendFile, findFont, ensureDirs, renderDoc, aiConfig, promptTemplate } from './core.mjs';
import { build as buildBundle, isStale as bundleStale } from './bundle.mjs';

function body(req) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on('data', c => { n += c.length; if (n > 24 * 1024 * 1024) { reject(new Error('body too large')); req.destroy(); return; } chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

export function createServer() {
  ensureDirs();
  try { const r = buildBundle(false); if (r.built) console.log('[bundle] ' + (r.bytes / 1024).toFixed(1) + ' KB'); } catch (e) { }

const server = http.createServer(async (req, res) => {
  /* 开发态：源文件改了就自动重新打包 */
  try { if (bundleStale()) { const r = buildBundle(false); if (r.built) console.log('[bundle rebuilt] ' + (r.bytes / 1024).toFixed(1) + ' KB'); } } catch (e) { }
    const u = new URL(req.url, 'http://127.0.0.1');
    let p = decodeURIComponent(u.pathname);

    try {
      /* ---- 字体代理 ---- */
      if (p.startsWith('/font/')) {
        const abs = findFont(p.slice(6));
        if (!abs) { res.writeHead(404); res.end('font not found'); return; }
        return sendFile(req, res, abs, { 'Cache-Control': 'public, max-age=86400' });
      }

      /* ---- API ---- */
      if (p === '/api/render' && req.method === 'POST') {
        const b = await body(req);
        if (!b.doc || !b.doc.layers) return sendJson(res, 400, { ok: false, error: '缺少 doc' });
        const base = 'http://127.0.0.1:' + server.address().port;
        const r = await renderDoc(b.doc, b.name || 'cover', b.scale || 2, base);
        return sendJson(res, 200, r);
      }

      if (p === '/api/prompt' && req.method === 'GET') {
        const { STYLES, LAYOUTS } = await styleMeta();
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(promptTemplate(STYLES, LAYOUTS));
      }

      if (p === '/api/ai' && req.method === 'POST') {
        const b = await body(req);
        const cfg = aiConfig();
        if (!cfg.apiKey) {
          return sendJson(res, 200, {
            ok: false,
            error: '未配置模型 Key。请在项目根目录新建 studio.ai.json：{"apiKey":"sk-...","baseURL":"https://api.deepseek.com","model":"deepseek-chat"}，或设置环境变量 DEEPSEEK_API_KEY。'
          });
        }
        const { STYLES, LAYOUTS } = await styleMeta();
        const prompt = promptTemplate(STYLES, LAYOUTS)
          .replace('{{BRIEF}}', b.brief || '')
          .replace('{{STYLE}}', b.style || '');
        const r = await fetch(cfg.baseURL + '/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cfg.apiKey },
          body: JSON.stringify({
            model: cfg.model,
            temperature: 0.8,
            messages: [
              { role: 'system', content: '你是严谨的中文视觉编辑，只输出 JSON。' },
              { role: 'user', content: prompt }
            ]
          })
        });
        const j = await r.json();
        if (!r.ok) return sendJson(res, 200, { ok: false, error: (j.error && j.error.message) || ('HTTP ' + r.status) });
        let txt = (j.choices && j.choices[0] && j.choices[0].message.content) || '';
        txt = txt.replace(/^[\s\S]*?(\{)/, '{').replace(/\}\s*[\s\S]*$/, '}');
        try { return sendJson(res, 200, { ok: true, data: JSON.parse(txt) }); }
        catch (e) { return sendJson(res, 200, { ok: false, error: '模型返回的不是合法 JSON：' + txt.slice(0, 240) }); }
      }

      if (p === '/api/health') return sendJson(res, 200, { ok: true, root: ROOT });

      /* ---- 静态 ---- */
      if (p === '/') p = '/index.html';
      const abs = path.join(ROOT, path.normalize(p).replace(/^([/\\])+/, ''));
      if (!abs.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
      if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
        const idx = path.join(abs, 'index.html');
        if (fs.existsSync(idx)) return sendFile(req, res, idx);
        res.writeHead(404); res.end('not found'); return;
      }
      return sendFile(req, res, abs);
    } catch (e) {
      console.error('[500]', p, e);
      try { sendJson(res, 500, { ok: false, error: String(e && e.message || e) }); } catch (e2) { }
    }
  });
  return server;
}

let metaCache = null;
export async function styleMeta() {
  if (metaCache) return metaCache;
  const src = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'presets.js'), 'utf8');
  const ids = [...src.matchAll(/id:\s*'([a-z]+)',\s*name:\s*'([^']+)'/g)].map(m => m[1] + '(' + m[2] + ')');
  const lays = ['hero(主视觉)', 'poster(通栏大标)', 'split(分栏头条)', 'feature(图标巨化)'];
  metaCache = { STYLES: ids.join(', '), LAYOUTS: lays.join(', ') };
  return metaCache;
}
