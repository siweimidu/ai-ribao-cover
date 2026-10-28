/* ==========================================================================
   文档模型 —— 封面就是一份可序列化 JSON
   ========================================================================== */
(function () {
  var CV = (window.CV = window.CV || {});
  CV.W = 1160; CV.H = 720; CV.VERSION = 1;

  var seq = 0;
  CV.uid = function (p) { return (p || 'l') + (++seq) + Math.random().toString(36).slice(2, 6); };
  CV.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  CV.round = function (v) { return Math.round(v * 10) / 10; };
  CV.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  /** [[强调]] → <span class="hl"> */
  CV.rich = function (s) {
    return CV.esc(s).replace(/\[\[([\s\S]*?)\]\]/g, function (_, m) {
      return '<span class="hl">' + m + '</span>';
    });
  };
  CV.plain = function (s) { return String(s == null ? '' : s).replace(/\[\[|\]\]/g, ''); };

  /* ---------- 图层工厂 ---------- */
  CV.T = function (role, text, o) {
    return CV.assign({
      id: CV.uid('t'), type: 'text', role: role, text: text || '', x: 64, y: 64, w: 600,
      font: 'heavy', size: 64, weight: 900, color: '#0e1115', lh: 1.06, ls: 0, align: 'left',
      italic: false, upper: false, stroke: 0, strokeColor: '#ffffff', shadow: '', opacity: 1,
      rot: 0, fit: false, maxH: 0, hidden: false
    }, o);
  };
  CV.I = function (role, icon, o) {
    return CV.assign({
      id: CV.uid('i'), type: 'icon', role: role, icon: icon || '', x: 700, y: 180, w: 360, h: 360,
      tint: 'none', pad: 0, opacity: 1, rot: 0, radius: 0, shadow: '', hidden: false
    }, o);
  };
  CV.S = function (role, shape, o) {
    return CV.assign({
      id: CV.uid('s'), type: 'shape', role: role, shape: shape || 'rect', x: 0, y: 0, w: 200, h: 8,
      color: '#000000', opacity: 1, rot: 0, radius: 0, bw: 0, bc: '#000000', hidden: false
    }, o);
  };
  CV.R = function (role, html, o) {
    return CV.assign({ id: CV.uid('r'), type: 'raw', role: role, html: html || '', x: 0, y: 0, w: 200, h: 200, opacity: 1, rot: 0, hidden: false }, o);
  };
  CV.assign = function (a, b) { if (b) for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; };

  /* ---------- 图标路径 ---------- */
  CV.iconParts = function (s) {
    s = String(s || '');
    var i = s.indexOf('#');
    return i < 0 ? { id: s, variant: '' } : { id: s.slice(0, i), variant: s.slice(i + 1) };
  };
  CV.iconSrc = function (s, dark) {
    var p = CV.iconParts(s), v = p.variant;
    if (!v) v = dark ? 'symbol-white' : 'symbol-color';
    return '/assets/icons/' + p.id.split('/').map(encodeURIComponent).join('/') + '/' + encodeURIComponent(v) + '.png';
  };
  CV.iconLabel = function (s) { return CV.iconParts(s).id.split('/').pop() || '未选择'; };

  /* ---------- 默认内容 ---------- */
  CV.defaultContent = function () {
    return {
      series: '白鸦 · AI 日报',
      kicker: '2026.10.28 · 第 561 期 · 22 条',
      date: '2026.10.28',
      title: 'GLM 5.3 灰度推送\n模型价格战开打',
      sub: '智谱补 3 张卡冲刺 3.5 万亿参数，[[Codex 第 23 天重置]]',
      foot: 'AI 前沿速览 · 每日 18:00 更新 · 参考 22 条',
      icon: '智谱 AI/智谱 AI#symbol-color',
      badge: '561'
    };
  };

  CV.emptyDoc = function () {
    return {
      v: CV.VERSION, w: CV.W, h: CV.H, style: 'swiss', layout: 'hero',
      bg: '#ffffff', fx: [], dark: false, tokens: {},
      rgb: 20, layers: []
    };
  };
  CV.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
})();
