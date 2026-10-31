/* AI 日报封面工作室 · bundle（自动生成，勿手改） · 2026-10-31T08:53:30.500Z */

/* ==== model.js ==== */
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
  CV.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  CV.RADAR = function (role, cfg, o) {
    return CV.assign({
      id: CV.uid('r'), type: 'radar', role: role || 'radar',
      x: 240, y: 90, w: 420, h: 420, opacity: 1, rot: 0, hidden: false,
      radar: Object.assign((window.CV && CV.radarDefault) ? CV.radarDefault() : {}, cfg || {})
    }, o);
  };
  CV.IMG = function (role, src, o) {
    return CV.assign({
      id: CV.uid('m'), type: 'image', role: role || 'bg', src: src || '',
      x: 0, y: 0, w: CV.W, h: CV.H, fit: 'cover', opacity: 1, radius: 0, rot: 0,
      blur: 0, gray: 0, dim: 0, dimColor: '#0e1115', shadow: '', hidden: false
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
    return 'assets/icons/' + p.id.split('/').map(encodeURIComponent).join('/') + '/' + encodeURIComponent(v) + '.png';
  };
  CV.iconLabel = function (s) { return CV.iconParts(s).id.split('/').pop() || '未选择'; };

  /* ---------- 默认内容 ---------- */
  CV.defaultContent = function () {
    return {
      series: '白鸦 · AI 日报',
      kicker: '2026.10.28 · 第 561 期 · 22 条',
      date: '2026.10.28',
      title: 'GLM5.3\n灰度推送',
      sub: '冲刺 3.5 万亿参数，[[Codex 第 23 天重置]]',
      foot: 'AI 前沿速览 · 每日 18:00 更新 · 参考 22 条',
      icon: '智谱 AI/智谱 AI#symbol-color',
      badge: '561'
    };
  };

  CV.emptyDoc = function () {
    return {
      v: CV.VERSION, w: CV.W, h: CV.H, ratio: 'land', style: 'swiss', layout: 'hero',
      bg: '#ffffff', fx: [], dark: false, tokens: {},
      rgb: 20, layers: []
    };
  };
  CV.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
})();


/* ==== ratios.js ==== */
/* ==========================================================================
   画幅：版式按 1160x720 母版设计，渲染时按画幅换算
   ========================================================================== */
(function () {
  var CV = (window.CV = window.CV || {});
  CV.MASTER = { w: 1160, h: 720 };
  CV.MASTERS = {
    wide: { w: 1160, h: 720 },
    tall: { w: 900, h: 1200 }
  };

  CV.RATIOS = [
    { id: 'square',   name: '方形 1:1',        family: '1:1',   w: 1080, h: 1080 },
    { id: '43',       name: '横版 4:3',        family: '4:3',   w: 1440, h: 1080 },
    { id: '34',       name: '竖版 3:4',        family: '3:4',   w: 1080, h: 1440 },
    { id: '169',      name: '横版 16:9',       family: '16:9',  w: 1920, h: 1080 },
    { id: '916',      name: '竖版 9:16',       family: '9:16',  w: 1080, h: 1920 },
    { id: '67',       name: '竖版 6:7',        family: '6:7',   w: 1080, h: 1260 },
    { id: '1610',     name: '横幅 16:10',      family: '16:10', w: 1920, h: 1200 },

    { id: 'bili',     name: 'B站封面',         family: '16:9',  w: 1146, h: 717 },
    { id: 'bili-space', name: 'B站空间头图',   family: '16:9',  w: 1920, h: 1080 },
    { id: 'douyin-profile', name: '抖音主页背景', family: '16:9', w: 1125, h: 633 },
    { id: 'xhs',      name: '小红书笔记',      family: '3:4',   w: 1080, h: 1440 },
    { id: 'xhs-profile', name: '小红书主页',   family: '5:4',   w: 1080, h: 864 },
    { id: 'wx-share', name: '视频号分享卡',    family: '3:4',   w: 1080, h: 1440 },
    { id: 'wx-profile', name: '视频号主页卡',  family: '6:7',   w: 1080, h: 1260 },
    { id: 'kuaishou', name: '快手封面',        family: '3:4',   w: 1080, h: 1440 },
    { id: 'douyin',   name: '抖音封面',        family: '9:16',  w: 1080, h: 1920 },
    { id: 'land',     name: '母版宽屏',        family: '16:9',  w: 1160, h: 720 }
  ];

  CV.ratioOf = function (id) {
    for (var i = 0; i < CV.RATIOS.length; i++) if (CV.RATIOS[i].id === id) return CV.RATIOS[i];
    return CV.RATIOS[CV.RATIOS.length - 1];
  };

  CV.metrics = function (doc) {
    var M = (doc && doc.master) || CV.MASTER;
    var W = (doc && doc.w) || M.w;
    var H = (doc && doc.h) || M.h;
    var k = W / M.w;
    var y0 = M.h * 0.20;
    var y1 = M.h * 0.80;
    var topH = y0 * k;
    var botH = (M.h - y1) * k;
    var ty0 = topH;
    var ty1 = Math.max(topH + 40, H - botH);
    var sy = (ty1 - ty0) / (y1 - y0);
    return {
      k: k, W: W, H: H,
      x: function (v) { return v * k; },
      y: function (v) {
        if (v <= y0) return v * k;
        if (v >= y1) return H - (M.h - v) * k;
        return ty0 + (v - y0) * sy;
      },
      w: function (v) { return v * k; },
      h: function (v) { return v * k; },
      fs: function (v) { return v * k; }
    };
  };
})();


/* ==== bgpatterns.js ==== */
/* ==========================================================================
   信息底纹背景：32 种风格，用真实 AI 资讯铺满画布，纯背景无任何标签
   ========================================================================== */
(function () {
  var CV = (window.CV = window.CV || {});

  CV.BG_PATTERNS = [{"id":"bauhaus","name":"包豪斯","cols":3,"bg":"#f5efe2","color":"#1a1a1a"},{"id":"constructivism","name":"构成主义","cols":3,"bg":"#e8e2d4","color":"#1a1a1a"},{"id":"destijl","name":"荷兰风格派","cols":4,"bg":"#f7f5ef","color":"#111"},{"id":"swiss","name":"瑞士国际主义","cols":4,"bg":"#ffffff","color":"#111"},{"id":"artdeco","name":"装饰艺术 Art Deco","cols":3,"bg":"#0f0f10","color":"#d8b96a"},{"id":"artnouveau","name":"新艺术运动","cols":3,"bg":"#f3eee0","color":"#3f5c3a"},{"id":"brutalism","name":"粗野主义","cols":2,"bg":"#d8d4cc","color":"#111"},{"id":"neubrutalism","name":"新粗野主义","cols":2,"bg":"#ffe9a8","color":"#111"},{"id":"memphis","name":"孟菲斯","cols":3,"bg":"#fdf4e3","color":"#222"},{"id":"vaporwave","name":"蒸汽波","cols":3,"bg":"#12002b","color":"#ff77e9"},{"id":"y2k","name":"Y2K 千禧风","cols":3,"bg":"#cfe9ff","color":"#0b2a5b"},{"id":"cyberpunk","name":"赛博朋克","cols":3,"bg":"#07070f","color":"#00f0ff"},{"id":"glass","name":"玻璃拟态","cols":3,"bg":"#eef2ff","color":"#3a4a6b"},{"id":"neumorphism","name":"新拟态","cols":3,"bg":"#e8ecf2","color":"#9aa4b2"},{"id":"clay","name":"黏土拟态","cols":3,"bg":"#ffe8f0","color":"#b06a86"},{"id":"flat","name":"扁平化","cols":4,"bg":"#f4f7fb","color":"#7b8794"},{"id":"skeuomorphism","name":"拟物化","cols":3,"bg":"#efe6d2","color":"#6b5a3e"},{"id":"material","name":"Material Design","cols":3,"bg":"#fafafa","color":"#9e9e9e"},{"id":"aurora","name":"极光 UI","cols":3,"bg":"#06121f","color":"#9fd8ff"},{"id":"lowpoly","name":"低多边形","cols":3,"bg":"#dfeaf5","color":"#5b7a99"},{"id":"isometric","name":"等距插画","cols":3,"bg":"#eaf3fb","color":"#6b8aa8"},{"id":"acid","name":"酸性平面","cols":3,"bg":"#0c0c0c","color":"#d6ff2f"},{"id":"glitch","name":"故障艺术","cols":3,"bg":"#0a0a0a","color":"#f2f2f2"},{"id":"psychedelic","name":"迷幻","cols":2,"bg":"#1b0033","color":"#ffd6ff"},{"id":"nordic","name":"北欧极简","cols":3,"bg":"#f7f6f3","color":"#b6b2aa"},{"id":"editorial","name":"杂志编辑风","cols":3,"bg":"#ffffff","color":"#8b8b8b"},{"id":"dopamine","name":"多巴胺设计","cols":3,"bg":"#fff7d6","color":"#7a4bd1"},{"id":"mono","name":"单色设计","cols":3,"bg":"#f2f2f2","color":"#8c8c8c"},{"id":"grid","name":"网格排版主义","cols":6,"bg":"#fbfbf9","color":"#9c9c96"},{"id":"retroweb","name":"复古网页风","cols":2,"bg":"#c0c0c0","color":"#000080"},{"id":"darkacademia","name":"暗黑学院","cols":3,"bg":"#1c1712","color":"#b8a483"},{"id":"gradmesh","name":"渐变网格","cols":3,"bg":"#f6f1ff","color":"#7d6bb0"}];

  CV.BG_CSS = ".cv-bgp.bauhaus{background-color:#f5efe2;color:#1a1a1a}.cv-bgp.bauhaus .txt{column-rule:2px solid #e63946}.cv-bgp.bauhaus::before{content:\"\";position:absolute;left:0;top:0;width:34%;height:34%;background:#e63946;border-radius:0 0 100% 0;opacity:.12}.cv-bgp.bauhaus::after{content:\"\";position:absolute;right:6%;top:12%;width:260px;height:260px;background:#f2b21c;border-radius:50%;opacity:.16}.cv-bgp.constructivism{background-color:#e8e2d4;color:#1a1a1a}.cv-bgp.constructivism .txt{column-rule:3px solid #c8102e;transform:rotate(-1.2deg);padding:5% 4%}.cv-bgp.constructivism::before{content:\"\";position:absolute;inset:0;background:linear-gradient(115deg,transparent 46%,rgba(200,16,46,.18) 46.4%,rgba(200,16,46,.18) 49%,transparent 49.4%)}.cv-bgp.destijl{background-color:#f7f5ef;color:#111}.cv-bgp.destijl .txt{column-rule:4px solid #111}.cv-bgp.destijl{background-image:linear-gradient(#111 6px,transparent 6px),linear-gradient(90deg,#111 6px,transparent 6px);background-size:100% 33.3%,25% 100%}.cv-bgp.destijl::after{content:\"\";position:absolute;left:25%;top:0;width:2.2%;height:33.3%;background:#d21f2c}.cv-bgp.swiss{background-color:#ffffff;color:#111}.cv-bgp.swiss .txt{column-rule:1px solid #d8d8d8;font-size:12.5px}.cv-bgp.swiss::before{content:\"\";position:absolute;left:2.4%;right:2.4%;top:2.6%;height:6px;background:#e30613}.cv-bgp.artdeco{background-color:#0f0f10;color:#d8b96a}.cv-bgp.artdeco .txt{column-rule:1px solid rgba(216,185,106,.4);font-family:\"Songti SC\",serif}.cv-bgp.artdeco{background-image:repeating-linear-gradient(45deg,rgba(216,185,106,.06) 0 2px,transparent 2px 10px)}.cv-bgp.artdeco::before{content:\"\";position:absolute;inset:18px;border:3px double #d8b96a}.cv-bgp.artnouveau{background-color:#f3eee0;color:#3f5c3a}.cv-bgp.artnouveau .txt{column-rule:1px solid rgba(63,92,58,.35);font-family:\"Songti SC\",serif}.cv-bgp.artnouveau::before{content:\"\";position:absolute;left:-6%;top:-14%;width:60%;height:60%;border:2px solid rgba(63,92,58,.28);border-radius:50% 50% 50% 0}.cv-bgp.brutalism{background-color:#d8d4cc;color:#111}.cv-bgp.brutalism .txt{column-rule:6px solid #111}.cv-bgp.brutalism::before{content:\"\";position:absolute;inset:0;box-shadow:inset 0 0 0 14px #111}.cv-bgp.neubrutalism{background-color:#ffe9a8;color:#111}.cv-bgp.neubrutalism .txt{column-rule:5px solid #111;font-weight:600}.cv-bgp.neubrutalism::before{content:\"\";position:absolute;inset:26px;border:8px solid #111;box-shadow:18px 18px 0 #111}.cv-bgp.memphis{background-color:#fdf4e3;color:#222}.cv-bgp.memphis .txt{column-rule:1px solid #ff5a5f}.cv-bgp.memphis::before{content:\"\";position:absolute;right:-40px;top:-40px;width:420px;height:420px;background:radial-gradient(#ff5a5f 3px,transparent 4px) 0 0/26px 26px;opacity:.5;border-radius:50%}.cv-bgp.vaporwave{background-color:#12002b;color:#ff77e9}.cv-bgp.vaporwave .txt{column-rule:1px solid rgba(255,119,233,.4);text-shadow:0 0 12px rgba(255,119,233,.6);font-family:\"Bahnschrift\"}.cv-bgp.vaporwave::before{content:\"\";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 38px,rgba(255,119,233,.14) 38px 40px),radial-gradient(120% 70% at 50% 110%,rgba(120,0,255,.55),transparent 60%)}.cv-bgp.y2k{background-color:#cfe9ff;color:#0b2a5b}.cv-bgp.y2k .txt{column-rule:1px solid #7fb6ff}.cv-bgp.y2k::before{content:\"\";position:absolute;inset:0;background:radial-gradient(circle at 20% 15%,#9fd8ff 0,transparent 45%),radial-gradient(circle at 85% 80%,#ffd6f5 0,transparent 45%)}.cv-bgp.cyberpunk{background-color:#07070f;color:#00f0ff}.cv-bgp.cyberpunk .txt{column-rule:1px solid rgba(0,240,255,.35);text-shadow:0 0 10px rgba(0,240,255,.55);font-family:\"Bahnschrift\"}.cv-bgp.cyberpunk::before{content:\"\";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,240,255,.07) 3px 4px),repeating-linear-gradient(90deg,transparent 0 60px,rgba(255,0,120,.1) 60px 61px)}.cv-bgp.glass{background-color:#eef2ff;color:#3a4a6b}.cv-bgp.glass .txt{column-rule:1px solid rgba(255,255,255,.7)}.cv-bgp.glass::before{content:\"\";position:absolute;inset:0;background:radial-gradient(circle at 18% 22%,#b6c8ff 0,transparent 42%),radial-gradient(circle at 82% 78%,#ffc6e6 0,transparent 42%)}.cv-bgp.glass::after{content:\"\";position:absolute;left:5%;top:6%;width:44%;height:40%;border-radius:26px;background:rgba(255,255,255,.45);box-shadow:0 20px 50px rgba(120,140,200,.25);mix-blend-mode:screen}.cv-bgp.neumorphism{background-color:#e8ecf2;color:#9aa4b2}.cv-bgp.neumorphism .txt{column-rule:1px solid rgba(154,164,178,.4)}.cv-bgp.neumorphism::after{content:\"\";position:absolute;right:6%;bottom:8%;width:300px;height:300px;border-radius:80px;background:#e8ecf2;box-shadow:18px 18px 40px #c9d0da,-18px -18px 40px #fff}.cv-bgp.clay{background-color:#ffe8f0;color:#b06a86}.cv-bgp.clay .txt{column-rule:1px solid rgba(176,106,134,.3)}.cv-bgp.clay::after{content:\"\";position:absolute;left:8%;bottom:10%;width:240px;height:240px;border-radius:50%;background:#ffd7e6;box-shadow:inset -14px -14px 30px #ffc0d6,inset 14px 14px 30px #fff}.cv-bgp.flat{background-color:#f4f7fb;color:#7b8794}.cv-bgp.flat .txt{column-rule:1px solid rgba(123,135,148,.25)}.cv-bgp.flat::after{content:\"\";position:absolute;left:0;top:0;width:100%;height:14px;background:linear-gradient(90deg,#e94f37,#f6c452,#4caf7d,#3b82f6,#8b5cf6)}.cv-bgp.skeuomorphism{background-color:#efe6d2;color:#6b5a3e}.cv-bgp.skeuomorphism .txt{column-rule:1px solid rgba(107,90,62,.35);font-family:\"Songti SC\",serif}.cv-bgp.skeuomorphism{background-image:repeating-linear-gradient(0deg,rgba(107,90,62,.05) 0 1px,transparent 1px 3px)}.cv-bgp.material{background-color:#fafafa;color:#9e9e9e}.cv-bgp.material .txt{column-rule:1px solid rgba(158,158,158,.35)}.cv-bgp.material::after{content:\"\";position:absolute;left:4%;bottom:6%;width:180px;height:180px;border-radius:50%;background:#3f51b5;box-shadow:0 6px 14px rgba(0,0,0,.28)}.cv-bgp.aurora{background-color:#06121f;color:#9fd8ff}.cv-bgp.aurora .txt{column-rule:1px solid rgba(159,216,255,.3)}.cv-bgp.aurora::before{content:\"\";position:absolute;inset:0;background:radial-gradient(60% 50% at 20% 20%,rgba(0,255,200,.35),transparent 60%),radial-gradient(50% 45% at 80% 30%,rgba(120,0,255,.45),transparent 60%),radial-gradient(60% 50% at 60% 90%,rgba(0,140,255,.4),transparent 60%);filter:blur(2px)}.cv-bgp.lowpoly{background-color:#dfeaf5;color:#5b7a99}.cv-bgp.lowpoly .txt{column-rule:1px solid rgba(91,122,153,.3)}.cv-bgp.lowpoly::before{content:\"\";position:absolute;inset:0;background:conic-gradient(from 20deg at 30% 30%,#bcd8ef 0 60deg,#a9cbe6 60deg 120deg,#cfe3f2 120deg 180deg,#bcd8ef 180deg 240deg,#a9cbe6 240deg 300deg,#cfe3f2 300deg);opacity:.5}.cv-bgp.isometric{background-color:#eaf3fb;color:#6b8aa8}.cv-bgp.isometric .txt{column-rule:1px solid rgba(107,138,168,.3)}.cv-bgp.isometric::before{content:\"\";position:absolute;inset:0;background:repeating-linear-gradient(60deg,rgba(107,138,168,.14) 0 1px,transparent 1px 42px),repeating-linear-gradient(-60deg,rgba(107,138,168,.14) 0 1px,transparent 1px 42px)}.cv-bgp.acid{background-color:#0c0c0c;color:#d6ff2f}.cv-bgp.acid .txt{column-rule:1px solid rgba(214,255,47,.45);font-family:\"Bahnschrift\"}.cv-bgp.acid::before{content:\"\";position:absolute;right:4%;top:8%;width:520px;height:520px;border-radius:50%;background:radial-gradient(#d6ff2f 0,transparent 62%);opacity:.35;filter:blur(6px)}.cv-bgp.glitch{background-color:#0a0a0a;color:#f2f2f2}.cv-bgp.glitch .txt{column-rule:1px solid rgba(255,255,255,.2);font-family:\"Bahnschrift\"}.cv-bgp.glitch::before{content:\"\";position:absolute;left:0;top:-4px;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(255,0,80,.16) 0 8px,transparent 8px 22px);mix-blend-mode:screen}.cv-bgp.glitch::after{content:\"\";position:absolute;left:0;top:4px;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(0,255,220,.14) 0 6px,transparent 6px 26px);mix-blend-mode:screen}.cv-bgp.psychedelic{background-color:#1b0033;color:#ffd6ff}.cv-bgp.psychedelic .txt{column-rule:2px solid rgba(255,214,255,.5)}.cv-bgp.psychedelic::before{content:\"\";position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 50%,#ff00c8 0 8deg,#7b00ff 8deg 16deg,#00e5ff 16deg 24deg);opacity:.16}.cv-bgp.nordic{background-color:#f7f6f3;color:#b6b2aa}.cv-bgp.nordic .txt{column-rule:1px solid rgba(182,178,170,.45)}.cv-bgp.editorial{background-color:#ffffff;color:#8b8b8b}.cv-bgp.editorial .txt{column-rule:1px solid rgba(139,139,139,.4);font-family:\"Songti SC\",serif}.cv-bgp.editorial::before{content:\"\";position:absolute;left:2.4%;right:2.4%;top:2.4%;height:3px;background:#111}.cv-bgp.dopamine{background-color:#fff7d6;color:#7a4bd1}.cv-bgp.dopamine .txt{column-rule:2px solid rgba(122,75,209,.35)}.cv-bgp.dopamine::before{content:\"\";position:absolute;inset:0;background:radial-gradient(circle at 12% 20%,#ff9f1c 0,transparent 30%),radial-gradient(circle at 80% 15%,#2ec4b6 0,transparent 28%),radial-gradient(circle at 70% 85%,#e71d73 0,transparent 30%),radial-gradient(circle at 25% 80%,#ffd166 0,transparent 30%);opacity:.28}.cv-bgp.mono{background-color:#f2f2f2;color:#8c8c8c}.cv-bgp.mono .txt{column-rule:1px solid rgba(140,140,140,.4);filter:grayscale(1)}.cv-bgp.grid{background-color:#fbfbf9;color:#9c9c96}.cv-bgp.grid .txt{column-rule:1px solid rgba(0,0,0,.12);font-size:11px;font-family:\"Bahnschrift\"}.cv-bgp.grid{background-image:linear-gradient(rgba(0,0,0,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.06) 1px,transparent 1px);background-size:48px 48px}.cv-bgp.retroweb{background-color:#c0c0c0;color:#000080}.cv-bgp.retroweb .txt{column-rule:2px solid #000080;font-family:\"Courier New\",monospace;font-size:12px}.cv-bgp.retroweb::before{content:\"\";position:absolute;inset:14px;border:2px solid #000080;box-shadow:inset 0 0 0 2px #fff}.cv-bgp.darkacademia{background-color:#1c1712;color:#b8a483}.cv-bgp.darkacademia .txt{column-rule:1px solid rgba(184,164,131,.35);font-family:\"Songti SC\",serif}.cv-bgp.darkacademia::before{content:\"\";position:absolute;inset:0;background:radial-gradient(60% 60% at 50% 40%,rgba(184,164,131,.14),transparent 70%)}.cv-bgp.gradmesh{background-color:#f6f1ff;color:#7d6bb0}.cv-bgp.gradmesh .txt{column-rule:1px solid rgba(125,107,176,.28)}.cv-bgp.gradmesh::before{content:\"\";position:absolute;inset:0;background:radial-gradient(40% 40% at 15% 15%,#b8a1ff,transparent 60%),radial-gradient(40% 40% at 85% 25%,#8ae0ff,transparent 60%),radial-gradient(45% 45% at 70% 85%,#ffb8e0,transparent 60%),radial-gradient(40% 40% at 25% 80%,#ffe6a1,transparent 60%);filter:blur(40px)}";

  CV.bgPatternById = function (id) {
    for (var i = 0; i < CV.BG_PATTERNS.length; i++) if (CV.BG_PATTERNS[i].id === id) return CV.BG_PATTERNS[i];
    return null;
  };

  /* 只注入一次样式 */
  CV.ensureBgCss = function () {
    if (document.getElementById('cv-bg-pattern-css')) return;
    var s = document.createElement('style');
    s.id = 'cv-bg-pattern-css';
    s.textContent = '.cv-bgp{position:absolute;inset:0;overflow:hidden;pointer-events:none}' +
      '.cv-bgp .txt{position:absolute;inset:0;padding:3.2% 2.4%;column-gap:1%;column-rule:1px solid currentColor;' +
      'text-align:justify;font-size:13px;line-height:1.5;opacity:.85;font-family:"MiSans","Noto Sans SC",sans-serif}' +
      '.cv-bgp .txt b{font-weight:800}' + CV.BG_CSS;
    document.head.appendChild(s);
  };

  /* 生成图层：返回元素或 null */
  CV.bgPatternEl = function (id, docW, docH) {
    var p = CV.bgPatternById(id);
    if (!p) return null;
    CV.ensureBgCss();
    var el = document.createElement('div');
    el.className = 'cv-bgp ' + p.id;
    el.style.width = docW + 'px';
    el.style.height = docH + 'px';
    var txt = document.createElement('div');
    txt.className = 'txt';
    txt.style.columnCount = p.cols;
    var rounds = Math.max(14, Math.round(112 / p.cols));
    txt.innerHTML = (CV.npHTML ? CV.npHTML(rounds) : '');
    el.appendChild(txt);
    return el;
  };
})();


/* ==== presets.js ==== */
/* ==========================================================================
   版式 × 风格预设
   风格来源：D:\Code\封面 下 10 位 UP 主 300 张封面（色彩聚类归纳）
            + 构成主义 Constructivism + 包豪斯 Bauhaus
   ========================================================================== */
(function () {
  var CV = window.CV, W = CV.W, H = CV.H, M = 64;

  function find(L, role) { for (var i = 0; i < L.length; i++) if (L[i].role === role) return L[i]; return null; }
  function ov(p, k) { return (p && p[k]) || null; }
  function merge(layer, o) { if (layer && o) for (var k in o) layer[k] = o[k]; }

  /* ============================ 版式 ============================ */
  var LAYOUTS = {
    hero: function (t, c, add) {
      add(CV.T('kicker', c.kicker, { x: M, y: 44, w: 620, size: 15, font: 'mono', ls: .16, upper: true, color: t.ink2, weight: 700 }));
      add(CV.T('series', c.series, { x: M, y: 70, w: 640, size: 28, font: 'heavy', weight: 900, color: t.ink, ls: -.01 }));
      add(CV.S('rule', 'bar', { x: M, y: 120, w: 76, h: 5, color: t.accent }));
      add(CV.T('title', c.title, { x: M, y: 146, w: 604, size: 92, font: 'heavy', weight: 900, lh: 1.02, ls: -.015, color: t.ink, fit: true, maxH: 300 }));
      add(CV.T('sub', c.sub, { x: M, y: 430, w: 540, size: 23, font: 'bold', weight: 700, lh: 1.62, color: t.ink2 }));
      add(CV.S('footline', 'line', { x: M, y: 636, w: 340, h: 1, color: t.ink, opacity: .14 }));
      add(CV.T('foot', c.foot, { x: M, y: 654, w: 620, size: 13, font: 'mono', weight: 700, ls: .04, color: t.ink2 }));
      add(CV.T('date', c.date, { x: 848, y: 44, w: 248, size: 15, font: 'mono', align: 'right', ls: .1, color: t.ink2 }));
      add(CV.I('icon', c.icon, { x: 716, y: 168, w: 380, h: 380 }));
    },
    poster: function (t, c, add) {
      add(CV.I('icon', c.icon, { x: W / 2 - 56, y: 40, w: 112, h: 112 }));
      add(CV.T('kicker', c.kicker, { x: 80, y: 172, w: 1000, align: 'center', size: 14, font: 'mono', ls: .24, upper: true, color: t.ink2 }));
      add(CV.S('rule', 'bar', { x: W / 2 - 60, y: 206, w: 120, h: 4, color: t.accent }));
      add(CV.T('title', c.title, { x: 80, y: 240, w: 1000, align: 'center', size: 116, font: 'heavy', weight: 900, lh: 1.0, ls: -.02, color: t.ink, fit: true, maxH: 300 }));
      add(CV.T('sub', c.sub, { x: 200, y: 578, w: 760, align: 'center', size: 22, font: 'bold', lh: 1.6, color: t.ink2 }));
      add(CV.T('series', c.series, { x: 80, y: 662, w: 520, size: 14, font: 'mono', ls: .18, upper: true, color: t.ink2 }));
      add(CV.T('date', c.date, { x: 900, y: 662, w: 196, size: 14, font: 'mono', align: 'right', ls: .1, color: t.ink2 }));
    },
    split: function (t, c, add) {
      add(CV.S('band', 'rect', { x: 0, y: 0, w: W, h: 96, color: t.ink }));
      add(CV.T('series', c.series, { x: M, y: 32, w: 620, size: 26, font: 'heavy', weight: 900, color: t.bandInk || t.bgSolid || '#fff' }));
      add(CV.T('date', c.date, { x: 848, y: 36, w: 248, size: 14, font: 'mono', align: 'right', ls: .1, color: t.bandInk || t.bgSolid || '#fff' }));
      add(CV.T('kicker', c.kicker, { x: M, y: 118, w: 700, size: 14, font: 'mono', ls: .16, upper: true, color: t.ink2 }));
      add(CV.T('title', c.title, { x: M, y: 150, w: 700, size: 96, font: 'heavy', weight: 900, lh: 1.02, ls: -.015, color: t.ink, fit: true, maxH: 340 }));
      add(CV.T('sub', c.sub, { x: M, y: 532, w: 660, size: 22, font: 'bold', lh: 1.6, color: t.ink2 }));
      add(CV.T('foot', c.foot, { x: M, y: 662, w: 640, size: 12, font: 'mono', ls: .04, color: t.ink2 }));
      add(CV.I('icon', c.icon, { x: 790, y: 150, w: 306, h: 306 }));
    },
    feature: function (t, c, add) {
      add(CV.I('iconBig', c.icon, { x: 588, y: -72, w: 660, h: 660, opacity: .12 }));
      add(CV.T('kicker', c.kicker, { x: M, y: 46, w: 700, size: 15, font: 'mono', ls: .16, upper: true, color: t.ink2 }));
      add(CV.S('rule', 'bar', { x: M, y: 118, w: 96, h: 5, color: t.accent }));
      add(CV.T('title', c.title, { x: M, y: 158, w: 640, size: 100, font: 'heavy', weight: 900, lh: 1.0, ls: -.02, color: t.ink, fit: true, maxH: 290 }));
      add(CV.T('sub', c.sub, { x: M, y: 500, w: 600, size: 22, font: 'bold', lh: 1.58, color: t.ink2 }));
      add(CV.T('series', c.series, { x: M, y: 656, w: 520, size: 15, font: 'mono', ls: .14, upper: true, color: t.ink2 }));
      add(CV.T('date', c.date, { x: 900, y: 656, w: 196, size: 15, font: 'mono', align: 'right', ls: .1, color: t.ink2 }));
      add(CV.I('icon', c.icon, { x: 848, y: 200, w: 240, h: 240 }));
    }
  };

  /* ============================ 原生竖版骨架（母版 900x1200） ============================ */
  var TW = 900, TH = 1200, TM = 56;

  function tallStack(t, c, add) {
    add(CV.T('kicker', c.kicker, { x: TM, y: 46, w: 528, size: 15, font: 'mono', ls: .16, upper: true, color: t.ink2 }));
    add(CV.I('icon', c.icon, { x: TW / 2 - 130, y: 104, w: 260, h: 260 }));
    add(CV.T('series', c.series, { x: TM, y: 400, w: 700, size: 26, font: 'heavy', weight: 900, color: t.ink }));
    add(CV.S('rule', 'bar', { x: TM, y: 446, w: 76, h: 6, color: t.accent }));
    add(CV.T('title', c.title, { x: TM, y: 484, w: TW - TM * 2, size: 96, font: 'heavy', weight: 900, lh: 1.03, ls: -.015, color: t.ink, fit: true, maxH: 420 }));
    add(CV.T('sub', c.sub, { x: TM, y: 940, w: TW - TM * 2, size: 22, font: 'bold', lh: 1.62, color: t.ink2 }));
    add(CV.S('footline', 'line', { x: TM, y: 1104, w: 300, h: 1, color: t.ink, opacity: .16 }));
    add(CV.T('foot', c.foot, { x: TM, y: 1122, w: 620, size: 13, font: 'mono', ls: .04, color: t.ink2 }));
    add(CV.T('date', c.date, { x: TW - TM - 220, y: 46, w: 220, size: 15, font: 'mono', align: 'right', ls: .1, color: t.ink2 }));
  }

  function tallSheet(t, c, add) {
    add(CV.S('band', 'rect', { x: 0, y: 0, w: TW, h: 124, color: t.ink }));
    add(CV.T('series', c.series, { x: TM, y: 44, w: 528, size: 24, font: 'heavy', weight: 900, color: t.bandInk || t.bgSolid || '#fff' }));
    add(CV.T('date', c.date, { x: TW - TM - 220, y: 50, w: 220, size: 14, font: 'mono', align: 'right', ls: .1, color: t.bandInk || t.bgSolid || '#fff' }));
    add(CV.T('kicker', c.kicker, { x: TM, y: 158, w: 700, size: 14, font: 'mono', ls: .16, upper: true, color: t.ink2 }));
    add(CV.T('title', c.title, { x: TM, y: 198, w: TW - TM * 2, size: 92, font: 'heavy', weight: 900, lh: 1.02, ls: -.015, color: t.ink, fit: true, maxH: 330 }));
    add(CV.S('midline', 'bar', { x: TM, y: 560, w: 120, h: 4, color: t.accent }));
    add(CV.I('icon', c.icon, { x: TW / 2 - 170, y: 604, w: 340, h: 340 }));
    add(CV.T('sub', c.sub, { x: TM, y: 990, w: TW - TM * 2, size: 21, font: 'bold', lh: 1.6, color: t.ink2 }));
    add(CV.T('foot', c.foot, { x: TM, y: 1132, w: 620, size: 12, font: 'mono', ls: .05, color: t.ink2 }));
  }

  /* 竖版专属装饰：每种风格保留自己的识别符号（母版 900x1200） */
  var TALLDECOR = {
    swiss: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'circle', { x: 210, y: 40, w: 480, h: 480, color: t.accent, opacity: .055 }));
      x.add(CV.S('t2', 'bar', { x: TW - 66, y: 300, w: 4, h: 150, color: t.accent, opacity: .9 }));
      x.add(CV.S('t3', 'bar', { x: TM, y: 1104, w: 320, h: 1, color: t.ink, opacity: .12 }));
    },
    broadsheet: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: 18, y: 18, w: TW - 36, h: TH - 36, color: 'transparent', bw: 3, bc: t.ink, opacity: .92 }));
      x.add(CV.S('t2', 'rect', { x: 27, y: 27, w: TW - 54, h: TH - 54, color: 'transparent', bw: 1, bc: t.ink, opacity: .5 }));
      x.add(CV.S('t3', 'bar', { x: TM, y: 466, w: 300, h: 2, color: t.ink, opacity: .45 }));
      x.add(CV.S('t4', 'bar', { x: TM, y: 34, w: 150, h: 30, color: t.accent }));
    },
    matrix: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'round', { x: TW / 2 - 168, y: 78, w: 336, h: 336, color: t.card, radius: 44, shadow: '0 26px 60px -30px rgba(22,32,46,.36)' }));
      x.add(CV.S('t2', 'circle', { x: -120, y: 900, w: 420, h: 420, color: '#ffffff', opacity: .55 }));
      for (var i = 0; i < 3; i++) x.add(CV.S('d' + i, 'circle', { x: TW / 2 - 42 + i * 34, y: 440 + (i % 2) * 12, w: 9, h: 9, color: t.accent, opacity: .45 }));
    },
    paperdoodle: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: 0, y: 0, w: 14, h: TH, color: t.yellow }));
      x.add(CV.S('t2', 'bar', { x: TM + 6, y: 700, w: 260, h: 13, color: t.yellow, rot: -1.2, radius: 8, opacity: .92 }));
      x.add(CV.S('t3', 'circle', { x: TW - 130, y: 1010, w: 56, h: 56, color: t.blue, opacity: .9 }));
      x.add(CV.S('t4', 'ring', { x: TW - 140, y: 120, w: 64, h: 64, color: 'transparent', bw: 6, bc: t.yellow, opacity: .9 }));
    },
    cardlight: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'round', { x: 30, y: 372, w: TW - 60, h: 640, color: t.card, radius: 30, shadow: '0 30px 70px -34px rgba(15,17,21,.28)' }));
      x.add(CV.S('t2', 'round', { x: TM, y: 402, w: 156, h: 30, color: t.pill, radius: 99 }));
    },
    beigeRed: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'star4', { x: TW - 300, y: 60, w: 250, h: 250, color: t.grad, opacity: .95 }));
      x.add(CV.S('t2', 'rect', { x: TM, y: 34, w: 124, h: 30, color: t.accent }));
      x.add(CV.S('t3', 'bar', { x: TM, y: 1148, w: 96, h: 6, color: t.ink }));
    },
    noir: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'ring', { x: TW / 2 - 200, y: 30, w: 400, h: 400, color: 'transparent', bw: 1.5, bc: 'rgba(243,245,249,.24)' }));
      x.add(CV.S('t2', 'ring', { x: TW / 2 - 150, y: 80, w: 300, h: 300, color: 'transparent', bw: 1, bc: 'rgba(243,245,249,.16)' }));
      x.add(CV.S('t3', 'circle', { x: TW / 2 + 76, y: 200, w: 44, h: 44, color: t.accent, opacity: .95, shadow: '0 0 60px 18px rgba(255,59,48,.45)' }));
      x.add(CV.S('t4', 'bar', { x: TM, y: 464, w: 300, h: 1, color: t.ink, opacity: .2 }));
    },
    data: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: TW / 2 - 178, y: 70, w: 356, h: 356, color: 'transparent', bw: 3, bc: t.ink, opacity: .92 }));
      x.add(CV.S('t2', 'bar', { x: TM, y: 1104, w: 150, h: 4, color: t.accent }));
      x.add(CV.T('tn', (x.c.badge || ''), { x: TW - 260, y: 1040, w: 200, size: 92, font: 'impact', color: t.accent, align: 'right' }));
    },
    pastel: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'circle', { x: -150, y: -120, w: 440, h: 440, color: '#ffffff', opacity: .62 }));
      x.add(CV.S('t2', 'round', { x: TW / 2 - 190, y: 62, w: 380, h: 380, color: t.card, radius: 32, opacity: .96, bw: 1, bc: 'rgba(42,32,40,.07)' }));
      x.add(CV.S('t3', 'circle', { x: TW - 220, y: 940, w: 340, h: 340, color: '#ffe4ee', opacity: .7 }));
    },
    constructivism: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: -120, y: 830, w: 1140, h: 86, color: t.accent, rot: -11 }));
      x.add(CV.S('t2', 'rect', { x: -120, y: 740, w: 1140, h: 7, color: t.ink, rot: -11, opacity: .9 }));
      x.add(CV.S('t3', 'ring', { x: TW / 2 - 128, y: 40, w: 256, h: 256, color: 'transparent', bw: 16, bc: t.ink, opacity: .9 }));
      x.add(CV.S('t4', 'rect', { x: TW - 8, y: 0, w: 8, h: TH, color: t.ink, opacity: .8 }));
      x.add(CV.S('t5', 'wedge', { x: 0, y: 980, w: 220, h: 220, color: t.ink, opacity: .06 }));
    },
    bauhaus: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'circle', { x: TW - 210, y: 54, w: 150, h: 150, color: t.red }));
      x.add(CV.S('t2', 'rect', { x: TW - 250, y: 950, w: 140, h: 140, color: t.blue, rot: 10 }));
      x.add(CV.S('t3', 'tri', { x: 90, y: 960, w: 140, h: 122, color: t.yellow }));
      x.add(CV.S('t4', 'rect', { x: 0, y: TH - 70, w: TW, h: 70, color: t.ink }));
      x.add(CV.S('t5', 'rect', { x: 0, y: TH - 70, w: 120, h: 70, color: t.red }));
      x.add(CV.S('t6', 'rect', { x: 120, y: TH - 70, w: 120, h: 70, color: t.yellow }));
      x.add(CV.S('t7', 'rect', { x: 240, y: TH - 70, w: 120, h: 70, color: t.blue }));
    },
    zine: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: 0, y: 806, w: TW, h: 46, color: 'linear-gradient(to bottom,rgba(74,56,30,.28),rgba(74,56,30,0))' }));
      x.add(CV.R('t2', tearFlat(), { x: 0, y: 818, w: TW, h: 64 }));
      x.add(CV.S('t3', 'blob', { x: -60, y: 120, w: 520, h: 340, color: t.accent, opacity: .05, rot: -4 }));
      if (x.layout !== 'sheet') x.add(CV.T('t4', (x.c.spray || '不相上下?'), { x: TW - 250, y: 150, w: 230, size: 34, font: 'hand', color: t.accent, rot: -7, opacity: .95 }));
    },
    sticker: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'circle', { x: TW - 90, y: 80, w: 22, h: 22, color: t.blue, opacity: .8 }));
      x.add(CV.S('t2', 'circle', { x: 40, y: 1050, w: 34, h: 34, color: t.accent, opacity: .9 }));
      x.add(CV.S('t3', 'bar', { x: TM, y: 1114, w: 120, h: 6, color: t.accent }));
    },
    candy: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: 0, y: 0, w: 14, h: TH, color: t.accent, opacity: .9 }));
      x.add(CV.S('t2', 'bar', { x: TM + 10, y: 700, w: 280, h: 14, color: t.yellow, rot: -1.2, radius: 8, opacity: .85 }));
      x.add(CV.S('t3', 'blob', { x: TW - 260, y: 900, w: 320, h: 260, color: t.accent, opacity: .06, rot: 8 }));
    },
    newspaper: function (x) {
      var t = x.t;
      x.add(CV.S('t2', 'bar', { x: TM, y: 388, w: TW - TM * 2, h: 3, color: t.ink }));
      x.add(CV.S('t3', 'bar', { x: TM, y: 394, w: TW - TM * 2, h: 1, color: t.ink, opacity: .65 }));
      x.add(CV.S('t4', 'bar', { x: TM, y: 1094, w: TW - TM * 2, h: 1, color: t.ink, opacity: .45 }));
    },
    editorial: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: TW / 2 - 190, y: 64, w: 380, h: 380, color: 'transparent', bw: 2, bc: t.ink }));
      x.add(CV.S('t2', 'bar', { x: TM, y: 40, w: TW - TM * 2, h: 2, color: t.ink }));
      x.add(CV.S('t3', 'bar', { x: TM, y: 1160, w: TW - TM * 2, h: 2, color: t.ink }));
      x.add(CV.T('t4', 'No.561 / SPEC SHEET', { x: TM, y: 1046, w: 400, size: 10.5, font: 'mono', ls: .3, color: t.ink2 }));
      x.add(CV.S('t5', 'bar', { x: TM, y: 1028, w: 92, h: 4, color: t.accent }));
    },
    glitch: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: TW / 2 - 160, y: 60, w: 320, h: 320, color: 'transparent', bw: 1.5, bc: 'rgba(238,242,248,.3)' }));
      x.add(CV.S('t2', 'rect', { x: TW / 2 - 160, y: 60, w: 26, h: 26, color: t.accent }));
      x.add(CV.S('t3', 'rect', { x: TW / 2 + 134, y: 354, w: 26, h: 26, color: t.cyan }));
      for (var i = 0; i < 3; i++) x.add(CV.S('h' + i, 'rect', { x: TW - 40 - i * 6, y: 440 + i * 12, w: 10, h: 80, color: t.cyan, rot: -18, opacity: .55 - i * .13 }));
    },
    golden: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'rect', { x: TW / 2 - 150, y: 70, w: 170, h: 170, color: t.gold, opacity: .95 }));
      x.add(CV.S('t2', 'rect', { x: TW / 2 - 116, y: 104, w: 170, h: 170, color: '#9fc0e8', opacity: .9 }));
      x.add(CV.S('t3', 'rect', { x: TM, y: 34, w: 142, h: 30, color: t.accent }));
      x.add(CV.S('t4', 'bar', { x: 48, y: 92, w: TW - 96, h: 2, color: t.ink, opacity: .5 }));
      x.add(CV.S('t5', 'bar', { x: 48, y: 1150, w: TW - 96, h: 2, color: t.ink, opacity: .5 }));
    },
    ribbon: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'round', { x: TW / 2 - 190, y: 96, w: 380, h: 108, color: 'linear-gradient(135deg,#3b82f6 0%,#a855f7 100%)', radius: 30, rot: -18, opacity: .96 }));
      x.add(CV.S('t2', 'round', { x: TW / 2 - 190, y: 226, w: 380, h: 108, color: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)', radius: 30, rot: 18, opacity: .96 }));
      x.add(CV.S('t3', 'star4', { x: TW - 220, y: 900, w: 170, h: 170, color: 'linear-gradient(135deg,#22d3ee 0%,#3b82f6 100%)', opacity: .92 }));
      x.add(CV.S('t4', 'round', { x: TM, y: 36, w: 148, h: 28, color: '#2f7d4f', radius: 99 }));
    },
    serifgrid: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'circle', { x: -160, y: -140, w: 460, h: 460, color: '#ffffff', opacity: .5 }));
      x.add(CV.S('mc0', 'circle', { x: TW / 2 - 172, y: 88, w: 344, h: 344, color: '#ffffff', opacity: .9, bw: 1, bc: 'rgba(27,34,48,.07)' }));
      x.add(CV.S('mc1', 'circle', { x: TW - 150, y: 1000, w: 110, h: 110, color: '#ffffff', opacity: .8 }));
      x.add(CV.S('mc2', 'circle', { x: 60, y: 1020, w: 76, h: 76, color: '#ffffff', opacity: .7 }));
    },
    flat: function (x) {
      var t = x.t;
      x.add(CV.S('t1', 'bar', { x: TM, y: 1114, w: 120, h: 7, color: t.accent }));
      x.add(CV.S('t2', 'circle', { x: TW - 120, y: 960, w: 48, h: 48, color: t.accent, opacity: .16 }));
    }
  };

  /* 竖版通用装饰：只用 token，不假设横向位置 */
  function tallDecor(p, x) {
    var t = x.t;
    x.add(CV.S('td1', 'circle', { x: -140, y: -120, w: 420, h: 420, color: t.accent, opacity: .05 }));
    x.add(CV.S('td2', 'bar', { x: TM, y: 1180, w: 44, h: 4, color: t.ink, opacity: .28 }));
    if (TALLDECOR[p.id]) TALLDECOR[p.id](x);
  }

  LAYOUTS.stack = tallStack;
  LAYOUTS.sheet = tallSheet;

  CV.LAYOUTS = [
    { id: 'hero', master: 'wide', name: '主视觉', tall: false },
    { id: 'poster', master: 'wide', name: '通栏大标', tall: false },
    { id: 'split', master: 'wide', name: '分栏头条', tall: false },
    { id: 'feature', master: 'wide', name: '图标巨化', tall: false },
    { id: 'stack', master: 'tall', name: '竖版堆叠', tall: true },
    { id: 'sheet', master: 'tall', name: '竖版色带', tall: true }
  ];
  /* 横竖版式的等价替换表：横版 <-> 竖版 */
  CV.ALT = { hero: 'stack', poster: 'sheet', split: 'sheet', feature: 'stack', stack: 'hero', sheet: 'poster' };

  /* ============================ 风格 ============================ */
  CV.STYLES = [
    /* 1 —— 白鸦：瑞士极简 ------------------------------ */
    {
      id: 'swiss', name: '瑞士极简', sub: '白鸦 · 留白与字号对比',
      t: { ink: '#0e1726', ink2: '#7d8fa9', accent: '#2f6bff', bgSolid: '#f4f8ff', card: '#ffffff' },
      bg: 'linear-gradient(168deg,#ffffff 0%,#f2f7ff 52%,#eaf1fe 100%)', fx: ['vignette'], dark: false,
      title: { font: 'heavy', size: 92 },
      decor: function (x) {
        var t = x.t;
        if (x.layout !== 'poster') x.add(CV.S('d1', 'bar', { x: 1088, y: 210, w: 4, h: 116, color: t.accent, opacity: .9 }));
        x.add(CV.S('d2', 'circle', { x: 672, y: 124, w: 468, h: 468, color: t.accent, opacity: .055 }));
        x.add(CV.S('d3', 'bar', { x: 64, y: 636, w: 1032, h: 1, color: t.ink, opacity: .1 }));
      }
    },
    /* 2 —— 灵感港：报刊头版 ---------------------------- */
    {
      id: 'broadsheet', name: '报刊头版', sub: '灵感港 · 纸张与衬线标题',
      t: { ink: '#241f1b', ink2: '#7a6a56', accent: '#c0392b', gold: '#bd9145', bgSolid: '#e9dfcd', card: '#f2e9d8' },
      bg: 'radial-gradient(130% 105% at 12% 0%,#fbf5e7 0%,#f2e9d6 46%,#e6dbc4 100%)',
      fx: ['paper', 'wrinkle', 'grain', 'vignette'], dark: false,
      title: { font: 'heavy', size: 86, lh: 1.06 },
      kicker: { font: 'mono', color: '#7a6a56' },
      decor: function (x) {
        var t = x.t, L = x.L;
        if (x.layout === 'split') return;
        x.add(CV.S('f1', 'rect', { x: 20, y: 20, w: W - 40, h: H - 40, color: 'transparent', bw: 3, bc: t.ink, opacity: .92 }));
        x.add(CV.S('f2', 'rect', { x: 29, y: 29, w: W - 58, h: H - 58, color: 'transparent', bw: 1, bc: t.ink, opacity: .5 }));
        if (x.layout === 'poster') {
          x.add(CV.S('r0', 'bar', { x: W / 2 - 30, y: 206, w: 60, h: 5, color: t.accent }));
          return;
        }
        x.add(CV.S('tag', 'rect', { x: M - 2, y: 34, w: 158, h: 34, color: t.accent }));
        var d = find(L, 'date');
        if (d) merge(d, { x: M - 2, y: 43, w: 158, align: 'center', size: 14, color: '#fdf6e8', ls: .04 });
        var k = find(L, 'kicker');
        if (k) merge(k, { x: M, y: 86, w: 700, ls: .2, color: t.accent });
        var s = find(L, 'series');
        if (s) merge(s, { y: 108, size: 15, ls: .3, upper: false, color: t.ink2, font: 'mono' });
        var r = find(L, 'rule');
        if (r) merge(r, { y: 138, w: 62, h: 6, color: t.accent });
        var ti = find(L, 'title');
        if (ti) merge(ti, { y: 158, w: 612, size: 88 });
        x.add(CV.S('g1', 'line', { x: M, y: 146, w: 640, h: 2, color: t.ink, opacity: .55 }));
      }
    },
    /* 3 —— 橘鸦：渐变圆格 ------------------------------ */
    {
      id: 'matrix', name: '渐变圆格', sub: '橘鸦 · 卡片与图标矩阵',
      t: { ink: '#16202e', ink2: '#8b97ab', accent: '#3b6cf0', bgSolid: '#f4f6fd', card: '#ffffff' },
      bg: 'linear-gradient(148deg,#eef3ff 0%,#f4f1fd 48%,#f9f2f7 100%)', fx: [], dark: false,
      title: { font: 'heavy', size: 88 },
      series: { font: 'mono', size: 22, ls: .06, color: '#5f7fd0' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('halo', 'circle', { x: 820, y: -170, w: 560, h: 560, color: '#ffffff', opacity: .55 }));
        var po = x.layout === 'poster';
        if (!po) {
          x.add(CV.S('card', 'round', { x: 716, y: 128, w: 380, h: 300, color: t.card, radius: 40, opacity: 1, shadow: '0 26px 60px -30px rgba(22,32,46,.36)' }));
          var ic = find(L, 'icon');
          if (ic) merge(ic, { x: 806, y: 158, w: 200, h: 200 });
          var MAT = ['OpenAI/OpenAI#symbol-color', 'Anthropic/Claude#symbol-color', 'Google/Gemini#symbol-color',
            'xAI/Grok#symbol-color', 'DeepSeek/DeepSeek#symbol-color', '月之暗面/Kimi#symbol-color',
            '智谱 AI/智谱 AI#symbol-color', 'MiniMax/MiniMax#symbol-color'];
          for (var mi = 0; mi < 8; mi++) {
            var mx = 726 + (mi % 4) * 88, my = 468 + Math.floor(mi / 4) * 88;
            x.add(CV.S('mc' + mi, 'circle', { x: mx, y: my, w: 72, h: 72, color: '#ffffff', opacity: .92, bw: 1, bc: 'rgba(22,32,46,.08)' }));
            x.add(CV.I('mi' + mi, MAT[mi], { x: mx + 14, y: my + 14, w: 44, h: 44, opacity: .88 }));
          }
        }
        x.add(CV.S('line1', 'line', { x: M, y: 120, w: 620, h: 1, color: t.ink, opacity: .12 }));
      }
    },
    /* 4 —— JJZY：纸质涂鸦 ------------------------------ */
    {
      id: 'paperdoodle', name: '纸质涂鸦', sub: '渐近自由 · 高饱和手作感',
      t: { ink: '#2a1a20', ink2: '#7a5a4e', accent: '#d0383f', yellow: '#f4bd2a', blue: '#2f5fd0', bgSolid: '#e7dac8' },
      bg: 'radial-gradient(120% 100% at 20% 0%,#f1e6d4 0%,#e7dac8 52%,#dfd0b8 100%)',
      fx: ['paper', 'wrinkle', 'grain'], dark: false,
      title: { font: 'heavy', size: 90, color: '#c8302f', lh: 1.04 },
      sub: { color: '#4a2f34' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('edge', 'rect', { x: 0, y: 0, w: 16, h: H, color: t.yellow }));
        x.add(CV.S('ul', 'bar', { x: 70, y: 372, w: 292, h: 13, color: t.yellow, rot: -1.1, radius: 8, opacity: .92 }));
        x.add(CV.S('c1', 'circle', { x: 1026, y: 560, w: 60, h: 60, color: t.blue, opacity: .92 }));
        x.add(CV.S('c2', 'circle', { x: 942, y: 618, w: 24, h: 24, color: t.accent }));
        x.add(CV.S('c3', 'ring', { x: 700, y: 44, w: 66, h: 66, color: 'transparent', bw: 6, bc: t.yellow, opacity: .9 }));
      }
    },
    /* 5 —— 白洛奇：白卡蓝字 ---------------------------- */
    {
      id: 'cardlight', name: '白卡蓝字', sub: '白洛奇 · 圆角卡片与标签',
      t: { ink: '#0f1115', ink2: '#7f8b99', accent: '#2f6bff', bgSolid: '#eef3f7', card: '#ffffff', pill: '#e6efff' },
      bg: 'linear-gradient(160deg,#f4f8fb 0%,#eef3f7 60%,#e9eff5 100%)', fx: [], dark: false,
      title: { font: 'heavy', size: 84, color: '#12306b' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('card', 'round', { x: 40, y: 118, w: 700, h: 470, color: t.card, radius: 30, shadow: '0 30px 70px -34px rgba(15,17,21,.28)' }));
        x.add(CV.S('pill', 'round', { x: M + 8, y: 140, w: 156, h: 30, color: t.pill, radius: 99 }));
        var s = find(L, 'series');
        if (s) merge(s, { y: 148, size: 15, ls: .12, upper: true, color: t.accent, font: 'mono' });
        var k = find(L, 'kicker');
        if (k) merge(k, { y: 96, size: 13, color: '#9aa7b5' });
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 72, y: 206, w: 636, size: 80 });
        var r = find(L, 'rule');
        if (r) merge(r, { x: 72, y: 190, w: 60, h: 4 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 72, y: 486, w: 620, size: 21 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 800, y: 210, w: 300, h: 300 });
      }
    },
    /* 6 —— 绿鸭 / 黑鸦：米底红字 ------------------------ */
    {
      id: 'beigeRed', name: '米底红字', sub: '绿鸭 · 黑鸦 · 超粗压缩',
      t: { ink: '#14110e', ink2: '#8a7a68', accent: '#b81f2b', grad: 'linear-gradient(135deg,#2f6bd6 0%,#7c3aed 52%,#c026d3 100%)' },
      bg: 'radial-gradient(130% 110% at 78% 6%,#ffffff 0%,#fbf7ee 46%,#f4eddc 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'black', size: 128, lh: .95, ls: -.03, color: '#b81f2b', stroke: 13, strokeColor: '#ffffff' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('star', 'star4', { x: 598, y: 128, w: 430, h: 430, color: t.grad, dieCut: 15 }));
        x.add(CV.S('tag', 'round', { x: 52, y: 42, w: 200, h: 44, color: '#2f7d4f', radius: 99 }));
        var s = find(L, 'series');
        if (s) merge(s, { x: 62, y: 54, w: 180, size: 19, color: '#f4fbf6', align: 'center', ls: .02 });
        var k = find(L, 'kicker');
        if (k) merge(k, { opacity: 0 });
        var d = find(L, 'date');
        if (d) merge(d, { x: 880, y: 48, w: 224, size: 26, color: t.ink, align: 'right' });
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 44, y: 168, w: 560, size: 128, maxH: 400 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 60, y: 520, w: 148, h: 148, opacity: .95 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 236, y: 548, w: 380, size: 20, color: '#5a4a3c' });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 56, y: 668, w: 600, size: 11, color: '#8a7a68' });
        var fl = find(L, 'footline');
        if (fl) merge(fl, { opacity: 0 });
        var r = find(L, 'rule');
        if (r) merge(r, { x: 52, y: 130, w: 88, h: 6 });
      }
    },
    /* 7 —— 荡殇：暗色杂志 ------------------------------ */
    {
      id: 'noir', name: '暗色杂志', sub: '荡殇 · 发光与斜体',
      t: { ink: '#f3f5f9', ink2: '#8b97ab', accent: '#ff3b30', violet: '#6d5cff', bandInk: '#f3f5f9' },
      bg: 'radial-gradient(130% 105% at 74% 12%,#1b2233 0%,#11151f 44%,#080a0e 100%)',
      fx: ['glow', 'grain', 'scan'], dark: true,
      title: { font: 'heavy', size: 88, color: '#f7f9fc', shadow: 'glow' },
      series: { color: '#f3f5f9' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('r1', 'ring', { x: 770, y: 96, w: 356, h: 356, color: 'transparent', bw: 1.5, bc: 'rgba(243,245,249,.24)' }));
        x.add(CV.S('r2', 'ring', { x: 846, y: 172, w: 204, h: 204, color: 'transparent', bw: 1, bc: 'rgba(243,245,249,.16)' }));
        x.add(CV.S('orb', 'circle', { x: 916, y: 242, w: 64, h: 64, color: t.accent, opacity: .95, shadow: '0 0 60px 20px rgba(255,59,48,.5)' }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 866, y: 192, w: 164, h: 164, opacity: .9 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { size: 86, ls: -.01 });
        x.add(CV.S('top', 'line', { x: M, y: 112, w: 420, h: 1, color: t.ink, opacity: .18 }));
      }
    },
    /* 8 —— 小明：高对比数据 ---------------------------- */
    {
      id: 'data', name: '高对比数据', sub: '小小小名 · 图表与硬边',
      t: { ink: '#0a0a0a', ink2: '#7a7a7a', accent: '#e2231a', bgSolid: '#fbfbfa' },
      bg: 'linear-gradient(180deg,#ffffff 0%,#fbfbfa 60%,#f2f2f0 100%)', fx: ['grain'], dark: false,
      title: { font: 'heavy', size: 96, color: '#0a0a0a', lh: .98, ls: -.02 },
      decor: function (x) {
        var t = x.t, L = x.L;
        var po = x.layout === 'poster';
        if (po) {
          x.add(CV.S('hard', 'rect', { x: 366, y: 96, w: 428, h: 428, color: 'transparent', bw: 2, bc: t.ink, opacity: .16 }));
          x.add(CV.R('radar', radar([.82, .95, .62, .74, .9, .56]), { x: 396, y: 126, w: 368, h: 368, opacity: .28 }));
        } else {
          x.add(CV.S('fill', 'rect', { x: 712, y: 128, w: 392, h: 392, color: '#ffffff' }));
          x.add(CV.S('hard', 'rect', { x: 712, y: 128, w: 392, h: 392, color: 'transparent', bw: 3, bc: t.ink, opacity: .92 }));
          x.add(CV.R('radar', radar([.82, .95, .62, .74, .9, .56]), { x: 730, y: 146, w: 356, h: 356, opacity: .2 }));
        }
        var ic0 = find(L, 'icon');
        if (ic0) merge(ic0, po ? { x: W / 2 - 54, y: 18, w: 108, h: 108 } : { x: 796, y: 212, w: 224, h: 224 });
        x.add(CV.S('b1', 'rect', { x: M, y: 612, w: 150, h: 4, color: t.accent }));
        x.add(CV.T('bignum', (x.c.badge || '22') + '', { x: 900, y: 566, w: 200, size: 92, font: 'impact', color: t.accent, align: 'right', rot: 0 }));
      }
    },
    /* 9 —— 小心鸦：柔和渐变 ---------------------------- */
    {
      id: 'pastel', name: '柔和渐变', sub: '小心鸦 · 柔光与细描边',
      t: { ink: '#2a2028', ink2: '#9b8a94', accent: '#c9607a', bgSolid: '#fbf2f5', card: '#ffffff' },
      bg: 'linear-gradient(158deg,#fdf1f4 0%,#f6f2fb 52%,#eef1fb 100%)', fx: [], dark: false,
      title: { font: 'heavy', size: 84, color: '#3a2730' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('b1', 'circle', { x: -170, y: -140, w: 520, h: 520, color: '#ffffff', opacity: .62 }));
        x.add(CV.S('b2', 'circle', { x: 860, y: 430, w: 420, h: 420, color: '#ffe4ee', opacity: .7 }));
        x.add(CV.S('card', 'round', { x: 678, y: 148, w: 424, h: 424, color: t.card, radius: 32, opacity: .96, bw: 1, bc: 'rgba(42,32,40,.07)' }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 730, y: 200, w: 320, h: 320 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { w: 580, size: 82 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { w: x.layout === 'poster' ? 780 : 520 });
      }
    },
    /* 10 —— 构成主义 ----------------------------------- */
    {
      id: 'constructivism', name: '构成主义', sub: '斜切 · 红黑 · 钢铁几何',
      t: { ink: '#16130f', ink2: '#6b6357', accent: '#d61f16', steel: '#4d4841', bgSolid: '#e2d9c6' },
      bg: 'radial-gradient(125% 110% at 18% 4%,#efe7d6 0%,#e2d9c6 46%,#d3c7ad 100%)',
      fx: ['paper', 'wrinkle', 'grain', 'vignette'], dark: false,
      title: { font: 'black', size: 88, lh: .94, ls: -.025, color: '#16130f' },
      decor: function (x) {
        var t = x.t, L = x.L;
        var po = x.layout === 'poster';
        x.add(CV.S('b1', 'rect', { x: po ? 880 : 766, y: po ? 486 : 436, w: po ? 560 : 690, h: 88, color: t.accent, rot: -13 }));
        x.add(CV.S('b2', 'rect', { x: po ? 880 : 766, y: po ? 388 : 340, w: po ? 560 : 690, h: 6, color: t.ink, rot: -13, opacity: .85 }));
        x.add(CV.S('b3', 'rect', { x: po ? 880 : 766, y: po ? 590 : 542, w: po ? 560 : 690, h: 3, color: t.ink, rot: -13, opacity: .5 }));
        x.add(CV.S('ring', 'ring', { x: po ? 848 : 760, y: po ? 132 : 96, w: 236, h: 236, color: 'transparent', bw: 16, bc: t.ink, opacity: .92 }));
        x.add(CV.S('wedge', 'wedge', { x: 0, y: 0, w: 230, h: 230, color: t.ink, opacity: .07 }));
        x.add(CV.S('bar', 'rect', { x: 1044, y: 0, w: 7, h: H, color: t.ink, opacity: .8 }));
        x.add(CV.T('num', (x.c.badge || ''), { x: 700, y: po ? 596 : 570, w: 320, size: 104, font: 'impact', color: t.ink, align: 'center', rot: -6, opacity: .92 }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, po ? { x: W / 2 - 80, y: 380, w: 160, h: 160 } : { x: 846, y: 96, w: 172, h: 172, opacity: 1 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { y: 168, w: 620, size: 84 });
      }
    },
    /* 11 —— 包豪斯 ------------------------------------- */
    {
      id: 'bauhaus', name: '包豪斯', sub: '三原色 · 基本形 · 网格',
      t: { ink: '#14110e', ink2: '#6f675c', accent: '#dd3b1f', red: '#dd3b1f', yellow: '#f0b429', blue: '#1e4fd8', bgSolid: '#f1ece1' },
      bg: 'linear-gradient(180deg,#f6f2e9 0%,#f1ece1 48%,#e9e3d5 100%)', fx: ['grain'], dark: false,
      title: { font: 'black', size: 84, lh: .98, ls: -.02, color: '#14110e' },
      decor: function (x) {
        var t = x.t, L = x.L;
        var po = x.layout === 'poster';
        x.add(CV.S('c', 'circle', { x: po ? 52 : 1022, y: po ? 92 : (x.layout === 'split' ? 126 : 44), w: po ? 148 : 118, h: po ? 148 : 118, color: t.red }));
        x.add(CV.S('sq', 'rect', { x: po ? 1024 : 1004, y: po ? 108 : 494, w: po ? 116 : 128, h: po ? 116 : 128, color: t.blue, rot: 10 }));
        x.add(CV.S('tr', 'tri', { x: po ? 1040 : 664, y: po ? 470 : 466, w: 128, h: 112, color: t.yellow }));
        x.add(CV.S('bar1', 'rect', { x: 0, y: 640, w: W, h: 80, color: t.ink }));
        x.add(CV.S('bar2', 'rect', { x: 0, y: 640, w: 132, h: 80, color: t.red }));
        x.add(CV.S('bar3', 'rect', { x: 132, y: 640, w: 132, h: 80, color: t.yellow }));
        x.add(CV.S('bar4', 'rect', { x: 264, y: 640, w: 132, h: 80, color: t.blue }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, po ? { x: W / 2 - 54, y: 46, w: 108, h: 108 } : { x: 744, y: 178, w: 280, h: 280, opacity: 1 });
        var ti = find(L, 'title');
        if (ti) merge(ti, po ? { y: 246, w: 860, x: 150, size: 104 } : { y: 158, w: 604 });
        var f = find(L, 'foot');
        if (f) merge(f, { y: 662, x: 424, w: 520, color: '#f6f2e9' });
        if (po || x.layout === 'feature') {
          var sq = find(L, 'series');
          if (sq) merge(sq, { x: 424, w: 452, align: 'left', color: '#f6f2e9' });
          var dq = find(L, 'date');
          if (dq) merge(dq, { color: '#f6f2e9' });
        }
        var fl = find(L, 'footline');
        if (fl) merge(fl, { opacity: 0 });
      }
    },

    /* 12 —— 荡殇永魔：撕纸拼贴 ----------------------------- */
    {
      id: 'zine', name: '撕纸拼贴', sub: '荡殇永魔 · 剪纸屑与粗黑对照',
      t: { ink: '#141210', ink2: '#6d6459', accent: '#c8102e', blue: '#1c5fd0', bgSolid: '#f7f6f2' },
      bg: 'linear-gradient(168deg,#faf9f5 0%,#f4f2ec 55%,#e9e6dd 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'black', size: 122, lh: .92, ls: -.035, color: '#141210' },
      decor: function (x) {
        var t = x.t, L = x.L, lay = x.layout;
        x.add(CV.S('wall', 'rect', { x: 0, y: 0, w: W, h: H, color: '#f3f1ea', opacity: 1 }));
        var cw = lay === 'poster' ? 1080 : 742;
        x.add(CV.S('clip', 'rect', {
          x: 20, y: 16, w: cw, h: H - 32, color: '#fdfcf8', rot: -1.1,
          shadow: '0 26px 60px -26px rgba(40,32,18,.45)'
        }));
        x.add(CV.S('shade', 'rect', { x: cw - 44, y: 0, w: 56, h: H, color: 'linear-gradient(to right,rgba(80,64,38,0),rgba(80,64,38,.16))' }));
        x.add(CV.R('tear', tearRaw(54), { x: cw - 6, y: 0, w: 54, h: H }));
        if (cw + 380 < W) {
          x.add(CV.R('chart', radarHand(), { x: cw + 34, y: 190, w: 236, h: 236, opacity: .95 }));
          var LW = 112, RX = W - LW - 44;   /* 右内边距 44px，远离画布边缘 */
          var labs = [['前端', '60.33', cw + 118, 156], ['后端', '55.34', Math.min(cw + 292, RX), 248],
          ['算法', '79.79', Math.min(cw + 286, RX), 392], ['数据', '69.81', cw + 24, 392], ['研究', '85.07', cw + 118, 500]];
          labs.forEach(function (l, i) {
            x.add(CV.T('lb' + i, l[0], { x: l[2], y: l[3], w: 112, size: 15, font: 'hand', color: '#141210', align: 'center' }));
            x.add(CV.T('lv' + i, l[1], { x: l[2], y: l[3] + 20, w: 112, size: 15, font: 'hand', color: t.accent, align: 'center' }));
          });
        }
        var ti = find(L, 'title');
        if (ti) merge(ti, lay === 'poster' ? { size: 118 } : { x: 46, y: 118, w: cw - 96, size: 118, maxH: 420 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, lay === 'poster' ? { x: W / 2 - 54, y: 24, w: 108, h: 108 } : { x: cw + 40, y: 562, w: 150, h: 150, opacity: .9 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 46, y: 566, w: cw - 130, size: 22, color: '#3a332b' });
        var k = find(L, 'kicker');
        if (k) merge(k, { x: 46, y: 52, w: cw - 200, size: 14, color: t.ink2 });
        var s = find(L, 'series');
        if (s) merge(s, { x: 46, y: 76, w: 520, size: 24, color: t.ink });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 46, y: 652, w: 620, size: 12, color: t.ink2 });
        var r = find(L, 'rule');
        if (r) merge(r, { x: 46, y: 110, w: 74, h: 6, color: t.accent });
        var d0 = find(L, 'date'); if (d0) d0.opacity = 0;    /* 撕纸版不用日期层 */
      }
    },
    /* 13 —— 黑鸦：贴纸描边 --------------------------------- */
    {
      id: 'sticker', name: '贴纸描边', sub: '黑鸦 · 巨号白描边红字',
      t: { ink: '#17130f', ink2: '#8a7a5f', accent: '#cf1f26', blue: '#2f6bd6', bgSolid: '#fdf8e9' },
      bg: 'linear-gradient(180deg,#fffdf4 0%,#fbf3dd 56%,#f6ebd0 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'black', size: 132, lh: .94, ls: -.03, color: '#cf1f26', stroke: 15, strokeColor: '#ffffff', stroke2: 3, stroke2Color: '#241d15' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('rule', 'bar', { x: 56, y: 104, w: W - 112, h: 1, color: t.ink, opacity: .18 }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 596, y: 150, w: 470, h: 470, dieCut: 16 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 44, y: 176, w: 560, size: 132, maxH: 400 });
        var s = find(L, 'series');
        if (s) merge(s, { x: 56, y: 46, w: 420, size: 27, color: t.ink });
        var d = find(L, 'date');
        if (d) merge(d, { x: 900, y: 40, w: 204, size: 27, align: 'right', color: t.ink, ls: .02 });
        var k = find(L, 'kicker');
        if (k) merge(k, { opacity: 0 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 56, y: 610, w: 600, size: 19, color: '#8a7a5f' });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 56, y: 668, w: 600, size: 11, color: '#a2937a' });
        var fl = find(L, 'footline');
        if (fl) merge(fl, { opacity: 0 });
      }
    },
    /* 14 —— 渐近自由：糖果立体字 --------------------------- */
    {
      id: 'candy', name: '糖果立体字', sub: '渐近自由 · 渐变描边厚投影',
      t: { ink: '#20170f', ink2: '#7c6a52', accent: '#c0392b', yellow: '#f6c945', bgSolid: '#e9dcc6' },
      bg: 'radial-gradient(125% 105% at 24% 2%,#f3e8d3 0%,#e9dcc6 50%,#dccdb2 100%)',
      fx: ['paper', 'wrinkle', 'grain'], dark: false,
      title: {
        font: 'heavy', size: 104, lh: 1.0, ls: -.02, color: '#f8d24a',
        stroke: 9, strokeColor: '#1b1410', shadow: 'candy'
      },
      decor: function (x) {
        var t = x.t, L = x.L;
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 62, w: 700 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 768, y: 196, w: 316, h: 316 });
        x.add(CV.S('edge', 'rect', { x: 0, y: 0, w: 14, h: H, color: t.accent, opacity: .9 }));
        x.add(CV.S('ul', 'bar', { x: 74, y: 434, w: 288, h: 12, color: t.yellow, rot: -1.2, radius: 8, opacity: .85 }));
      }
    },

    /* 15 —— 报纸·经典 */

    /* 15 —— 报纸·华尔街 */

    /* 15 —— 报纸·泰晤士 */

    /* 15 —— 报纸·现代 */

    /* 15 —— 报纸·复古 */

    /* 16 —— 技术编辑部 ------------------------------------ */
    {
      id: 'editorial', name: '技术编辑部', sub: '小小小名 · 规格表与细密标注',
      t: { ink: '#0b0b0c', ink2: '#77787c', accent: '#e2231a', bgSolid: '#fbfbfa' },
      bg: 'linear-gradient(180deg,#ffffff 0%,#fbfbfa 62%,#f1f1ef 100%)',
      fx: ['grain'], dark: false,
      title: { font: 'black', size: 92, lh: .98, ls: -.03, color: '#0b0b0c' },
      decor: function (x) {
        var t = x.t, L = x.L;
        if (x.layout === 'split') return;
        x.add(CV.S('top', 'bar', { x: 56, y: 40, w: 1048, h: 2, color: t.ink }));
        x.add(CV.S('bot', 'bar', { x: 56, y: 664, w: 1048, h: 2, color: t.ink }));
        x.add(CV.S('box', 'rect', { x: 700, y: 96, w: 404, h: 404, color: 'transparent', bw: 2, bc: t.ink }));
        x.add(CV.T('nolabel', 'No.561 / SPEC SHEET', {
          x: 56, y: 50, w: 420, size: 10.5, font: 'mono', ls: .34, color: t.ink2
        }));
        x.add(CV.T('seq', '01 — 06', {
          x: 960, y: 50, w: 144, size: 10.5, font: 'mono', ls: .3, color: t.ink2, align: 'right'
        }));
        var rows = [
          ['MODEL', 'AI 日报'],
          ['PERIOD', x.c.date || '2026.10.28'],
          ['ENTRIES', '22 条'],
          ['LATENCY', '5 min 54 s']
        ];
        rows.forEach(function (r, i) {
          x.add(CV.T('sk' + i, r[0], { x: 700, y: 512 + i * 34, w: 110, size: 10, font: 'mono', ls: .22, color: t.ink2 }));
          x.add(CV.T('sv' + i, r[1], { x: 812, y: 508 + i * 34, w: 292, size: 15, font: 'bold', weight: 700, ls: .02, color: t.ink }));
          if (i) x.add(CV.S('sl' + i, 'bar', { x: 700, y: 508 + i * 34, w: 404, h: 1, color: t.ink, opacity: .12 }));
        });
        x.add(CV.T('mark', 'AI · DAILY · BRIEF', {
          x: 56, y: 606, w: 480, size: 10.5, font: 'mono', ls: .32, color: t.ink2
        }));
        x.add(CV.S('acc', 'bar', { x: 56, y: 588, w: 92, h: 4, color: t.accent }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 744, y: 140, w: 316, h: 316 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 56, y: 172, w: 616, size: 88 });
        var k = find(L, 'kicker');
        if (k) merge(k, { x: 56, y: 110, w: 480, size: 11, ls: .2, color: t.ink2 });
        var s = find(L, 'series');
        if (s) merge(s, { x: 56, y: 74, w: 520, size: 17, ls: .04, color: t.ink });
        var d = find(L, 'date');
        if (d) merge(d, { opacity: 0 });
        var r = find(L, 'rule');
        if (r) merge(r, { x: 56, y: 148, w: 64, h: 5 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 56, y: 512, w: 600, size: 17, lh: 1.62, color: '#3d3e42' });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 56, y: 634, w: 600, size: 10.5, ls: .16, color: t.ink2 });
      }
    },

    /* 17 —— 故障拼贴 ---------------------------------------- */
    {
      id: 'glitch', name: '故障拼贴', sub: '小小小名 · 深色扫描与错位重影',
      t: { ink: '#eef2f8', ink2: '#7f8ba0', accent: '#ff2d55', cyan: '#22d3ee', bgSolid: '#0a0c11' },
      bg: 'radial-gradient(120% 100% at 70% 6%,#161b26 0%,#0d1017 52%,#06070b 100%)',
      fx: ['grain', 'scan'], dark: true,
      title: { font: 'black', size: 94, lh: .98, ls: -.03, color: '#eef2f8' },
      decor: function (x) {
        var t = x.t, L = x.L;
        var ti = find(L, 'title');
        if (ti) {
          x.add(CV.T('g1', ti.text, {
            x: ti.x - 6, y: ti.y - 2, w: ti.w, size: ti.size, font: ti.font, weight: ti.weight,
            lh: ti.lh, ls: ti.ls, align: ti.align, color: 'rgba(34,211,238,.55)', opacity: .3,
            fit: ti.fit, maxH: ti.maxH
          }));
          x.add(CV.T('g2', ti.text, {
            x: ti.x + 6, y: ti.y + 2, w: ti.w, size: ti.size, font: ti.font, weight: ti.weight,
            lh: ti.lh, ls: ti.ls, align: ti.align, color: 'rgba(255,45,85,.55)', opacity: .3,
            fit: ti.fit, maxH: ti.maxH
          }));
          if (x.layout !== 'poster') merge(ti, { x: 64, y: 158, w: 640, size: 90 });
        }
        for (var i = 0; i < 3; i++) {
          x.add(CV.S('h' + i, 'rect', { x: 1046 - i * 7, y: 118 + i * 12, w: 12, h: 92, color: t.cyan, rot: -18, opacity: .55 - i * .13 }));
        }
        x.add(CV.S('frame', 'rect', { x: 700, y: 108, w: 404, h: 404, color: 'transparent', bw: 1.5, bc: 'rgba(238,242,248,.3)' }));
        x.add(CV.S('cor1', 'rect', { x: 700, y: 108, w: 26, h: 26, color: t.accent }));
        x.add(CV.S('cor2', 'rect', { x: 1078, y: 486, w: 26, h: 26, color: t.cyan }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, x.layout === 'poster' ? { x: W / 2 - 54, y: 26, w: 108, h: 108 } : { x: 752, y: 160, w: 300, h: 300 });
      }
    },
    /* 18 —— 金色斜体 ---------------------------------------- */
    {
      id: 'golden', name: '金色斜体', sub: '灵感港 · 描金大标与叠影方块',
      t: { ink: '#241f1b', ink2: '#7a6a56', accent: '#c0392b', gold: '#c8a24a', bgSolid: '#efe6d3' },
      bg: 'radial-gradient(125% 105% at 24% 0%,#f7f0df 0%,#ece2cd 50%,#ded1b6 100%)',
      fx: ['paper', 'wrinkle', 'grain'], dark: false,
      title: { font: 'impact', size: 100, lh: .98, ls: -.005, color: '#c8a24a', italic: true, stroke: 3, strokeColor: '#2b2721' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('tag', 'rect', { x: 48, y: 34, w: 142, h: 32, color: t.accent }));
        x.add(CV.S('r1', 'bar', { x: 48, y: 92, w: W - 96, h: 2, color: t.ink, opacity: .5 }));
        x.add(CV.S('r2', 'bar', { x: 48, y: 664, w: W - 96, h: 2, color: t.ink, opacity: .5 }));
        x.add(CV.S('c1', 'rect', { x: 806, y: 150, w: 180, h: 180, color: t.gold, opacity: .95 }));
        x.add(CV.S('c2', 'rect', { x: 846, y: 190, w: 180, h: 180, color: '#9fc0e8', opacity: .9 }));
        x.add(CV.S('c3', 'rect', { x: 826, y: 170, w: 180, h: 180, color: 'transparent', bw: 2, bc: t.ink, opacity: .45 }));
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 866, y: 210, w: 140, h: 140 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 52, y: 196, w: 720, size: 96 });
        var k = find(L, 'kicker');
        if (k) merge(k, { x: 50, y: 41, w: 138, size: 10.5, color: '#fff', ls: .02, upper: false, align: 'center' });
        var s = find(L, 'series');
        if (s) merge(s, { x: 208, y: 74, w: 500, size: 15, font: 'mono', ls: .18, upper: true, color: t.ink2 });
        var d = find(L, 'date');
        if (d) merge(d, { x: 848, y: 42, w: 248, size: 13, color: t.ink2 });
        var r = find(L, 'rule');
        if (r) merge(r, { x: 52, y: 152, w: 88, h: 6, color: t.accent });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 52, y: 470, w: 560, size: 21, color: '#4a4238' });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 48, y: 678, w: 620, size: 11, ls: .1, color: t.ink2 });
      }
    },
    /* 19 —— 渐变丝带 ---------------------------------------- */
    {
      id: 'ribbon', name: '渐变丝带', sub: '绿鸭 · 2.5D 丝带与四角星',
      t: { ink: '#16130f', ink2: '#8a7a68', accent: '#b81f2b', bgSolid: '#f5f1e6' },
      bg: 'linear-gradient(160deg,#fbf7ee 0%,#f5f1e6 55%,#ebe4d4 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'heavy', size: 104, lh: .96, ls: -.025, color: '#b81f2b' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('rb1', 'round', { x: 742, y: 96, w: 400, h: 118, color: 'linear-gradient(135deg,#3b82f6 0%,#a855f7 100%)', radius: 32, rot: -22, opacity: .96 }));
        x.add(CV.S('rb2', 'round', { x: 742, y: 238, w: 400, h: 118, color: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)', radius: 32, rot: 22, opacity: .96 }));
        x.add(CV.S('star', 'star4', { x: 902, y: 386, w: 190, h: 190, color: 'linear-gradient(135deg,#22d3ee 0%,#3b82f6 100%)', opacity: .92 }));
        x.add(CV.S('tag', 'round', { x: 48, y: 36, w: 148, h: 30, color: '#2f7d4f', radius: 99 }));
        x.add(CV.S('r1', 'bar', { x: 48, y: 622, w: 96, h: 6, color: t.ink }));
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 56, y: 152, w: 640, size: 104 });
        var k = find(L, 'kicker');
        if (k && x.layout !== 'split') merge(k, { x: 62, y: 42, w: 200, size: 12, color: '#f4fbf6', ls: .04, upper: false });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 612, y: 330, w: 190, h: 190 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 56, y: 470, w: 560, size: 21 });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 56, y: 646, w: 600, size: 11, ls: .1 });
      }
    },
    /* 20 —— 衬线矩阵 ---------------------------------------- */
    {
      id: 'serifgrid', name: '衬线矩阵', sub: '橘鸦 · 衬线西文与 3x3 圆格',
      t: { ink: '#1b2230', ink2: '#7f8ea6', accent: '#3b6cf0', bgSolid: '#f6f8fd', card: '#ffffff' },
      bg: 'linear-gradient(150deg,#eef3ff 0%,#f6f2fc 48%,#fbf3f6 100%)',
      fx: [], dark: false,
      title: { font: 'serif', size: 84, lh: 1.0, ls: -.01, color: '#1b2230' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('halo', 'circle', { x: 860, y: -180, w: 540, h: 540, color: '#ffffff', opacity: .5 }));
        var MAT = ['OpenAI/OpenAI#symbol-color', 'Anthropic/Claude#symbol-color', 'Google/Gemini#symbol-color',
          'xAI/Grok#symbol-color', 'DeepSeek/DeepSeek#symbol-color', '月之暗面/Kimi#symbol-color',
          '智谱 AI/智谱 AI#symbol-color', 'MiniMax/MiniMax#symbol-color', '字节跳动/豆包#symbol-color'];
        for (var i = 0; i < 9; i++) {
          var cx = 728 + (i % 3) * 118, cy = 148 + Math.floor(i / 3) * 118;
          x.add(CV.S('mc' + i, 'circle', { x: cx, y: cy, w: 100, h: 100, color: '#ffffff', opacity: .96, bw: 1, bc: 'rgba(27,34,48,.07)' }));
          if (i === 4) continue;
          x.add(CV.I('mi' + i, MAT[i], { x: cx + 24, y: cy + 24, w: 52, h: 52, opacity: .92 }));
        }
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 64, y: 186, w: 600, size: 80 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 64, y: 430, w: 520, size: 21 });
        var s = find(L, 'series');
        if (s) merge(s, { x: 64, y: 96, w: 520, size: 20, font: 'mono', ls: .12, upper: true, color: t.accent });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 850, y: 270, w: 56, h: 56, opacity: 1 });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 64, y: 662, w: 600, size: 12, ls: .06 });
      }
    },
    /* 21 —— 极简巨字 ---------------------------------------- */
    {
      id: 'flat', name: '极简巨字', sub: '黑鸦 · 纯色底与两行巨字',
      t: { ink: '#16130f', ink2: '#7d7362', accent: '#d8232a', bgSolid: '#f7edd8' },
      bg: 'linear-gradient(180deg,#fcf5e3 0%,#f6eacf 58%,#efe0c0 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'black', size: 138, lh: .92, ls: -.035, color: '#16130f' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('r1', 'bar', { x: 56, y: 618, w: 112, h: 7, color: t.accent }));
        var ti = find(L, 'title');
        if (ti) merge(ti, x.layout === 'poster' ? { size: 128 } : { x: 52, y: 150, w: 700, size: 136, maxH: 380 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, x.layout === 'poster' ? { x: W / 2 - 54, y: 26, w: 108, h: 108 } : { x: 792, y: 196, w: 300, h: 300 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 56, y: 486, w: 560, size: 21 });
        var s = find(L, 'series');
        if (s) merge(s, { x: 56, y: 74, w: 520, size: 19, font: 'mono', ls: .1, upper: true, color: t.ink2 });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 56, y: 642, w: 600, size: 11, ls: .1 });
      }
    },

    /* 22 —— 小心鸦：按 1600×900 原图实测比例复刻 ---------------- */
    {
      id: 'xiaoxinya', name: '小心鸦', sub: '小心鸦Xxya · 浅渐变白卡', noPaper: true,
      t: { ink: '#141517', ink2: '#8e9096', card: '#ffffff', brand: '#da7858' },
      bg: 'linear-gradient(115deg,#f2d0c6 0%,#fbf1ef 46%,#fbf1ef 62%,#f4dbd4 100%)',
      fx: [], dark: false,
      title: { font: 'heavy', size: 87, weight: 900, lh: 1.04, ls: -.01, color: '#da7858', fit: false, maxH: 0 },
      decor: function (x) {
        var t = x.t, L = x.L, lay = x.layout;
        var Wd = x.W, Ht = x.H;
        var brand = x.brand || t.brand;
        x.bgOverride = 'linear-gradient(118deg,' + CV.tint(brand, 0.52) + ' 0%,' + CV.tint(brand, 0.86) + ' 34%,' +
          CV.tint(brand, 0.93) + ' 58%,' + CV.tint(brand, 0.94) + ' 74%,' + CV.tint(brand, 0.78) + ' 100%)';

        /* 白卡（实测：x 5.5%W, y 26.7%H, 29.4%W × 52.4%H, 圆角 3.75%W） */
        x.add(CV.S('card', 'round', {
          x: Math.round(Wd * 0.055), y: Math.round(Ht * 0.2667),
          w: Math.round(Wd * 0.2938), h: Math.round(Ht * 0.5244),
          color: t.card, radius: Math.round(Wd * 0.0375),
          shadow: '0 22px 44px -26px rgba(120,60,40,.35)'
        }));

        if (lay === 'poster') {   /* posterHideSub */
          var icp = find(L, 'icon');
          if (icp) merge(icp, { x: Math.round(Wd / 2 - Wd * 0.0844), y: Math.round(Ht * 0.30), w: Math.round(Wd * 0.169), h: Math.round(Wd * 0.169) });
          var sb0 = find(L, 'sub'); if (sb0) sb0.opacity = 0;
          var tp = find(L, 'title');
          if (tp) merge(tp, { x: Math.round(Wd * 0.08), y: Math.round(Ht * 0.60), w: Math.round(Wd * 0.84), align: 'center', size: Math.round(Wd * 0.062), color: brand });
          ['date', 'series', 'rule', 'foot', 'footline'].forEach(function (r) { var l = find(L, r); if (l) l.opacity = 0; });
          var kp = find(L, 'kicker');
          if (kp) merge(kp, { x: Math.round(Wd * 0.08), y: Math.round(Ht * 0.55), w: Math.round(Wd * 0.84), align: 'center', size: Math.round(Wd * 0.0188), color: t.ink2 });
          return;
        }

        /* 左上白圈（实测：中心 8.4%W, 14.1%H，直径 4.9%W） */
        /* 左上白圈里放一个同品牌小图标 */
        var d0 = Math.round(Wd * 0.0488);
        x.add(CV.S('dot0', 'circle', {
          x: Math.round(Wd * 0.0844 - d0 / 2), y: Math.round(Ht * 0.1411 - d0 / 2), w: d0, h: d0,
          color: '#ffffff', bw: 2, bc: 'rgba(255,255,255,.9)',
          shadow: '0 6px 16px -6px rgba(150,80,55,.35)'
        }));

        x.add(CV.I('minilogo', x.c.icon, {
          x: Math.round(Wd * 0.0844 - d0 * 0.30), y: Math.round(Ht * 0.1411 - d0 * 0.30),
          w: Math.round(d0 * 0.60), h: Math.round(d0 * 0.60)
        }));

        /* 右上 pill（实测：x 82.6%W, y 5.6%H, 12.5%W × 5.6%H；实心品牌色 + 白字） */
        var pw = Math.round(Wd * 0.125), ph = Math.round(Ht * 0.0556);
        x.add(CV.S('pill', 'round', { x: Math.round(Wd * 0.826), y: Math.round(Ht * 0.0556), w: pw, h: ph, color: brand, radius: 999 }));
        x.add(CV.T('pilltext', 'AI 快讯', {
          x: Math.round(Wd * 0.826), y: Math.round(Ht * 0.0556 + ph * 0.24), w: pw,
          size: Math.round(Wd * 0.0138), font: 'noto', weight: 700, color: '#ffffff', align: 'center', ls: .01
        }));

        /* focus 行（实测：x 40%W, y 29.8%H, 30px@1600） */
        var k = find(L, 'kicker');
        if (k) merge(k, {
          x: Math.round(Wd * 0.40), y: Math.round(Ht * 0.298), w: Math.round(Wd * 0.55),
          size: Math.round(Wd * 0.0188), font: 'noto', weight: 700, ls: .06,
          color: CV.tint(brand, 0.18), upper: false
        });

        /* 标题（实测：x 40%W, y 36.7%H, 字号 7.5%W, lh 1.04） */
        var ti = find(L, 'title');
        if (ti) merge(ti, {
          x: Math.round(Wd * 0.40), y: Math.round(Ht * 0.367), w: Math.round(Wd * 0.56),
          size: Math.round(Wd * 0.075), font: 'noto', weight: 700, lh: 1.04, ls: 0,
          color: brand, fit: false, maxH: 0, stroke: 2.2 * (Wd / 1160), strokeColor: 'rgba(255,255,255,.34)'
        });

        /* 日期（实测：右边缘 95.1%W, 顶部 15%H, 90px@1600） */
        var d = find(L, 'date');
        if (d) merge(d, {
          x: Math.round(Wd * 0.60), y: Math.round(Ht * 0.148), w: Math.round(Wd * 0.351),
          size: Math.round(Wd * 0.0563), font: 'bold', weight: 700, ls: -.02, color: t.ink, align: 'right'
        });

        /* 副信息（实测：x 40%W, y 68.3%H, 46px@1600） */
        var sb = find(L, 'sub');
        if (sb) merge(sb, {
          x: Math.round(Wd * 0.40), y: Math.round(Ht * 0.683), w: Math.round(Wd * 0.56),
          size: Math.round(Wd * 0.0288), font: 'bold', weight: 700, lh: 1.35, color: t.ink
        });

        /* 图标进卡（实测 16.9%W 居中） */
        var ic = find(L, 'icon');
        if (ic) merge(ic, {
          x: Math.round(Wd * 0.055 + Wd * 0.2938 / 2 - Wd * 0.0844),
          y: Math.round(Ht * 0.2667 + Ht * 0.5244 / 2 - Wd * 0.0844),
          w: Math.round(Wd * 0.169), h: Math.round(Wd * 0.169)
        });

        ['series', 'rule', 'foot', 'footline'].forEach(function (r) { var l = find(L, r); if (l) l.opacity = 0; });
      }
    },

    /* 23 —— 渐近自由：米色纸 + 巨型贴纸图标 + 黄红两行粗描边标题 ------ */
    {
      id: 'jianjinziyou', name: '渐近自由', sub: '渐近自由JJZY · 贴纸大字', qaBleed: true,
      t: { ink: '#14100a', ink2: '#5a5140', paper: '#e9ddc4', yellow: '#f5c33b', red: '#f0555b' },
      bg: '#eae0c8',
      paperCfg: { on: false, opacity: 20, noise: 42, scale: 320 },
      fx: ['grain'],
      dark: false,
      title: { font: 'heavy', size: 157, weight: 900, lh: 1.02, ls: 0, color: '#f5c33b', fit: false, maxH: 0,
               stroke: 14, strokeColor: '#14100a', stroke2: 5, stroke2Color: '#ffffff' },
      decor: function (x) {
        var t = x.t, L = x.L, lay = x.layout;
        var Wd = x.W, Ht = x.H;
        var k = Wd / 1600;

        var head = Math.round(Wd * 0.0325);
        var stk = Math.max(2, Math.round(14 * k));      /* 黑描边 */
        var stk2 = Math.max(1, Math.round(5 * k));      /* 白外圈 */

        /* 页眉：左标题 + 右日期 + 细分隔线 */
        var se = find(L, 'series');
        if (se) merge(se, {
          x: Math.round(Wd * 0.094), y: Math.round(Ht * 0.010), w: Math.round(Wd * 0.42),
          size: head, font: 'heavy', weight: 900, ls: .10, color: t.ink, upper: false, opacity: 1
        });
        var da = find(L, 'date');
        if (da) merge(da, {
          x: Math.round(Wd * 0.68), y: Math.round(Ht * 0.012), w: Math.round(Wd * 0.245),
          size: head, font: 'heavy', weight: 900, ls: .06, color: t.ink, align: 'right'
        });
        var ru = find(L, 'rule');
        if (ru) merge(ru, {
          x: Math.round(Wd * 0.0625), y: Math.round(Ht * 0.078), w: Math.round(Wd * 0.875),
          h: Math.max(1, Math.round(1.6 * k)), color: 'rgba(20,16,10,.20)', radius: 0, opacity: 1
        });
        var ki = find(L, 'kicker');
        if (ki) merge(ki, { opacity: 0 });

        /* 巨型贴纸图标（白发光边） */
        var size = Math.round(Wd * 0.47);
        var ic = find(L, 'icon');
        if (ic) merge(ic, {
          x: Math.round(-Wd * 0.02), y: Math.round(Ht * 0.085), w: size, h: size,
          filter: 'drop-shadow(0 0 ' + Math.round(10 * k) + 'px #fff) drop-shadow(0 0 ' + Math.round(18 * k) + 'px rgba(255,255,255,.85))'
        });

        /* 标题按行拆层，黄/红交替 */
        var lines = String(x.c.title || '').split('\n').filter(function (s) { return s.trim(); });
        var cols = [t.yellow, t.red, t.yellow, t.red];
        var tsize = Math.round(Wd * 0.135);
        var ty = [0.117, 0.578, 0.800, 1.02];
        var tx = [0.306, 0.312, 0.312, 0.312];

        var ti = find(L, 'title');
        if (ti) {
          if (lines.length) merge(ti, {
            x: Math.round(Wd * tx[0]), y: Math.round(Ht * ty[0]), w: Math.round(Wd * (1 - tx[0] - 0.006)),
            text: lines[0], size: tsize, color: cols[0], font: 'heavy', weight: 900, lh: 1.02, ls: 0,
            stroke: stk, strokeColor: t.ink, stroke2: stk2, stroke2Color: '#ffffff',
            fit: false, maxH: 0, align: 'left'
          });
          else merge(ti, { opacity: 0 });
        }
        for (var i = 1; i < lines.length && i < 4; i++) {
          x.add(CV.T('title' + (i + 1), lines[i], {
            x: Math.round(Wd * tx[i]), y: Math.round(Ht * ty[i]), w: Math.round(Wd * (1 - tx[i] - 0.006)),
            size: tsize, color: cols[i], font: 'heavy', weight: 900, lh: 1.02, ls: 0,
            stroke: stk, strokeColor: t.ink, stroke2: stk2, stroke2Color: '#ffffff'
          }));
        }

        /* 副信息放底部（若内容里有） */
        var sb = find(L, 'sub');
        if (sb) merge(sb, { opacity: 0 });
        var ft = find(L, 'foot');
        if (ft) merge(ft, { opacity: 0 });
        var fl = find(L, 'footline');
        if (fl) merge(fl, { opacity: 0 });
      }
    }
,

    /* 24 —— 橘鸦：极浅底 + 两行粗标题 + 图标圆阵 ---------------- */
    {
      id: 'juya', name: '橘鸦', sub: '橘鸦Juya · 图标圆阵',
      t: { ink: '#101114', ink2: '#6b7280', brand: '#4285f4' },
      bg: 'linear-gradient(180deg,#ffffff 0%,#f7f9fc 58%,#f2f6fd 100%)',
      paperCfg: { on: false, opacity: 8, noise: 10, scale: 360 },
      fx: [],
      dark: false,
      title: { font: 'heavy', size: 101, weight: 800, lh: 1.04, ls: -.015, color: '#101114', fit: false, maxH: 0 },
      decor: function (x) {
        var t = x.t, L = x.L, lay = x.layout, c = x.c;
        var Wd = x.W, Ht = x.H;
        var brand = x.brand || t.brand;

        /* 背景：极浅品牌色调，右边略深 */
        x.bgOverride = 'linear-gradient(180deg,#ffffff 0%,' + CV.tint(brand, 0.955) + ' 55%,' + CV.tint(brand, 0.91) + ' 100%)';

        /* 左上：日期 · 条数（品牌色，等宽） */
        var head = Math.round(Wd * 0.0475);
        var se = find(L, 'series');
        var headTxt = (c.date || '') + (c.badge ? '   ·   ' + c.badge : '');
        if (se) merge(se, {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.068), w: Math.round(Wd * 0.45),
          text: headTxt, size: head, font: 'mono', weight: 400, ls: .06, color: brand, opacity: 1
        });

        if (lay === 'poster') {
          var tp0 = find(L, 'title');
          if (tp0) merge(tp0, { x: Math.round(Wd * 0.08), y: Math.round(Ht * 0.09), w: Math.round(Wd * 0.84), align: 'center', size: Math.round(Wd * 0.070), color: t.ink, fit: true, maxH: Math.round(Wd * 0.070 * 1.2) });
          var sp0 = find(L, 'sub');
          if (sp0) merge(sp0, { x: Math.round(Wd * 0.10), y: Math.round(Ht * 0.24), w: Math.round(Wd * 0.80), align: 'center', size: Math.round(Wd * 0.045) });
          var icp = find(L, 'icon'); if (icp) icp.opacity = 0;
          ['kicker', 'date', 'rule', 'foot', 'footline', 'series'].forEach(function (r) { var l = find(L, r); if (l) l.opacity = 0; });
          return;
        }

        /* 行1：品牌名（黑） */
        var lines = String(c.title || '').split('\n');
        var l1 = (lines[0] || '').trim();
        var l2 = (lines.slice(1).join(' ').trim() || String(c.sub || '').replace(/\[\[|\]\]/g, '')).trim();
        var ti = find(L, 'title');
        if (ti) merge(ti, {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.345), w: Math.round(Wd * 0.515),
          text: l1,
          size: Math.round(Wd * 0.0578), font: pickFont(c.title), weight: 700, lh: 1.04, ls: -.028,
          color: t.ink, align: 'left', fit: false, maxH: 0
        });

        /* 行2：产品名（品牌色）+ 荧光笔底线 */
        var sb = find(L, 'sub');
        var line2 = l2;
        if (sb) merge(sb, {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.527), w: Math.round(Wd * 0.30),
          text: line2, size: Math.round(Wd * 0.0715), font: pickFont(line2), weight: 700, lh: 1.10,
          ls: -.02, color: brand, opacity: 1, maxH: 0
        });
        x.add(CV.S('hili', 'bar', {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.645), w: Math.round(Wd * 0.269),
          h: Math.round(Ht * 0.024), color: brand, opacity: .22, radius: 2
        }));

        /* 右侧图标圆阵：9 / 6 / 4 / 3 */
        var pool = (CV.JUYA_POOL || []).slice();
        var main = c.icon || 'OpenAI/ChatGPT#symbol-color';
        var extra = String(c.icons || '').split(/[,\n]/).map(function (s) { return s.trim(); }).filter(Boolean);
        var want = 1 + extra.length;
        var n = extra.length ? (want <= 3 ? 3 : (want === 4 ? 4 : (want <= 6 ? 6 : 9))) : 9;
        var ids = [main].concat(extra);
        for (var i = 0; i < pool.length && ids.length < n; i++) if (pool[i] !== main) ids.push(pool[i]);
        var grid = n === 9 ? [3, 3] : (n === 6 ? [3, 2] : (n === 4 ? [2, 2] : [3, 1]));
        var d = Math.round(Wd * 0.125);
        var gap = Math.round(Wd * 0.0106);
        var gx = Math.round(Wd * 0.628);
        var totalH = grid[1] * d + (grid[1] - 1) * gap;
        var gy = Math.round(Ht * 0.524 - totalH / 2);
        for (var k = 0; k < n; k++) {
          var col = k % grid[0], row = Math.floor(k / grid[0]);
          var cx = gx + col * (d + gap), cy = gy + row * (d + gap);
          x.add(CV.S('ring' + k, 'circle', {
            x: cx, y: cy, w: d, h: d, color: '#ffffff', radius: 999,
            bw: Math.max(2, Math.round(Wd * 0.0025)), bc: k === 0 ? brand : '#101114'
          }));
          x.add(CV.I('ringicon' + k, ids[k] || main, {
            x: cx + Math.round(d * 0.22), y: cy + Math.round(d * 0.22),
            w: Math.round(d * 0.56), h: Math.round(d * 0.56)
          }));
        }

        /* 原来的主图标挪进第一个圆（避免它单独出现在别处） */
        var ic = find(L, 'icon');
        if (ic) ic.opacity = 0;    /* 圆阵第 1 个圆已经画了主图标 */
        ['kicker', 'date', 'rule', 'foot', 'footline'].forEach(function (r) { var l = find(L, r); if (l) l.opacity = 0; });
      }
    },

    /* 25 —— 橘鸦·中文：中文副标黑字 + 细下划线 ------------------ */
    {
      id: 'juya_cn', name: '橘鸦·中文', sub: '橘鸦Juya · 中文副标黑字',
      t: { ink: '#101114', ink2: '#6b7280', brand: '#4285f4' },
      bg: 'linear-gradient(180deg,#ffffff 0%,#f7f9fc 58%,#f2f6fd 100%)',
      paperCfg: { on: false, opacity: 8, noise: 10, scale: 360 },
      fx: [], dark: false,
      title: { font: 'inter', size: 67, weight: 700, lh: 1.04, ls: -.028, color: '#101114', fit: false, maxH: 0 },
      decor: function (x) {
        var t = x.t, L = x.L, lay = x.layout, c = x.c;
        var Wd = x.W, Ht = x.H;
        var brand = x.brand || t.brand;
        var cjk = /[\u3400-\u9fff]/.test(String(c.title || '') + String(c.sub || ''));
        x.bgOverride = 'linear-gradient(180deg,#ffffff 0%,' + CV.tint(brand, 0.955) + ' 55%,' + CV.tint(brand, 0.91) + ' 100%)';

        var se = find(L, 'series');
        if (se) merge(se, {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.068), w: Math.round(Wd * 0.45),
          text: (c.date || '') + (c.badge ? '   ·   ' + c.badge : ''),
          size: Math.round(Wd * 0.0475), font: 'mono', weight: 400, ls: .06, color: brand, opacity: 1
        });

        var lines = String(c.title || '').split('\n');
        var l1 = (lines[0] || '').trim();
        var l2 = (lines.slice(1).join(' ').trim() || String(c.sub || '').replace(/\[\[|\]\]/g, '')).trim();
        var ti = find(L, 'title');
        if (ti) merge(ti, {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.345), w: Math.round(Wd * 0.515),
          text: l1,
          size: Math.round(Wd * 0.0578), font: pickFont(l1), weight: 700, lh: 1.04, ls: -.028,
          color: t.ink, align: 'left', fit: false, maxH: 0
        });

        var line2 = l2;
        var sb = find(L, 'sub');
        if (sb) merge(sb, {
          x: Math.round(Wd * 0.0688), y: Math.round(Ht * 0.527), w: Math.round(Wd * 0.46),
          text: line2, size: Math.round(Wd * 0.0715), font: pickFont(line2),
          weight: cjk ? 900 : 700, lh: 1.10, ls: cjk ? -.01 : -.028,
          color: t.ink, opacity: 1, maxH: 0
        });

        /* 细下划线：宽度按字符数估算，贴住第二行 */
        var estW = Math.min(Wd * 0.46, Math.max(Wd * 0.10, String(line2).length * Wd * (cjk ? 0.0731 : 0.0621)));
        x.add(CV.S('ul2', 'bar', {
          x: Math.round(Wd * 0.0695), y: Math.round(Ht * 0.667), w: Math.round(estW),
          h: Math.max(2, Math.round(Wd * 0.0018)), color: t.ink, opacity: .8, radius: 0
        }));

        var pool = (CV.JUYA_POOL || []).slice();
        var main = c.icon || 'OpenAI/ChatGPT#symbol-color';
        var extra = String(c.icons || '').split(/[,\n]/).map(function (s) { return s.trim(); }).filter(Boolean);
        var want = 1 + extra.length;
        var n = extra.length ? (want <= 3 ? 3 : (want === 4 ? 4 : (want <= 6 ? 6 : 9))) : 6;
        var ids = [main].concat(extra);
        for (var i = 0; i < pool.length && ids.length < n; i++) if (pool[i] !== main) ids.push(pool[i]);
        var grid = n === 9 ? [3, 3] : (n === 6 ? [3, 2] : (n === 4 ? [2, 2] : [3, 1]));
        var d = Math.round(Wd * 0.125), gap = Math.round(Wd * 0.0106);
        var gx = Math.round(Wd * 0.628);
        var totalH = grid[1] * d + (grid[1] - 1) * gap;
        var gy = Math.round(Ht * 0.524 - totalH / 2);
        for (var k = 0; k < n; k++) {
          var col = k % grid[0], row = Math.floor(k / grid[0]);
          var cx = gx + col * (d + gap), cy = gy + row * (d + gap);
          x.add(CV.S('ring' + k, 'circle', {
            x: cx, y: cy, w: d, h: d, color: '#ffffff', radius: 999,
            bw: Math.max(2, Math.round(Wd * 0.0025)), bc: k === 0 ? brand : '#101114'
          }));
          x.add(CV.I('ringicon' + k, ids[k] || main, {
            x: cx + Math.round(d * 0.22), y: cy + Math.round(d * 0.22),
            w: Math.round(d * 0.56), h: Math.round(d * 0.56)
          }));
        }
        var ic = find(L, 'icon');
        if (ic) ic.opacity = 0;    /* 圆阵第 1 个圆已画主图标 */
        ['kicker', 'date', 'rule', 'foot', 'footline'].forEach(function (r) { var l = find(L, r); if (l) l.opacity = 0; });
      }
    },


  ];

  /* 横向撕纸：用于竖版 zine */
  function tearFlat() {
    var w = TW > 0 ? TW : 900, h = 64, n = 26, s = 9, d = 'M0,0';
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i = 1; i <= n; i++) d += ' L' + (w * i / n).toFixed(1) + ',' + (h * 0.45 + (rnd() * 2 - 1) * 15).toFixed(1);
    d += ' L' + w + ',' + h + ' L0,' + h + ' Z';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">'
      + '<path d="' + d + '" fill="#faf5e8"/>'
      + '<path d="' + d + '" fill="none" stroke="rgba(74,60,38,.28)" stroke-width="2.2"/></svg>';
  }

  /* 手绘感雷达：顶点带抖动 */
  function radarHand() {
    var cx = 105, cy = 105, r = 88, n = 6, s = 5;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    var vals = [.72, .95, .6, .82, .68, .9], pts = [], grid = [];
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      var rr = r * vals[i] * (1 + (rnd() - .5) * .06);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    for (var g = 1; g <= 3; g++) {
      var gp = [];
      for (var j = 0; j < n; j++) {
        var ag = -Math.PI / 2 + (j * 2 * Math.PI) / n;
        gp.push((cx + Math.cos(ag) * r * g / 3).toFixed(1) + ',' + (cy + Math.sin(ag) * r * g / 3).toFixed(1));
      }
      grid.push('<polygon points="' + gp.join(' ') + '" fill="none" stroke="#141210" stroke-opacity="' + (.1 + g * .05) + '" stroke-width="1"/>');
    }
    var d = '';
    for (var k = 0; k < n; k++) {
      var ak = -Math.PI / 2 + (k * 2 * Math.PI) / n;
      d += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(ak) * r).toFixed(1) + '" y2="' + (cy + Math.sin(ak) * r).toFixed(1) + '" stroke="#141210" stroke-opacity=".24" stroke-width="1"/>';
    }
    var pd = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (var m = 1; m < n; m++) pd += ' L' + pts[m][0].toFixed(1) + ',' + pts[m][1].toFixed(1);
    pd += ' Z';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210" width="100%" height="100%">'
      + grid.join('') + d
      + '<path d="' + pd + '" fill="#c8102e" fill-opacity=".16" stroke="#c8102e" stroke-width="2.4" stroke-linejoin="round"/>'
      + '</svg>';
  }

  /* 撕纸边：确定性锯齿 + 白色纸芯 + 暗边 */
  function tearRaw(w) {
    var n = 24, s = 17, d = 'M0,0';
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i = 1; i <= n; i++) {
      var y = (H * i) / n;
      d += ' L' + (w + (rnd() * 2 - 1) * 11).toFixed(1) + ',' + y.toFixed(1);
    }
    d += ' L0,' + H + ' Z';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + H + '" viewBox="0 0 ' + w + ' ' + H + '">'
      + '<path d="' + d + '" fill="#faf5e8"/>'
      + '<path d="' + d + '" fill="none" stroke="rgba(74,60,38,.3)" stroke-width="2.4"/>'
      + '</svg>';
  }

  /* 雷达图（高对比数据风） */
  function radar(vals) {
    var cx = 172, cy = 172, r = 150, n = vals.length, pts = [], grid = [];
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      pts.push([cx + Math.cos(a) * r * vals[i], cy + Math.sin(a) * r * vals[i]].map(function (v) { return v.toFixed(1); }).join(','));
    }
    for (var g = 1; g <= 4; g++) {
      var gp = [];
      for (var j = 0; j < n; j++) {
        var ag = -Math.PI / 2 + (j * 2 * Math.PI) / n;
        gp.push([cx + Math.cos(ag) * r * g / 4, cy + Math.sin(ag) * r * g / 4].map(function (v) { return v.toFixed(1); }).join(','));
      }
      grid.push('<polygon points="' + gp.join(' ') + '" fill="none" stroke="#141414" stroke-opacity="' + (0.14 + g * 0.03) + '" stroke-width="1"/>');
    }
    var axes = [];
    for (var k = 0; k < n; k++) {
      var ak = -Math.PI / 2 + (k * 2 * Math.PI) / n;
      axes.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(ak) * r) + '" y2="' + (cy + Math.sin(ak) * r) + '" stroke="#141414" stroke-opacity="0.3" stroke-width="1"/>');
    }
    return '<svg viewBox="0 0 344 344" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">'
      + grid.join('') + axes.join('')
      + '<polygon points="' + pts.join(' ') + '" fill="#e2231a" fill-opacity="0.16" stroke="#e2231a" stroke-width="2.5" stroke-linejoin="round"/>'
      + '</svg>';
  }

  /* 版式纠偏：装饰层是按 hero 设计的，换到通栏/巨化时统一收敛，避免穿模 */
  function layoutFix(p, lay, L, U) {
    var f = function (role) { return find(L, role); };
    var u = function (role) { return find(U, role); };
    var ic = f('icon');
    var po = lay === 'poster';
    /* --- 通栏大标：一切靠边，中间留白给标题 --- */
    if (po) {
      ['kicker', 'series'].forEach(function (r) {
        var l = f(r);
        if (l && l.x < 260 && l.w > 440) l.w = 420;
      });
      if (p.id === 'matrix' || p.id === 'pastel' || p.id === 'cardlight') {
        var cd = u('card');
        if (cd) merge(cd, { x: W / 2 - 104, y: 10, w: 208, h: 172, radius: 34 });
        if (ic) merge(ic, { x: W / 2 - 54, y: 36, w: 108, h: 108 });
      } else if (p.id === 'beigeRed' || p.id === 'noir' || p.id === 'zine' || p.id === 'magazine') {
        if (ic) merge(ic, { x: W / 2 - 74, y: 18, w: 148, h: 148 });
      } else if (p.id === 'data') {
        var sb = f('sub'); if (sb) merge(sb, { w: 600 });
      } else if (p.id === 'constructivism') {
        var tt = f('title'); if (tt) merge(tt, { y: 236, w: 900, x: 130 });
        var nm = find(U, 'num'); if (nm) U.splice(U.indexOf(nm), 1);
      }
      var bn = u('bignum') || f('bignum'); if (bn) merge(bn, { y: 512, x: 880, w: 200 });
    }
    /* --- 图标巨化：底部数字抬离信息条 --- */
    if (lay === 'feature') {
      var bn2 = u('bignum') || f('bignum'); if (bn2) merge(bn2, { y: 516 });
      var nm2 = find(U, 'num'); if (nm2) merge(nm2, { y: 470, x: 760 });
    }
    /* --- 分栏头条：左侧标题列收窄，右侧图形不越界 --- */
    if (lay === 'split') {
      var bd = find(L, 'band');
      if (p.dark && bd) merge(bd, { color: 'rgba(255,255,255,.07)' });
      var bn3 = u('bignum') || f('bignum'); if (bn3) merge(bn3, { y: 508 });
      var nm3 = find(U, 'num'); if (nm3) merge(nm3, { y: 470 });
    }
    return { L: L, U: U };
  }

  /* ============================ 组装 ============================ */
  CV.NEWS = [
    'Claude 追着中国人杀，封禁中国账号',
    '奥特曼、马斯克、达里奥的爱恨情仇',
    '龙王归来，Gemini 4 Carbon 震撼发布',
    'DeepSeek R1 发布，英伟达股价暴跌',
    'Seedance 2.0 发布，视频模型进入新阶段',
    'GPT Image 2.0 发布，生图文字不再是难题',
    'Kimi K3 发布，2.8 万亿参数开源模型逼近闭源',
    'DeepSeek V4.1 Flash 10-17 发布，大模型斩杀线',
    'Claude Opus 5.5 发布，代码与视频能力眩晕瘫坐',
    'OpenAI 一口气发布 700 多篇数学论文',
    'Manus 被仅退款',
    'Zcode 免费帮全人类备份数据',
    'Muse 爆火，个人 Agent 时代来临'
  ];
  CV.npTail = ['本条已核对来源。', '影响面：开发者生态与算力供给。', '可信度：官方公告。',
    '观察：价格与开源节奏同时加速。', '相关：模型能力与成本曲线。'];
  /* 生成报纸正文：标题用 [[ ]] 高亮，后面跟短句，形成密排效果 */
  CV.npText = function (rounds) {
    var s = '', N = CV.NEWS, T = CV.npTail;
    for (var k = 0; k < (rounds || 3); k++) {
      for (var i = 0; i < N.length; i++) {
        s += '[[' + N[i] + ']] ' + T[(k + i) % T.length] + '　';
      }
    }
    return s;
  };

  /* 报纸背景工厂：variant 决定纸色 / 栏数 / 报头位置 / 装饰 */
  CV.npVariant = function (o) {
    return function (x) {
      var t = x.t, L = x.L, lay = x.layout;
      var Wd = x.W, Ht = x.H, k = Wd / 1160;
      var body = CV.npText(o.rounds || 3);

      /* 正文：多栏密排，铺满整页（报纸肌理） */
      x.add(CV.T('npbody', body, {
        x: Math.round(Wd * o.pad), y: Math.round(Ht * o.bodyY),
        w: Math.round(Wd * (1 - o.pad * 2)),
        size: Math.round(Wd * o.bodySize), font: o.bodyFont, weight: 400,
        lh: o.bodyLh || 1.42, ls: .01, color: o.bodyColor,
        cols: o.cols, gap: Math.round(Wd * o.gap), rule: o.rule,
        maxH: Math.round(Ht * o.bodyH), align: 'justify'
      }));

      if (lay === 'poster') return;

      /* 报头区 */
      if (o.mast) {
        if (o.mast.center) {
          x.top(CV.T('mast', o.mast.text, {
            x: Math.round(Wd * o.pad), y: Math.round(Ht * o.mast.y), w: Math.round(Wd * (1 - o.pad * 2)),
            size: Math.round(Wd * o.mast.size), font: o.mast.font, weight: 900,
            ls: o.mast.ls || 0, color: o.mast.color, align: 'center'
          }));
        } else {
          x.top(CV.T('mast', o.mast.text, {
            x: Math.round(Wd * o.mast.x), y: Math.round(Ht * o.mast.y), w: Math.round(Wd * o.mast.w),
            size: Math.round(Wd * o.mast.size), font: o.mast.font, weight: 900,
            ls: o.mast.ls || 0, color: o.mast.color, align: 'left'
          }));
        }
      }
      /* 分隔线 */
      (o.lines || []).forEach(function (ln, i) {
        x.add(CV.S('npline' + i, 'bar', {
          x: Math.round(Wd * ln.x), y: Math.round(Ht * ln.y), w: Math.round(Wd * ln.w),
          h: Math.max(1, Math.round((ln.h || 1) * k)), color: ln.color, opacity: ln.opacity == null ? 1 : ln.opacity
        }));
      });
      /* 日期块 */
      if (o.dateBox) {
        var b = o.dateBox;
        x.add(CV.S('nobox', 'round', {
          x: Math.round(Wd * b.x), y: Math.round(Ht * b.y), w: Math.round(Wd * b.w), h: Math.round(Ht * b.h),
          color: b.fill, radius: Math.round(Wd * (b.radius || 0.006)),
          bw: Math.max(1, Math.round(Wd * (b.border || 0))), bc: b.borderColor || b.fill,
          shadow: b.shadow || ''
        }));
        x.add(CV.T('nod1', x.c.date || '', {
          x: Math.round(Wd * b.x), y: Math.round(Ht * (b.y + b.h * 0.10)), w: Math.round(Wd * b.w),
          size: Math.round(Wd * b.size), font: 'mono', weight: 900, ls: 0,
          color: b.text, align: 'center'
        }));
      }
      /* 侧栏小标题（复古款用） */
      (o.sidebar || []).forEach(function (sb, i) {
        x.add(CV.T('npsb' + i, sb, {
          x: Math.round(Wd * o.pad), y: Math.round(Ht * (0.20 + i * 0.055)),
          w: Math.round(Wd * 0.16), size: Math.round(Wd * 0.0125), font: o.bodyFont,
          weight: 900, color: o.accent, ls: .04, upper: true
        }));
      });

      /* 封面主元素 */
      var isz = Math.round(Wd * (o.logo || 0.28));
      var ic = find(L, 'icon');
      if (ic && o.logo) merge(ic, {
        x: Math.round(Wd * (o.logoX || 0.13)), y: Math.round(Ht * (o.logoY || 0.34)), w: isz, h: isz,
        filter: CV.dieCut(Math.round(Wd * 0.0075), '#ffffff', Math.round(Wd * 0.004))
      });
      var ti = find(L, 'title');
      if (ti) merge(ti, {
        x: Math.round(Wd * (o.titleX || 0.47)), y: Math.round(Ht * (o.titleY || 0.42)),
        w: Math.round(Wd * (o.titleW || 0.50)),
        size: Math.round(Wd * (o.titleSize || 0.070)), font: 'heavy', weight: 900,
        lh: 1.10, ls: 0, color: o.titleColor, align: 'left', fit: true, maxH: Math.round(Ht * 0.30),
        stroke: Math.max(2, Math.round(Wd * o.titleStroke)),
        strokeColor: o.titleStrokeColor || '#14100a',
        stroke2: Math.max(1, Math.round(Wd * (o.titleStroke2 || 0.0028))),
        stroke2Color: o.titleStroke2Color || '#ffffff'
      });
      ['kicker', 'series', 'date', 'sub', 'foot', 'footline', 'rule'].forEach(function (r) {
        var l = find(L, r); if (l) l.opacity = 0;
      });
    };
  };

  /* 有中日韩字符就用思源黑体，否则用 Inter */
  function pickFont(s) { return /[\u3400-\u9fff\u3040-\u30ff]/.test(String(s || '')) ? 'noto' : 'inter'; }

  CV.npHTML = function (rounds) {
    var s = '', N = CV.NEWS, T = CV.npTail;
    for (var k = 0; k < (rounds || 16); k++) {
      for (var i = 0; i < N.length; i++) s += '<b>' + N[i] + '</b> ' + T[(k + i) % T.length] + ' ';
    }
    return s;
  };

  CV.JUYA_POOL = ['Anthropic/Claude#symbol-color','Anthropic/Anthropic#symbol-color','Google/Gemini#symbol-color','DeepSeek/DeepSeek#symbol-color','月之暗面/Kimi#symbol-color','智谱 AI/ChatGLM#symbol-color','MiniMax/MiniMax#symbol-color','xAI/Grok#symbol-color','xAI/Cursor#symbol-color'];

  CV.PRESET_VERSION = 'p23';

  CV.styleById = function (id) {
    for (var i = 0; i < CV.STYLES.length; i++) if (CV.STYLES[i].id === id) return CV.STYLES[i];
    return CV.STYLES[0];
  };

  CV.layoutById = function (id) {
    for (var i = 0; i < CV.LAYOUTS.length; i++) if (CV.LAYOUTS[i].id === id) return CV.LAYOUTS[i];
    return CV.LAYOUTS[0];
  };

  CV.compose = function (styleId, layoutId, content, ratio) {
    var p = CV.styleById(styleId);
    var RT = CV.ratioOf ? CV.ratioOf(ratio) : { id: "land", w: W, h: H };
    var LO = CV.layoutById(layoutId);
    var portrait = RT.h > RT.w;
    if (!!LO.tall !== portrait) {
      var alt = CV.layoutById(CV.ALT[LO.id] || (portrait ? 'stack' : 'hero'));
      if (alt) { LO = alt; layoutId = alt.id; }
    }
    var MAST = (CV.MASTERS && CV.MASTERS[LO.master]) || { w: W, h: H };
    var t = p.t;
    var c = CV.assign(CV.defaultContent(), content || {});
    var L = [];
    var add = function (o) { L.push(o); return o; };
    var lay = LAYOUTS[layoutId] ? layoutId : 'hero';

    LAYOUTS[lay](t, c, add);
    merge(find(L, 'title'), p.title);
    merge(find(L, 'icon'), p.icon);
    merge(find(L, 'kicker'), p.kicker);
    merge(find(L, 'series'), p.series);
    merge(find(L, 'sub'), p.sub);
    merge(find(L, 'foot'), p.foot);
    var under = [];
    var addU = function (o) { under.push(o); return o; };
    var ctx = { t: t, c: c, add: addU, top: add, L: L, layout: lay, W: W, H: H, p: p, brand: (window.App && App.doc && App.doc.brand) || null, bgOverride: null };
    if (LO.tall) tallDecor(p, ctx);
    else if (p.decor) p.decor(ctx);
    if (p.post) p.post(ctx);
    layoutFix(p, lay, L, under);
    return {
      v: CV.VERSION, pv: CV.PRESET_VERSION, w: RT.w, h: RT.h, ratio: RT.id, master: MAST, style: p.id, layout: lay,
      bg: ctx.bgOverride || p.bg, fx: (p.fx || []).slice(), dark: !!p.dark, brand: ctx.brand,
      paper: { on: false, opacity: (p.paperCfg && p.paperCfg.opacity) || 80, noise: (p.paperCfg && p.paperCfg.noise) || 60, scale: (p.paperCfg && p.paperCfg.scale) || 260 },
      tokens: CV.clone(t), content: c,
      layers: under.filter(Boolean).concat(L.filter(Boolean))
    };
  };
})();


/* ==== render.js ==== */
/* ==========================================================================
   渲染内核：doc(JSON) → DOM。编辑器与出图页共用同一份，保证像素一致
   ========================================================================== */
(function () {
  var CV = window.CV;

  /* 贴纸白边：用 8 向 drop-shadow 做 alpha 描边 */
  CV.dieCut = function (r, color, extra) {
    if (!r) return '';
    var out = [], c = color || '#ffffff';
    for (var i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      out.push('drop-shadow(' + (Math.cos(a) * r).toFixed(1) + 'px ' + (Math.sin(a) * r).toFixed(1) + 'px 0 ' + c + ')');
    }
    if (extra) out.push('drop-shadow(0 0 ' + (extra / 2).toFixed(1) + 'px rgba(20,17,14,.35))');
    return out.join(' ');
  };

  CV.shadowCss = function (name) {
    if (!name) return '';
    if (name === 'glow') return '0 0 42px rgba(122,152,255,.55), 0 0 14px rgba(255,255,255,.28)';
    if (name === 'hard') return '5px 5px 0 #14110e';
    if (name === 'hard-accent') return '5px 5px 0 #d61f16';
    if (name === 'drop') return '0 8px 22px rgba(14,17,21,.26)';
    if (name === 'lift') return '0 18px 40px -18px rgba(14,17,21,.45)';
    if (name === 'candy') return '7px 9px 0 #b8342a';
    if (name === 'ink') return '6px 8px 0 rgba(20,17,14,.85)';
    return name.indexOf('px') > -1 || name.indexOf('rgb') > -1 ? name : '';
  };

  function applyText(el, l, doc) {
    var M = CV.metrics(doc);
    el.className = 'cv-el cv-text ff-' + (l.font || 'heavy') + (l.upper ? ' upper' : '') + (l.italic ? ' italic' : '');
    el.style.left = M.x(l.x) + 'px';
    el.style.top = M.y(l.y) + 'px';
    el.style.width = M.w(l.w) + 'px';
    el.style.fontSize = M.fs(l.size) + 'px';
    el.style.fontWeight = l.weight || 400;
    el.style.color = l.color || '#0e1115';
    el.style.lineHeight = l.lh || 1.1;
    el.style.letterSpacing = (l.ls || 0) + 'em';
    el.style.textAlign = l.align || 'left';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.maxHeight = l.maxH ? M.fs(l.maxH) + 'px' : '';
    var sh = [];
    if (l.stroke > 0) {
      var rr = M.k * l.stroke, sc = l.strokeColor || '#ffffff';
      for (var ai = 0; ai < 16; ai++) {
        var ths = (ai * Math.PI) / 8;
        sh.push((Math.cos(ths) * rr).toFixed(1) + 'px ' + (Math.sin(ths) * rr).toFixed(1) + 'px 0 ' + sc);
      }
      if (l.stroke2 > 0) {
        var r2 = M.k * (l.stroke + l.stroke2), s2 = l.stroke2Color || '#14110e';
        for (var bi = 0; bi < 16; bi++) {
          var th2 = (bi * Math.PI) / 8;
          sh.push((Math.cos(th2) * r2).toFixed(1) + 'px ' + (Math.sin(th2) * r2).toFixed(1) + 'px 0 ' + s2);
        }
      }
    }
    var base = CV.shadowCss(l.shadow);
    if (base) sh.push(base);
    el.style.webkitTextStroke = '';
    el.style.paintOrder = '';
    el.style.textShadow = sh.join(', ');
    if (l.cols > 1) {
      el.style.columnCount = l.cols;
      el.style.columnGap = (l.gap || 24) + 'px';
      el.style.columnRule = l.rule ? '1px solid ' + l.rule : '';
      el.style.textAlign = 'justify';
    } else {
      el.style.columnCount = '';
      el.style.columnGap = '';
      el.style.columnRule = '';
    }
    if (l.grad) {
      el.style.backgroundImage = l.grad;
      el.style.webkitBackgroundClip = 'text';
      el.style.backgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
    } else {
      el.style.backgroundImage = '';
      el.style.webkitBackgroundClip = '';
      el.style.backgroundClip = '';
      el.style.webkitTextFillColor = '';
    }
  }

  function applyIcon(el, l, doc) {
    var M = CV.metrics(doc);
    el.className = 'cv-el cv-icon';
    el.style.left = M.x(l.x) + 'px';
    el.style.top = M.y(l.y) + 'px';
    el.style.width = M.w(l.w) + 'px';
    el.style.height = M.h(l.h || l.w) + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.borderRadius = l.radius ? M.k * l.radius + 'px' : '';
    var tint = l.tint === 'mono' ? 'brightness(0)' : l.tint === 'invert' ? 'brightness(0) invert(1)' : '';
    var cut = l.dieCut ? CV.dieCut(M.k * l.dieCut, l.dieCutColor || '#ffffff') : '';
    el.style.filter = [tint, cut].filter(Boolean).join(' ');
    var src = CV.iconSrc(l.icon, doc && doc.dark);
    if (el.getAttribute('src') !== src) {
      el.dataset.try = '0';
      el.setAttribute('src', src);
    }
    if (!el._fb) {
      el._fb = true;
      el.addEventListener('error', function () {
        var p = CV.iconParts(l.icon);
        var chain = ['symbol-color', 'symbol-black', 'appicon', 'tile-light', 'tile-dark'];
        var i = parseInt(el.dataset.try || '0', 10) + 1;
        el.dataset.try = String(i);
        if (i < chain.length) {
          el.setAttribute('src', 'assets/icons/' + p.id.split('/').map(encodeURIComponent).join('/') + '/' + chain[i] + '.png');
        } else {
          el.style.visibility = 'hidden';
        }
      });
    }
    el.style.padding = (l.pad || 0) + 'px';
  }

  function applyShape(el, l, doc) {
    var M = CV.metrics(doc);
    el.className = 'cv-el cv-shape sh-' + (l.shape || 'rect');
    var fullW = l.w >= 1000, fullH = (l.h || 0) >= 700;
    el.style.left = M.x(l.x) + 'px';
    el.style.top = fullH ? '0px' : M.y(l.y) + 'px';
    el.style.width = (fullW ? M.W : M.w(l.w)) + 'px';
    el.style.height = (fullH ? M.H : M.h(l.h)) + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.background = l.color;
    el.style.borderRadius = l.radius ? M.k * l.radius + 'px' : '';
    el.style.boxShadow = CV.shadowCss(l.shadow);
    el.style.filter = l.dieCut ? CV.dieCut(M.k * l.dieCut, l.dieCutColor || '#ffffff') : '';
    if (l.bw > 0) { el.style.border = (M.k * l.bw).toFixed(1) + 'px solid ' + (l.bc || '#000'); }
    if (l.shape === 'line') { el.style.height = (l.h || 1) + 'px'; el.style.background = l.color; }
  }

  function applyImage(el, l, doc) {
    var M = CV.metrics(doc);
    el.className = 'cv-el cv-image';
    var full = l.w >= 1000 && (l.h || 0) >= 700;
    el.style.left = (full ? 0 : M.x(l.x)) + 'px';
    el.style.top = (full ? 0 : M.y(l.y)) + 'px';
    el.style.width = (full ? M.W : M.w(l.w)) + 'px';
    el.style.height = (full ? M.H : M.h(l.h)) + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.borderRadius = l.radius ? M.k * l.radius + 'px' : '';
    el.style.boxShadow = CV.shadowCss(l.shadow);
    var img = el.querySelector('img');
    var ov = el.querySelector('.ov');
    if (!img) {
      img = document.createElement('img');
      el.appendChild(img);
      ov = document.createElement('div');
      ov.className = 'ov';
      el.appendChild(ov);
    }
    if (img.getAttribute('src') !== l.src) img.setAttribute('src', l.src || '');
    img.style.objectFit = l.fit === 'contain' ? 'contain' : 'cover';
    var f = [];
    if (l.blur) f.push('blur(' + (M.k * l.blur).toFixed(1) + 'px)');
    if (l.gray) f.push('grayscale(' + l.gray + ')');
    el.style.filter = f.join(' ');
    ov = el.querySelector('.ov');
    ov.style.background = l.dimColor || '#0e1115';
    ov.style.opacity = l.dim || 0;
  }

  /* ============ 雷达图：数据驱动，完全可编辑 ============ */
  CV.radarDefault = function () {
    return {
      axes: [{ label: '前端', value: 60.33 }, { label: '后端', value: 55.34 }, { label: '算法', value: 79.79 },
             { label: '研究', value: 85.07 }, { label: '数据', value: 69.81 }],
      max: 100, rings: 4,
      color: '#c8001f', fill: '#c8001f', fillAlpha: 0.18,
      grid: '#cfcfcf', labelColor: '#16110e', valueColor: '#c8001f',
      labelSize: 34, valueSize: 30, valueItalic: true, font: 'heavy'
    };
  };

  CV.radarSvg = function (cfg) {
    var c = Object.assign(CV.radarDefault(), cfg || {});
    var n = Math.max(3, c.axes.length);
    var S = 1000, cx = S / 2, cy = S / 2 + 20, R = 300;
    var max = c.max > 0 ? c.max : 100;
    function pt(i, k) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [cx + Math.cos(a) * R * k, cy + Math.sin(a) * R * k];
    }
    function poly(k) {
      var o = [];
      for (var i = 0; i < n; i++) { var p = pt(i, k); o.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); }
      return o.join(' ');
    }
    var s = '<svg viewBox="0 0 ' + S + ' ' + S + '" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
    /* 网格环 */
    for (var r = c.rings; r >= 1; r--) {
      s += '<polygon points="' + poly(r / c.rings) + '" fill="none" stroke="' + c.grid + '" stroke-width="1.6"/>';
    }
    /* 轴线 */
    for (var i = 0; i < n; i++) {
      var p = pt(i, 1);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="' + c.grid + '" stroke-width="1.6"/>';
    }
    /* 数据多边形 */
    var dp = [];
    for (var i2 = 0; i2 < n; i2++) {
      var v = Math.max(0, Math.min(max, Number(c.axes[i2].value) || 0));
      var q = pt(i2, v / max);
      dp.push(q[0].toFixed(1) + ',' + q[1].toFixed(1));
    }
    s += '<polygon points="' + dp.join(' ') + '" fill="' + c.fill + '" fill-opacity="' + c.fillAlpha + '" stroke="' + c.color + '" stroke-width="6" stroke-linejoin="round"/>';
    /* 标签与数值 */
    for (var i3 = 0; i3 < n; i3++) {
      var a3 = -Math.PI / 2 + (i3 * 2 * Math.PI) / n;
      var lx = cx + Math.cos(a3) * (R + 120), ly = cy + Math.sin(a3) * (R + 110);
      var anchor = Math.abs(Math.cos(a3)) < 0.25 ? 'middle' : (Math.cos(a3) > 0 ? 'start' : 'end');
      var dy = Math.sin(a3) < -0.5 ? -60 : (Math.sin(a3) > 0.5 ? 70 : 0);
      s += '<text x="' + lx.toFixed(1) + '" y="' + (ly + dy).toFixed(1) + '" text-anchor="' + anchor + '" ' +
        'style="font-family:var(--cv-font,' + "MiSans" + ');font-weight:' + (c.font === 'heavy' ? 900 : 700) + ';font-size:' + c.labelSize + 'px;fill:' + c.labelColor + '">' + CV.esc(c.axes[i3].label) + '</text>';
      s += '<text x="' + lx.toFixed(1) + '" y="' + (ly + dy + c.labelSize + 10).toFixed(1) + '" text-anchor="' + anchor + '" ' +
        'style="font-family:var(--cv-font,' + "MiSans" + ');font-weight:800;font-style:' + (c.valueItalic ? 'italic' : 'normal') + ';font-size:' + c.valueSize + 'px;fill:' + c.valueColor + '">' + Number(c.axes[i3].value).toFixed(2) + '</text>';
    }
    s += '</svg>';
    return s;
  };

  function applyRadar(el, l, doc) {
    var M = CV.metrics(doc);
    el.className = 'cv-el cv-radar';
    el.style.left = M.x(l.x) + 'px'; el.style.top = M.y(l.y) + 'px';
    el.style.width = M.w(l.w) + 'px'; el.style.height = M.h(l.h || l.w) + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.pointerEvents = 'none';
    var html = CV.radarSvg(l.radar || {});
    if (el.__rb !== html) { el.innerHTML = html; el.__rb = html; }
  }

  function applyRaw(el, l, doc) {
    var M = CV.metrics(doc);
    el.className = 'cv-el cv-raw';
    el.style.left = M.x(l.x) + 'px'; el.style.top = M.y(l.y) + 'px';
    el.style.width = M.w(l.w) + 'px'; el.style.height = M.h(l.h) + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.pointerEvents = 'none';
  }

  CV.applyLayer = function (el, l, doc) {
    doc = doc || CV.__doc || {};
    if (l.type === 'image') applyImage(el, l, doc);
    else if (l.type === 'text') applyText(el, l, doc);
    else if (l.type === 'icon') applyIcon(el, l, doc);
    else if (l.type === 'shape') applyShape(el, l, doc);
    else if (l.type === 'radar') applyRadar(el, l, doc);
    else applyRaw(el, l, doc);
    el.style.display = l.hidden ? 'none' : '';
    el.style.filter = l.filter || '';
  };

  CV.makeEl = function (l, doc, edit) {
    var el;
    if (l.type === 'radar') {
      el = document.createElement('div');
    } else if (l.type === 'image') {
      el = document.createElement('div');
      var im = document.createElement('img');
      im.draggable = false;
      im.alt = '';
      el.appendChild(im);
      var ov = document.createElement('div');
      ov.className = 'ov';
      el.appendChild(ov);
    } else if (l.type === 'text') {
      el = document.createElement('div');
      el.innerHTML = CV.rich(l.text);
      if (edit) { el.spellcheck = false; el.setAttribute('data-editable', 'text'); }
    } else if (l.type === 'icon') {
      el = document.createElement('img');
      el.draggable = false;
      el.alt = '';
    } else if (l.type === 'shape') {
      el = document.createElement('div');
    } else {
      el = document.createElement('div');
      el.innerHTML = l.html || '';
    }
    el.dataset.id = l.id;
    CV.applyLayer(el, l, doc);
    /* applyLayer 会重设 className，所以这两个类必须加在它之后 */
    if ((l.opacity == null ? 1 : l.opacity) < 0.5) el.classList.add('cv-ghost');
    if (l.locked) el.classList.add('cv-locked');
    return el;
  };

  /** 自适应字号：按宽度 / 限高两轮收敛 */
  function lineWidth(el) {
    var ws = el.style.whiteSpace;
    el.style.whiteSpace = 'pre';
    var w = el.scrollWidth;
    el.style.whiteSpace = ws;
    return w;
  }
  function fitLayer(el, l, doc) {
    if (!l.fit) return;
    var M = CV.metrics(doc || CV.__doc || {});
    var maxW = M.w(l.w), maxH = l.maxH ? M.fs(l.maxH) : 0, base = M.fs(l.size);
    el.style.fontSize = base + 'px';
    var k = 1, sw = lineWidth(el);
    if (sw > maxW + 0.5) k = Math.min(k, maxW / sw);
    if (maxH && el.scrollHeight > maxH + 0.5) k = Math.min(k, maxH / el.scrollHeight);
    if (k >= 1) return;
    var s1 = Math.max(13, Math.floor(base * k * 0.985));
    el.style.fontSize = s1 + 'px';
    var k2 = 1;
    sw = lineWidth(el);
    if (sw > maxW + 0.5) k2 = Math.min(k2, maxW / sw);
    if (maxH && el.scrollHeight > maxH + 0.5) k2 = Math.min(k2, maxH / el.scrollHeight);
    if (k2 < 1) el.style.fontSize = Math.max(13, Math.floor(s1 * k2 * 0.985)) + 'px';
  }

  var FX_BACK = { glow: 1 };
  var FX_ORDER = ['glow', 'grain', 'paper', 'wrinkle', 'vignette', 'scan', 'dotgrid'];

  CV.render = function (doc, host, opts) {
    opts = opts || {};
    CV.__doc = doc;
    host.innerHTML = '';
    var root = document.createElement('div');
    root.className = 'cv' + (opts.edit ? ' cv-edit' : '');
    root.style.width = doc.w + 'px';
    root.style.height = doc.h + 'px';
    root.style.background = doc.bg || '#fff';
    if (doc.bgPattern && CV.bgPatternEl) {
      var bpEl = CV.bgPatternEl(doc.bgPattern, doc.w, doc.h);
      if (bpEl) root.appendChild(bpEl);
    }
    if (doc.tokens && doc.tokens.ink) root.style.color = doc.tokens.ink;
    if (doc.tokens && doc.tokens.accent) root.style.setProperty('--hl', doc.tokens.accent);

    var bg = document.createElement('div');
    bg.className = 'cv-bg';
    root.appendChild(bg);

    /* 自定义背景图：在底色之上、图层之下 */
    if (doc.bgImage && doc.bgImage.src) {
      var B = doc.bgImage;
      var bi = document.createElement('div');
      bi.className = 'cv-bgimg';
      bi.style.left = (B.x == null ? 0 : B.x) + '%';
      bi.style.top = (B.y == null ? 0 : B.y) + '%';
      bi.style.width = (B.w == null ? 100 : B.w) + '%';
      bi.style.height = (B.h == null ? 100 : B.h) + '%';
      bi.style.backgroundImage = 'url("' + B.src + '")';
      bi.style.backgroundSize = B.fit === 'contain' ? 'contain' : 'cover';
      if (B.blur) bi.style.filter = 'blur(' + B.blur + 'px)';
      if (B.opacity != null && B.opacity < 100) bi.style.opacity = (B.opacity / 100);
      /* 渐变遮罩：让图片淡入背景 */
      var dir = B.fade && B.fade.dir, stg = B.fade && B.fade.strength != null ? B.fade.strength : 45;
      if (dir && dir !== 'none') {
        var m;
        if (dir === 'radial') m = 'radial-gradient(ellipse at center, #000 ' + Math.max(0, 100 - stg) + '%, transparent 100%)';
        else {
          var ang = { left: 'to left', right: 'to right', top: 'to top', bottom: 'to bottom' }[dir] || 'to bottom';
          m = 'linear-gradient(' + ang + ', #000 ' + Math.max(0, 100 - stg) + '%, transparent 100%)';
        }
        bi.style.webkitMaskImage = m;
        bi.style.maskImage = m;
      }
      root.appendChild(bi);
      if (B.dim) {
        var dm = document.createElement('div');
        dm.className = 'cv-bgdim';
        dm.style.left = bi.style.left; dm.style.top = bi.style.top;
        dm.style.width = bi.style.width; dm.style.height = bi.style.height;
        dm.style.background = 'rgba(0,0,0,' + Math.min(0.85, B.dim / 100) + ')';
        root.appendChild(dm);
      }
    }

    var fx = (doc.fx || []).slice().sort(function (a, b) { return FX_ORDER.indexOf(a) - FX_ORDER.indexOf(b); });
    fx.forEach(function (n) {
      if (!FX_BACK[n]) return;
      var d = document.createElement('div');
      d.className = 'cv-fx ' + n;
      root.appendChild(d);
    });

    var map = {};
    (doc.layers || []).forEach(function (l) {
      if (!l) return;
      var el = CV.makeEl(l, doc, opts.edit);
      map[l.id] = el;
      root.appendChild(el);
    });

    var paperOn = !!(doc.paper && doc.paper.on === true);   /* 默认关，需要时手动开 */
    var po = doc.paper && doc.paper.opacity != null ? doc.paper.opacity : 80;
    var pn = doc.paper && doc.paper.noise != null ? doc.paper.noise : 60;
    var ps = doc.paper && doc.paper.scale != null ? doc.paper.scale : 260;
    /* 纸纹开关打开时，无论风格有没有声明，都注入纸纤维 / 颗粒 / 褶皱 */
    /* 纸纹开关是权威：关闭时连风格自带的 paper/grain/wrinkle 一起关掉 */
    var list = fx.filter(function (n) {
      if (!paperOn && (n === 'paper' || n === 'grain' || n === 'wrinkle')) return false;
      return true;
    });
    if (paperOn) {
      ['paper', 'grain', 'wrinkle'].forEach(function (n) { if (list.indexOf(n) < 0) list.push(n); });
    }
    list.sort(function (a, b) { return FX_ORDER.indexOf(a) - FX_ORDER.indexOf(b); });
    list.forEach(function (n) {
      if (FX_BACK[n]) return;
      /* 风格自带的纸纹始终保留，开关只决定是否「额外叠加」 */
      var d = document.createElement('div');
      d.className = 'cv-fx ' + n;
      if (n === 'dotgrid') d.style.color = (doc.tokens && doc.tokens.ink) || '#000';
      if (n === 'paper') { d.style.opacity = (po / 100 * 0.55).toFixed(3); d.style.backgroundSize = ps + 'px ' + ps + 'px'; }
      if (n === 'wrinkle') { d.style.opacity = (po / 100 * 0.34).toFixed(3); d.style.backgroundSize = (ps * 1.9) + 'px ' + (ps * 1.9) + 'px'; }
      if (n === 'grain') { d.style.opacity = (pn / 100 * 0.5).toFixed(3); d.style.backgroundSize = Math.max(32, Math.round(ps * 0.5)) + 'px ' + Math.max(32, Math.round(ps * 0.5)) + 'px'; }
      root.appendChild(d);
    });

    host.appendChild(root);

    (doc.layers || []).forEach(function (l) {
      if (l && l.type === 'text' && l.fit) fitLayer(map[l.id], l, doc);
    });

    if (opts.edit) {
      var drop = document.createElement('div');
      drop.className = 'cv-drop';
      root.appendChild(drop);
      root._drop = drop;
    }
    return { root: root, map: map };
  };

  /** 所有图片解码完成（出图前等待） */
  CV.ready = function (host) {
    var imgs = [].slice.call(host.querySelectorAll('img'));
    return Promise.all(imgs.map(function (im) {
      return im.decode ? im.decode().catch(function () { }) : Promise.resolve();
    })).then(function () { return document.fonts ? document.fonts.ready : null; });
  };
})();

/* ================= 品牌色：从图标像素里取 ================= */
(function () {
  var CV = window.CV;
  function h2(n) { var s = Math.round(Math.max(0, Math.min(255, n))).toString(16); return s.length < 2 ? '0' + s : s; }
  CV.rgbHex = function (r, g, b) { return '#' + h2(r) + h2(g) + h2(b); };
  CV.hexRgb = function (hex) {
    var s = String(hex).replace('#', '');
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  };
  /* 与白色混合：t=0 原色，t=1 纯白 */
  CV.tint = function (hex, t) {
    var c = CV.hexRgb(hex);
    return CV.rgbHex(c[0] + (255 - c[0]) * t, c[1] + (255 - c[1]) * t, c[2] + (255 - c[2]) * t);
  };
  /* 提到固定饱和/明度，做品牌强调色 */
  CV.vivid = function (hex, sat, val) {
    var c = CV.hexRgb(hex), r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    var h = 0;
    if (d) {
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (mx === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    var s = sat == null ? 0.78 : sat, v = val == null ? 0.92 : val;
    var i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), tt = v * (1 - (1 - f) * s);
    var out;
    switch (i % 6) {
      case 0: out = [v, tt, p]; break;
      case 1: out = [q, v, p]; break;
      case 2: out = [p, v, tt]; break;
      case 3: out = [p, q, v]; break;
      case 4: out = [tt, p, v]; break;
      default: out = [v, p, q];
    }
    return CV.rgbHex(out[0] * 255, out[1] * 255, out[2] * 255);
  };
  CV.brandColorOf = function (img) {
    try {
      if (!img || !img.complete || !img.naturalWidth) return null;
      var S = 40, c = document.createElement('canvas');
      c.width = c.height = S;
      var g = c.getContext('2d');
      g.drawImage(img, 0, 0, S, S);
      var d = g.getImageData(0, 0, S, S).data;
      var buckets = {}, k;
      for (var i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 200) continue;
        var r = d[i], gg = d[i + 1], b = d[i + 2];
        var mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
        if (mx > 245 && mn > 232) continue;
        if (mx < 30) continue;
        if (mx - mn < 26) continue;
        k = (r >> 4) + '_' + (gg >> 4) + '_' + (b >> 4);
        if (!buckets[k]) buckets[k] = { n: 0, r: 0, g: 0, b: 0 };
        var o = buckets[k]; o.n++; o.r += r; o.g += gg; o.b += b;
      }
      var best = null;
      for (k in buckets) {
        var q = buckets[k];
        q.r /= q.n; q.g /= q.n; q.b /= q.n;
        var sat = Math.max(q.r, q.g, q.b) - Math.min(q.r, q.g, q.b);
        var score = q.n * (1 + sat / 70);
        if (!best || score > best.score) best = { score: score, r: q.r, g: q.g, b: q.b };
      }
      if (!best) return null;
      return CV.vivid(CV.rgbHex(best.r, best.g, best.b));
    } catch (e) { return null; }
  };
})();


/* ==== panels.js ==== */
/* ==========================================================================
   面板层：内容表单 / 风格库 / 图标库 / 属性检查器 / 图层 / AI 生成
   ========================================================================== */
(function () {
  var CV = window.CV;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var App = null, ICONS = [], curVendor = '全部', shotURL = '';

  /* ---------- 小工具 ---------- */
  function el(tag, cls, txt) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (txt != null) d.textContent = txt;
    return d;
  }
  function frag(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function rowField(label, node, hint) {
    var f = el('div', 'field');
    var lb = el('label');
    lb.appendChild(el('span', null, label));
    if (hint) lb.appendChild(el('span', 'hint', hint));
    f.appendChild(lb); f.appendChild(node);
    return f;
  }
  function input(value, oninput, type) {
    var i = document.createElement('input');
    i.className = 'input';
    i.type = type || 'text';
    i.value = value == null ? '' : value;
    if (oninput) i.addEventListener('input', function () { oninput(i.value); });
    return i;
  }
  function num(value, oninput, step) {
    var i = document.createElement('input');
    i.className = 'input'; i.type = 'number'; i.step = step || 1;
    i.value = value == null ? 0 : value;
    i.addEventListener('input', function () { oninput(parseFloat(i.value) || 0); });
    return i;
  }
  function slider(value, min, max, step, oninput, fmt) {
    var wrap = el('div', 'slider');
    var r = document.createElement('input');
    r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = value;
    var v = el('span', 'val', fmt ? fmt(value) : value);
    r.addEventListener('input', function () {
      var x = parseFloat(r.value);
      v.textContent = fmt ? fmt(x) : x;
      oninput(x);
    });
    wrap.appendChild(r); wrap.appendChild(v);
    return wrap;
  }
  function seg(options, value, onpick) {
    var w = el('div', 'seg');
    options.forEach(function (o) {
      var b = el('button', o.v == value ? 'on' : null);
      b.type = 'button';
      b.textContent = o.t;
      if (o.title) b.title = o.title;
      b.addEventListener('click', function () {
        $$('button', w).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        onpick(o.v);
      });
      w.appendChild(b);
    });
    return w;
  }
  function colorRow(value, onpick) {
    var wrap = el('div');
    var sw = el('div', 'sw-row');
    var curBtn = el('button', 'sw-btn on');
    curBtn.type = 'button';
    curBtn.style.background = value;
    curBtn.title = '当前 ' + value;
    curBtn.addEventListener('click', function () { onpick(value); });
    sw.appendChild(curBtn);
    var t = (App.doc.tokens || {});
    var pal = [];
    ['ink', 'ink2', 'accent', 'bgSolid', 'card', 'gold', 'yellow', 'blue', 'red', 'grad', 'violet', 'steel'].forEach(function (k) {
      if (t[k] && typeof t[k] === 'string' && t[k].charAt(0) === '#') pal.push(t[k]);
    });
    pal.push('#ffffff', '#0e1115');
    pal.forEach(function (c) {
      var b = el('button', 'sw-btn' + (c.toLowerCase() === String(value).toLowerCase() ? ' on' : ''));
      b.type = 'button'; b.style.background = c; b.title = c;
      b.addEventListener('click', function () {
        $$$('.sw-btn', sw).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        onpick(c);
      });
      sw.appendChild(b);
    });
    wrap.appendChild(sw);
    var cf = el('div', 'colorfield');
    cf.style.marginTop = '6px';
    var ci = document.createElement('input');
    ci.type = 'color';
    ci.value = /^#[0-9a-f]{6}$/i.test(String(value)) ? value : '#000000';
    var hx = document.createElement('input');
    hx.className = 'hex';
    hx.value = value;
    function setColor(v) {
      ci.value = /^#[0-9a-f]{6}$/i.test(v) ? v : ci.value;
      hx.value = v;
      curBtn.style.background = v;
      $$('.sw-btn', sw).forEach(function (x) { x.classList.remove('on'); });
      curBtn.classList.add('on');
      onpick(v);
    }
    ci.addEventListener('input', function () { setColor(ci.value); });
    ci.addEventListener('change', function () { setColor(ci.value); });
    hx.addEventListener('input', function () {
      var v = hx.value.trim();
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) setColor(v);
    });
    cf.appendChild(ci); cf.appendChild(hx);
    wrap.appendChild(cf);
    return wrap;
  }
  function group(title, nodes, right) {
    var g = el('div', 'group');
    var h = el('div', 'group-h');
    h.appendChild(el('span', 'group-t', title));
    if (right) h.appendChild(right);
    g.appendChild(h);
    (Array.isArray(nodes) ? nodes : [nodes]).forEach(function (n) { if (n) g.appendChild(n); });
    return g;
  }

  /* ---------- 内容表单 ---------- */
  var FIELDS = [
    { k: 'series', label: '栏目 / 频道', ph: '白鸦 · AI 日报' },
    { k: 'title', label: '主标题', ph: '一行一个换行', area: 3 },
    { k: 'sub', label: '副标题', ph: '支持 [[高亮片段]]', area: 2 },
    { k: 'kicker', label: '顶部小字', ph: '2026.10.28 · 第 561 期' },
    { k: 'date', label: '日期', ph: '2026.10.28' },
    { k: 'foot', label: '底部信息', ph: '每日 18:00 更新' }
  ];

  function buildContentPane() {
    var p = $('#paneContent');
    p.innerHTML = '';
    FIELDS.forEach(function (f) {
      var node;
      if (f.area) {
        node = document.createElement('textarea');
        node.className = 'input'; node.rows = f.area; node.placeholder = f.ph;
      } else {
        node = input('', null);
        node.placeholder = f.ph;
      }
      node.dataset.k = f.k;
      node.addEventListener('input', function () {
        setRole(f.k, node.value, true);
      });
      node.addEventListener('change', function () { App.commit(); });
      p.appendChild(rowField(f.label, node));
    });
    var ic = el('button', 'btn');
    ic.id = 'btnPickIcon';
    ic.textContent = '选择主视觉图标 →';
    ic.style.width = '100%';
    ic.style.justifyContent = 'center';
    ic.addEventListener('click', function () { switchTab('icons'); });
    p.appendChild(rowField('主视觉图标', ic, '可直接拖进画布'));

    var gen = el('button', 'btn primary');
    gen.textContent = '重排当前风格';
    gen.style.width = '100%'; gen.style.justifyContent = 'center';
    gen.addEventListener('click', function () { App.recompose(); App.toast('已按当前风格重排', 'ok'); });
    p.appendChild(rowField('重排', gen, '保留全部文案'));
  }

  function setRole(role, value, live) {
    var l = null;
    App.doc.layers.forEach(function (x) { if (x.role === role && x.type === 'text' && !l) l = x; });
    if (!l) return;
    l.text = value;
    if (!App.doc.content) App.doc.content = {};
    App.doc.content[role] = value;
    var e = App.map[l.id];
    if (e) { e.innerHTML = CV.rich(value); }
    App.apply();
    if (!live) App.commit();
  }

  /* ---------- 风格库 ---------- */
  function buildStylePane() {
    var p = $('#paneStyle');
    p.innerHTML = '';
    var grid = el('div', 'styles');
    CV.STYLES.forEach(function (s) {
      var b = el('button', 'style-card');
      b.type = 'button'; b.dataset.style = s.id;
      var sw = el('div', 'sw');
      sw.style.background = s.bg;
      var chips = [s.t.ink, s.t.accent, s.t.ink2, s.t.yellow || s.t.gold || s.t.blue || s.t.violet, s.t.bgSolid].filter(Boolean);
      chips.forEach(function (c, i) {
        var i2 = el('i');
        i2.style.background = c;
        i2.style.width = (i === 0 ? 22 : 10) + 'px';
        i2.style.height = (i === 0 ? 10 : 10) + 'px';
        sw.appendChild(i2);
      });
      var nm = el('div', 'nm');
      var sdesc = typeof s.sub === 'string' ? s.sub : (typeof s.desc === 'string' ? s.desc : '');
      nm.innerHTML = CV.esc(s.name) + '<small>' + CV.esc(sdesc) + '</small>';
      b.appendChild(sw); b.appendChild(nm);
      b.addEventListener('click', function () {
        App.recompose({ style: s.id });
        App.toast('已切换：' + s.name, 'ok');
      });
      grid.appendChild(b);
    });
    p.appendChild(group('风格预设 · ' + CV.STYLES.length + ' 套', grid));

    var lays = el('div', 'layouts');
    lays.id = 'layoutGrid';
    p.appendChild(group('版式', lays));


    /* 信息底纹 */
    var bpc = (window.App && App.doc && App.doc.bgPattern) || null;
    var g4 = el('div', 'group');
    var h4 = el('div', 'group-h');
    h4.appendChild(el('span', 'group-t', '信息底纹 · ' + (CV.BG_PATTERNS ? CV.BG_PATTERNS.length : 0) + ' 种'));
    g4.appendChild(h4);
    var bgTip = el('p', 'empty', '用真实 AI 资讯铺满画布当背景，纯底纹、无标签');
    bgTip.style.padding = '0 0 8px';
    g4.appendChild(bgTip);
    var prow = el('div', 'chiprow');
    var noneB = el('button', !bpc ? 'on' : '', '无');
    noneB.type = 'button';
    noneB.addEventListener('click', function () { App.setBgPattern(null); App.toast('已关闭信息底纹'); });
    prow.appendChild(noneB);
    (CV.BG_PATTERNS || []).forEach(function (bp) {
      var b = el('button', bpc === bp.id ? 'on' : '', bp.name);
      b.type = 'button';
      b.title = bp.name + ' · ' + bp.cols + ' 栏';
      b.addEventListener('click', function () { App.setBgPattern(bp.id); App.toast('背景底纹：' + bp.name, 'ok'); });
      prow.appendChild(b);
    });
    g4.appendChild(prow);
    p.appendChild(g4);

    var note = el('div', 'note');
    note.innerHTML = '<b>换风格不丢文案</b>：先从「内容」填一次，之后随时切风格/版式，文字会自动带过去。';
    p.appendChild(note);
  }

  /* ---------- 版式选择（按当前方向只显示对应骨架） ---------- */
  function renderLayouts() {
    var host = $('#layoutGrid');
    if (!host) return;
    host.innerHTML = '';
    var portraitNow = App && App.doc ? App.doc.h > App.doc.w : false;
    CV.LAYOUTS.filter(function (l) { return !!l.tall === portraitNow; }).forEach(function (l) {
      var b = el('button', 'lay' + (App && App.doc && App.doc.layout === l.id ? ' on' : ''));
      b.type = 'button';
      b.style.gridTemplateRows = '1fr 1fr';
      var bars = l.id === 'hero' ? [[0, 0, 60, 34], [60, 8, 38, 18]]
        : l.id === 'poster' ? [[16, 30, 68, 14], [30, 48, 40, 8]]
          : l.id === 'split' ? [[0, 0, 100, 18], [0, 22, 58, 34]]
            : l.id === 'stack' ? [[28, 0, 44, 16], [0, 20, 100, 26], [10, 50, 80, 10]]
              : l.id === 'sheet' ? [[0, 0, 100, 14], [6, 18, 88, 22], [28, 44, 44, 26]]
                : [[0, 20, 46, 40], [52, 8, 46, 52]];
      bars.forEach(function (r2) {
        var d = el('b');
        d.style.cssText = 'grid-column:1/-1;opacity:' + (r2[3] > 20 ? 0.95 : 0.55);
        b.appendChild(d);
      });
      b.title = l.name;
      b.dataset.layout = l.id;
      b.addEventListener('click', function () {
        var LO = CV.layoutById(l.id);
        var portrait = App.doc.h > App.doc.w;
        var opts = { layout: l.id };
        if (LO && LO.tall && !portrait) opts.ratio = 'xhs';
        if (LO && !LO.tall && portrait) opts.ratio = 'land';
        App.recompose(opts);
      });
      host.appendChild(b);
    });
  }

  /* ---------- 图标库：一厂商一格 · 按热度排序 · 右键看全部变体 ---------- */
  var VENDORS = [];      // { vendor, models, total, rep:{id,variant}, kw }
  var V_BY_NAME = {};
  var HOT = ['OpenAI', '字节跳动', 'Google', 'Meta', 'Anthropic', '智谱 AI', 'MiniMax', '月之暗面',
    'DeepSeek', '阿里通义', 'xAI', 'Microsoft', 'Mistral AI', 'Midjourney', 'Stability AI', 'Runway',
    'Perplexity', 'Manus', 'Cognition', '腾讯', '百度', '华为', '快手', '科大讯飞', '阶跃星辰',
    '零一万物', '百川智能', '面壁智能', '商汤', '上海AI实验室', '昆仑万维', '生数科技', '美团',
    '小米', '秘塔', '智源 BAAI', '360 智脑', 'Ollama', 'vLLM', 'ComfyUI', 'LangChain', 'Cline',
    'Suno', 'ElevenLabs', 'Luma AI', 'Pika', 'Krea', 'Ideogram', 'Recraft', 'Black Forest',
    'Cohere', 'AI21 Labs', 'Ai2', 'NVIDIA', 'Quora', 'Replit', 'Vercel', 'Dify', 'FastGPT',
    'Goose', 'Hermes', 'Hedra', 'Haiper', 'Tripo', 'Meshy', 'Viggle', 'NovelAI', 'Udio', 'TII'];
  function hotRank(v) { var i = HOT.indexOf(v); return i < 0 ? 999 : i; }

  var V_ORDER = ['symbol-color', 'symbol-black', 'appicon', 'symbol-trans-color', 'tile-light', 'symbol-white', 'tile-dark', 'appicon-trans'];
  function repVariant(list) {
    for (var i = 0; i < V_ORDER.length; i++) if (list.indexOf(V_ORDER[i]) > -1) return V_ORDER[i];
    return list[0];
  }
  function variantURL(id, v, dark) { return CV.iconSrc(id + '#' + v, dark); }
  function tileBg(v) { return /white/.test(v) ? '#151517' : '#ffffff'; }

  function buildIconPane() {
    var p = $('#paneIcons');
    p.innerHTML = '';

    var sc = el('div', 'icsearch');
    sc.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    var si = input('', function (v) { renderIcons(v); });
    si.id = 'iconSearchInput';
    si.placeholder = '搜索模型 / 品牌…';
    sc.appendChild(si);
    p.appendChild(sc);
    var row = el('div', 'icacts');
    var b1 = el('button', 'btn sm', '导入图标');
    var b2 = el('button', 'btn sm', '导出图标');
    [b1, b2].forEach(function (b) {
      b.type = 'button';
      b.addEventListener('click', function () { App.toast('图标目录：assets/icons（替换文件即可更新）', 'ok'); });
      row.appendChild(b);
    });
    p.appendChild(row);
    var bar = el('div', 'icbar');
    var cnt = el('span', 'iccount', '');
    cnt.id = 'iconCount';
    bar.appendChild(cnt);
    bar.appendChild(el('span', 'ichint', '左键拖入 · 右键看变体'));
    p.appendChild(bar);
    var list = el('div', 'iclist');
    list.id = 'iconList';
    p.appendChild(list);
    try { window.__VENDORS = VENDORS; } catch (e) { }

  }

  /* 精灵图：一次请求拿到全部 114 个品牌图标（替代 114 次 <img> 请求） */
  var SPRITE = null;
  function loadSprite() {
    fetch('assets/icons/sprite.json', { cache: 'force-cache' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        SPRITE = j;
        var si2 = document.getElementById('iconSearchInput');
        if (document.getElementById('iconList')) renderIcons(si2 ? si2.value : '');
      })
      .catch(function () { });
  }
  function spriteStyle(key) {
    if (!SPRITE || !SPRITE.map[key]) return null;
    var c = SPRITE.map[key][0], rr = SPRITE.map[key][1];
    var numW = SPRITE.w - SPRITE.cell, numH = SPRITE.h - SPRITE.cell;
    return {
      backgroundImage: 'url(assets/icons/sprite.png)',
      backgroundSize: ((SPRITE.w / SPRITE.cell) * 100) + '% auto',
      backgroundPosition: (numW ? -(c / numW) * 100 : 0).toFixed(2) + '% ' + (numH ? -(rr / numH) * 100 : 0).toFixed(2) + '%',
      backgroundRepeat: 'no-repeat'
    };
  }

  function renderIcons(q) {
    var host = $('#iconList');
    if (!host) return;
    host.innerHTML = '';
    var kw = (q || '').toLowerCase().trim();
    var hits = VENDORS.filter(function (v) { return !kw || v.kw.indexOf(kw) > -1; });
    var cnt = $('#iconCount');
    if (cnt) {
      var n = 0;
      hits.forEach(function (v) { n += v.total; });
      cnt.textContent = hits.length + ' 个品牌 · ' + n + ' 个图标';
    }
    if (!hits.length) { host.appendChild(el('p', 'empty', '没有匹配的品牌')); return; }
    var frag = document.createDocumentFragment();
    hits.slice(0, 400).forEach(function (v) {
      var tile = el('div', 'ictile');
      tile.draggable = false;
      tile.style.webkitUserDrag = 'none';
      tile.title = v.vendor + '（' + v.models.length + ' 个模型 · ' + v.total + ' 个图标）';
      var key = v.rep.id + '#' + v.rep.variant;
      var ss = spriteStyle(key);
      if (ss) {
        var ph = el('i', 'isp');
        ph.style.backgroundImage = ss.backgroundImage;
        ph.style.backgroundSize = ss.backgroundSize;
        ph.style.backgroundPosition = ss.backgroundPosition;
        ph.style.backgroundRepeat = ss.backgroundRepeat;
        tile.appendChild(ph);
      } else {
        var img = document.createElement('img');
        img.src = variantURL(v.rep.id, v.rep.variant, App.doc.dark);
        img.alt = v.vendor;
        img.draggable = false;
        img.loading = 'lazy';
        img.decoding = 'async';
        tile.appendChild(img);
      }
      tile.appendChild(el('span', 'ibadge', String(v.total)));
      tile.addEventListener('pointerdown', function (e) { startIconDrag(e, v.rep.id + '#' + v.rep.variant); });
      tile.addEventListener('click', function () {
        if (App.__skipClick) { App.__skipClick = false; return; }
        placeIcon(v.rep.id + '#' + v.rep.variant, 'main');
      });
      tile.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        openVendorPopover(v, e.clientX, e.clientY);
      });
      frag.appendChild(tile);
    });
    host.appendChild(frag);
  }

  /* ---------- 右键浮层：该品牌全部模型 × 全部变体 ---------- */
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function openVendorPopover(v, x, y) {
    closePop();
    pop = el('div', 'icpop');
    var head = el('div', 'icp-h');
    var htxt = el('div', 'icp-ht');
    htxt.innerHTML = '<b>' + CV.esc(v.vendor) + '</b><span>' + v.models.length + ' 个模型 · ' + v.total + ' 个图标</span>';
    var xBtn = el('button', 'icp-x', '关闭');
    xBtn.type = 'button';
    xBtn.addEventListener('click', closePop);
    head.appendChild(htxt); head.appendChild(xBtn);
    pop.appendChild(head);
    var body = el('div', 'icp-b');
    v.models.forEach(function (m) {
      var sec = el('div', 'icp-sec');
      var t = el('div', 'icp-t');
      t.innerHTML = CV.esc(m.product) + '<i>' + m.variants.length + '</i>';
      sec.appendChild(t);
      var grid = el('div', 'icp-g');
      m.variants.forEach(function (vv) {
        var ref = m.id + '#' + vv;
        var b = el('button', 'icp-i');
        b.type = 'button';
        b.draggable = false;
        b.style.webkitUserDrag = 'none';
        b.title = m.product + ' · ' + vv;
        b.style.background = tileBg(vv);
        var im = document.createElement('img');
        im.src = variantURL(m.id, vv, App.doc.dark);
        im.draggable = false;
        b.appendChild(im);
        b.addEventListener('pointerdown', function (e) { startIconDrag(e, ref, true); });
        b.addEventListener('click', function () {
          if (App.__skipClick) { App.__skipClick = false; return; }
          placeIcon(ref, 'main');
          closePop();
        });
        grid.appendChild(b);
      });
      sec.appendChild(grid);
      body.appendChild(sec);
    });
    pop.appendChild(body);
    document.body.appendChild(pop);
    var w = pop.offsetWidth || 470, hh = pop.offsetHeight || 420;
    pop.style.left = Math.max(10, Math.min(x, window.innerWidth - w - 14)) + 'px';
    pop.style.top = Math.max(10, Math.min(y, window.innerHeight - hh - 14)) + 'px';
    setTimeout(function () { document.addEventListener('pointerdown', onDoc, true); }, 0);
    function onDoc(ev) {
      if (pop && !pop.contains(ev.target)) { closePop(); document.removeEventListener('pointerdown', onDoc, true); }
    }
  }

  function placeIcon(ref, mode) {
    if (mode === 'layer') {
      App.addLayer(CV.I('icon', ref, { x: 720, y: 220, w: 260, h: 260 }), true);
      App.toast('已插入图层：' + CV.iconLabel(ref), 'ok');
      return;
    }
    var l = null;
    App.doc.layers.forEach(function (x) { if (x.type === 'icon' && x.role === 'icon' && !l) l = x; });
    if (l) {
      l.icon = ref;
      if (!App.doc.content) App.doc.content = {};
      App.doc.content.icon = ref;
    } else {
      App.doc.layers.push(CV.I('icon', ref, { x: 720, y: 180, w: 320, h: 320 }));
    }
    App.apply();
    App.commit();
    App.toast('主视觉：' + CV.iconLabel(ref), 'ok');
  }

  /* ---------- 文字元素库 ---------- */
  var ELEMENTS = [
    {
      g: '封面', items: [
        ['日期水印', function (t) { return CV.T('datewm', '2026.10.28', { x: 848, y: 44, w: 248, size: 15, font: 'mono', align: 'right', ls: .1, color: t.ink2 }); }],
        ['顶栏', function (t) { return CV.S('topbar', 'rect', { x: 0, y: 0, w: CV.W, h: 96, color: t.ink }); }],
        ['元信息行', function (t) { return CV.T('meta', '2026.10.28 · 第 561 期 · 22 条', { x: 64, y: 44, w: 620, size: 15, font: 'mono', ls: .16, upper: true, color: t.ink2 }); }],
        ['大标题', function (t) { return CV.T('title', '在这里输入大标题', { x: 64, y: 150, w: 600, size: 92, fit: true, maxH: 300, font: 'heavy', color: t.ink }); }],
        ['副标题', function (t) { return CV.T('sub', '副标题，把重点用 [[高亮]] 包住', { x: 64, y: 470, w: 520, size: 23, font: 'bold', lh: 1.6, color: t.ink2 }); }],
        ['分隔线', function (t) { return CV.S('rule', 'bar', { x: 64, y: 120, w: 76, h: 5, color: t.accent }); }],
        ['分类卡', function (t) { return CV.S('pill', 'round', { x: 64, y: 300, w: 180, h: 44, color: t.accent, radius: 12, opacity: .92 }); }]
      ]
    },
    {
      g: '图表', items: [
        ['雷达图', function (t) { return CV.RADAR('radar', null, { x: 320, y: 120, w: 420, h: 420 }); }]
      ]
    },
    {
      g: '报纸版式', items: [
        ['报头', function (t) {
          return CV.T('mast', 'AI 日报 | 第 561 期', {
            x: 64, y: 22, w: 900, size: 62, font: 'heavy', weight: 900, ls: .02, lh: 1.1, color: t.ink
          });
        }],
        ['日期框', function (t) {
          return [
            CV.S('datebox', 'round', { x: 64, y: 116, w: 152, h: 72, color: '#ffffff', radius: 4, bw: 3, bc: t.accent }),
            CV.T('datetxt', '2026\n10-28', {
              x: 64, y: 126, w: 152, size: 22, font: 'mono', weight: 900, align: 'center', lh: 1.3, color: t.accent
            })
          ];
        }],
        ['正文栏', function (t) {
          return CV.T('npcols', CV.npText ? CV.npText(4) : '正文…', {
            x: 64, y: 210, w: 1032, size: 12, font: 'serif', weight: 400, lh: 1.46, ls: .01,
            color: '#a8a29a', cols: 7, gap: 14, rule: 'rgba(0,0,0,.16)', maxH: 430, align: 'justify'
          });
        }],
        ['栏线', function (t) {
          return CV.S('colrule', 'bar', { x: 64, y: 200, w: 1032, h: 2, color: t.ink, opacity: .55, radius: 0 });
        }]
      ]
    },
    {
      g: '新闻页', items: [
        ['眉标', function (t) { return CV.T('kicker', 'SECTION / 眉标', { x: 64, y: 40, w: 420, size: 11, font: 'mono', ls: .3, color: t.accent }); }],
        ['强调条', function (t) { return CV.T('hl', '一句话强调，压住版面', { x: 64, y: 556, w: 660, size: 26, font: 'heavy', color: t.accent }); }],
        ['正文', function (t) { return CV.T('body', '正文段落……', { x: 48, y: 600, w: 1064, size: 12.5, font: 'serif', lh: 1.8, color: t.ink2, cols: 3, gap: 28, maxH: 92 }); }],
        ['导语', function (t) { return CV.T('deck', '导语：把本期最要紧的一句话放在这里', { x: 64, y: 360, w: 780, size: 19, font: 'bold', lh: 1.55, color: t.ink2 }); }],
        ['要点列表', function (t) { return CV.T('list', '01　要点一\n02　要点二\n03　要点三', { x: 64, y: 400, w: 520, size: 18, font: 'bold', lh: 1.9, color: t.ink }); }],
        ['数据块', function (t) { return CV.T('num', '561', { x: 900, y: 520, w: 200, size: 96, font: 'impact', align: 'right', color: t.accent }); }]
      ]
    },
    {
      g: '通用', items: [
        ['字幕', function (t) { return CV.T('cap', '字幕：一行说明文字', { x: 80, y: 660, w: 1000, size: 18, font: 'bold', align: 'center', color: '#ffffff' }); }],
        ['标签带', function (t) { return CV.S('tape', 'rect', { x: 0, y: 300, w: CV.W, h: 44, color: t.accent, opacity: .9 }); }],
        ['页脚', function (t) { return CV.T('foot', '页脚：来源 / 时间 / 版权', { x: 64, y: 672, w: 640, size: 12, font: 'mono', ls: .06, color: t.ink2 }); }],
        ['图片', function (t) { return CV.S('slot', 'rect', { x: 120, y: 180, w: 380, h: 300, color: 'rgba(0,0,0,.06)', bw: 2, bc: t.ink2, radius: 10 }); }]
      ]
    }
  ];

  function buildTextPane() {
    var p = $('#paneText');
    if (!p) return;
    p.innerHTML = '';
    ELEMENTS.forEach(function (grp) {
      var g = el('div', 'elgroup');
      g.appendChild(el('div', 'elgroup-t', grp.g));
      grp.items.forEach(function (it) {
        var b = el('button', 'elitem');
        b.type = 'button';
        var n = el('span', null, it[0]);
        var plus = el('b', null, '+');
        b.appendChild(plus); b.appendChild(n);
        b.addEventListener('click', function () {
          var t = App.doc.tokens || {};
          var made = it[1](t);
          (Array.isArray(made) ? made : [made]).forEach(function (l) { App.addLayer(l, true); });
          App.commit();
          App.toast('已添加「' + it[0] + '」');
        });
        g.appendChild(b);
      });
      p.appendChild(g);
    });
    var note = el('div', 'note');
    note.innerHTML = '<b>点击即插入</b>，插入后可直接拖动 / 改字 / 调参。颜色会自动取当前风格的强调色与墨色。';
    p.appendChild(note);
  }

  /* ---------- 画布：纸纹 / 背景 ---------- */
  var paperRefs = {};
  function buildCanvasPane() {
    setTimeout(function () { bindRangeFills(document); }, 0);
    var p = $('#paneCanvas');
    if (!p) return;
    p.innerHTML = '';
    var g1 = el('div', 'group');
    var h = el('div', 'group-h');
    h.appendChild(el('span', 'group-t', '纸纹'));
    var sw = el('button', 'switch');
    sw.type = 'button';
    sw.id = 'paperSwitch';
    sw.addEventListener('click', function () {
      var d = App.doc;
      d.paper = Object.assign({ on: false, opacity: 80, noise: 60, scale: 260 }, d.paper || {});
      d.paper.on = d.paper.on !== true;   /* 默认关，点一下才开 */
      App.apply(); App.commit();
    });
    h.appendChild(sw);
    g1.appendChild(h);

    var mkSlider = function (label, key, min, max, step, unit) {
      var f = el('div', 'field');
      var lb = el('label');
      lb.appendChild(el('span', null, label));
      var hint = el('span', 'hint', '');
      lb.appendChild(hint);
      f.appendChild(lb);
      var wrap = el('div', 'slider');
      var r = document.createElement('input');
      r.type = 'range'; r.min = min; r.max = max; r.step = step;
      var v = el('span', 'val', '');
      r.addEventListener('input', function () {
        var d = App.doc;
        d.paper = Object.assign({ on: true, opacity: 80, noise: 60, scale: 260 }, d.paper || {});
        d.paper[key] = parseFloat(r.value);
        v.textContent = r.value + unit;
        hint.textContent = r.value + unit;
        if (key === 'scale') { v.textContent = r.value + 'px'; hint.textContent = r.value + 'px'; }
        App.paperLive();
      });
      r.addEventListener('change', function () { App.commit(); });
      wrap.appendChild(r); wrap.appendChild(v);
      f.appendChild(wrap);
      paperRefs[key] = { r: r, v: v, hint: hint, unit: unit };
      return f;
    };
    g1.appendChild(mkSlider('不透明度', 'opacity', 0, 100, 1, '%'));
    g1.appendChild(mkSlider('噪点密度', 'noise', 0, 100, 1, '%'));
    g1.appendChild(mkSlider('纹理尺寸', 'scale', 80, 600, 10, 'px'));
    p.appendChild(g1);

    var g2 = el('div', 'group');
    g2.appendChild(el('div', 'group-h')).appendChild(el('span', 'group-t', '背景'));
    var bgBox = el('div', 'chiprow');
    [['#ffffff', '纯白'], ['#f4f8ff', '冷白'], ['#efe7d6', '纸色'], ['#f1ece1', '米色'], ['#0e1115', '墨黑']].forEach(function (o) {
      var b = el('button', null, o[1]);
      b.type = 'button';
      b.addEventListener('click', function () {
        App.doc.bg = o[0];
        App.apply(); App.commit();
      });
      bgBox.appendChild(b);
    });
    g2.appendChild(bgBox);
    var restore = el('button', 'btn');
    restore.textContent = '恢复该风格默认背景';
    restore.style.width = '100%'; restore.style.marginTop = '8px'; restore.style.justifyContent = 'center';
    restore.addEventListener('click', function () {
      var p2 = CV.styleById(App.doc.style);
      App.doc.bg = p2.bg;
      App.apply(); App.commit();
    });
    g2.appendChild(restore);

    /* ---- 渐变 ---- */
    var gl = el('label', 'seclabel'); gl.appendChild(el('span', null, '渐变'));
    g2.appendChild(gl);
    var grads = [
      ['柔和', ['#f4f1ff', '#e6e9ff', '#f7e9f2']],
      ['冷蓝', ['#eef4ff', '#dbe6ff', '#f0f4ff']],
      ['暖米', ['#fdf4ec', '#f8e8d8', '#fbf1e6']],
      ['墨黑', ['#1b1e24', '#2a2f38', '#14161a']]
    ];
    var grow = el('div', 'chiprow');
    grads.forEach(function (g) {
      var b = el('button', '', g[0]);
      b.type = 'button';
      b.style.background = 'linear-gradient(135deg,' + g[1][0] + ',' + g[1][1] + ',' + g[1][2] + ')';
      b.style.color = (g[0] === '墨黑') ? '#fff' : '#333';
      b.addEventListener('click', function () {
        App.setBg('linear-gradient(135deg,' + g[1][0] + ' 0%,' + g[1][1] + ' 55%,' + g[1][2] + ' 100%)', true);
        App.toast('背景：' + g[0] + '渐变', 'ok');
      });
      grow.appendChild(b);
    });
    g2.appendChild(grow);

    /* ---- 自定义纯色 ---- */
    var cl = el('div', 'field');
    var clb = el('label', 'seclabel'); clb.appendChild(el('span', null, '自定义底色'));
    cl.appendChild(clb);
    var crow = el('div', 'chiprow');
    var cIn = document.createElement('input');
    cIn.type = 'color';
    cIn.value = '#eef2ff';
    cIn.addEventListener('input', function () { App.setBg(cIn.value, false); });
    cIn.addEventListener('change', function () { App.setBg(cIn.value, true); });
    crow.appendChild(cIn);
    var cHint = el('span', 'hint', '直接调色');
    crow.appendChild(cHint);
    cl.appendChild(crow);
    g2.appendChild(cl);

    /* ---- 自定义渐变 ---- */
    var gl2 = el('div', 'field');
    var glb = el('label', 'seclabel'); glb.appendChild(el('span', null, '自定义渐变'));
    var gv = el('span', 'hint', '135°');
    glb.appendChild(gv);
    gl2.appendChild(glb);
    var g2row = el('div', 'chiprow');
    var c1 = document.createElement('input'); c1.type = 'color'; c1.value = '#e8f0ff';
    var c2 = document.createElement('input'); c2.type = 'color'; c2.value = '#f8ecf3';
    [c1, c2].forEach(function (x) { g2row.appendChild(x); });
    var ang = document.createElement('input');
    ang.type = 'range'; ang.min = 0; ang.max = 360; ang.step = 5; ang.value = 135;
    ang.style.flex = '1';
    g2row.appendChild(ang);
    var applyGrad = function (commit) {
      gv.textContent = ang.value + '°';
      App.setBg(App.gradientCss(c1.value, c2.value, ang.value), commit);
    };
    ang.addEventListener('input', function () { applyGrad(false); });
    ang.addEventListener('change', function () { applyGrad(true); });
    c1.addEventListener('input', function () { applyGrad(false); });
    c1.addEventListener('change', function () { applyGrad(true); });
    c2.addEventListener('input', function () { applyGrad(false); });
    c2.addEventListener('change', function () { applyGrad(true); });
    gl2.appendChild(g2row);
    g2.appendChild(gl2);

    /* ---- 上传背景图 ---- */
    var up = el('button', 'btn primary');
    up.textContent = '上传背景图…';
    up.style.width = '100%'; up.style.marginTop = '6px'; up.style.justifyContent = 'center';
    var bgFile = document.createElement('input');
    bgFile.type = 'file';
    bgFile.accept = 'image/*';
    bgFile.style.display = 'none';
    up.addEventListener('click', function () { bgFile.click(); });
    bgFile.addEventListener('change', function () {
      var f = bgFile.files && bgFile.files[0];
      if (!f) return;
      App.readImageFile(f, function (data) {
        App.setBgImage({ src: data });
        App.toast('背景图已设置（可调模糊/压暗）', 'ok');
      });
    });
    g2.appendChild(up);
    g2.appendChild(bgFile);

    var bgI = (window.App && App.doc && App.doc.bgImage) || null;
    if (bgI && bgI.src) {
      var fits = el('div', 'chiprow');
      [['铺满', 'cover'], ['完整', 'contain']].forEach(function (o) {
        var b = el('button', (bgI.fit || 'cover') === o[1] ? 'on' : '', o[0]);
        b.type = 'button';
        b.addEventListener('click', function () { App.setBgImage({ fit: o[1] }); });
        fits.appendChild(b);
      });
      g2.appendChild(fits);
      [['模糊', 'blur', 0, 30], ['压暗', 'dim', 0, 85]].forEach(function (o) {
        var f3 = el('div', 'field');
        var lb = el('label');
        lb.appendChild(el('span', null, o[0]));
        var hv = el('span', 'hint', (bgI[o[1]] || 0) + (o[1] === 'blur' ? 'px' : '%'));
        lb.appendChild(hv);
        f3.appendChild(lb);
        var wrap3 = el('div', 'slider');
        var r3 = document.createElement('input');
        r3.type = 'range'; r3.min = o[2]; r3.max = o[3]; r3.step = 1;
        r3.value = bgI[o[1]] || 0;
        r3.addEventListener('input', function () {
          hv.textContent = r3.value + (o[1] === 'blur' ? 'px' : '%');
        });
        r3.addEventListener('change', function () {
          var o2 = {}; o2[o[1]] = parseInt(r3.value, 10);
          App.setBgImage(o2);
        });
        wrap3.appendChild(r3);
        f3.appendChild(wrap3);
        g2.appendChild(f3);
      });
      /* 图片区域 */
      var rl = el('label', 'seclabel'); rl.appendChild(el('span', null, '图片区域'));
      g2.appendChild(rl);
      var rrow = el('div', 'chiprow');
      [['全屏', 0, 0, 100, 100], ['右半', 50, 0, 50, 100], ['左半', 0, 0, 50, 100],
       ['上半', 0, 0, 100, 50], ['下半', 0, 50, 100, 50]].forEach(function (o) {
        var cur = (bgI.w === o[3] && bgI.h === o[4] && (bgI.x || 0) === o[1] && (bgI.y || 0) === o[2]);
        var b = el('button', cur ? 'on' : '', o[0]);
        b.type = 'button';
        b.addEventListener('click', function () { App.setBgImage({ x: o[1], y: o[2], w: o[3], h: o[4] }); });
        rrow.appendChild(b);
      });
      g2.appendChild(rrow);

      /* 渐变遮罩 */
      var fl = el('label', 'seclabel'); fl.appendChild(el('span', null, '渐变遮罩'));
      g2.appendChild(fl);
      var frow = el('div', 'chiprow');
      [['无', 'none'], ['左淡', 'left'], ['右淡', 'right'], ['上淡', 'top'], ['下淡', 'bottom'], ['四周', 'radial']].forEach(function (o) {
        var cur = ((bgI.fade && bgI.fade.dir) || 'none') === o[1];
        var b = el('button', cur ? 'on' : '', o[0]);
        b.type = 'button';
        b.addEventListener('click', function () { App.setBgImage({ fade: { dir: o[1], strength: (bgI.fade && bgI.fade.strength) || 45 } }); });
        frow.appendChild(b);
      });
      g2.appendChild(frow);

      if (bgI.fade && bgI.fade.dir && bgI.fade.dir !== 'none') {
        var sfl = el('div', 'field');
        var slb = el('label');
        slb.appendChild(el('span', null, '遮罩强度'));
        var shv = el('span', 'hint', (bgI.fade.strength || 45) + '%');
        slb.appendChild(shv);
        sfl.appendChild(slb);
        var swrap = el('div', 'slider');
        var sr = document.createElement('input');
        sr.type = 'range'; sr.min = 5; sr.max = 95; sr.step = 1; sr.value = bgI.fade.strength || 45;
        sr.addEventListener('input', function () { shv.textContent = sr.value + '%'; });
        sr.addEventListener('change', function () {
          App.setBgImage({ fade: { dir: bgI.fade.dir, strength: parseInt(sr.value, 10) } });
        });
        swrap.appendChild(sr);
        sfl.appendChild(swrap);
        g2.appendChild(sfl);
      }

      /* 图片不透明度 */
      var opf = el('div', 'field');
      var opl = el('label');
      opl.appendChild(el('span', null, '图片不透明度'));
      var ohv = el('span', 'hint', (bgI.opacity == null ? 100 : bgI.opacity) + '%');
      opl.appendChild(ohv);
      opf.appendChild(opl);
      var owrap = el('div', 'slider');
      var orr = document.createElement('input');
      orr.type = 'range'; orr.min = 5; orr.max = 100; orr.step = 1; orr.value = bgI.opacity == null ? 100 : bgI.opacity;
      orr.addEventListener('input', function () { ohv.textContent = orr.value + '%'; });
      orr.addEventListener('change', function () { App.setBgImage({ opacity: parseInt(orr.value, 10) }); });
      owrap.appendChild(orr);
      opf.appendChild(owrap);
      g2.appendChild(opf);

      var rm = el('button', 'btn danger');
      rm.textContent = '移除背景图';
      rm.style.width = '100%'; rm.style.marginTop = '6px'; rm.style.justifyContent = 'center';
      rm.addEventListener('click', function () { App.setBgImage(null); App.toast('已移除背景图'); });
      g2.appendChild(rm);
    }

    p.appendChild(g2);

    /* 吸附 & 参考线 */
    var g3 = el('div', 'group');
    var h3 = el('div', 'group-h');
    h3.appendChild(el('span', 'group-t', '辅助'));
    g3.appendChild(h3);
    [['吸附对齐', 'snap', '拖动时自动贴中线 / 边距 / 兄弟元素']].forEach(function (o) {
      var line = el('div', 'toggleline');
      line.appendChild(el('span', null, o[0]));
      var sw = el('button', 'switch');
      sw.type = 'button';
      sw.dataset.aux = o[1];
      line.title = o[2];
      line.appendChild(sw);
      g3.appendChild(line);
    });
    p.appendChild(g3);

    var note = el('div', 'note');
    note.innerHTML = '纸纹由三张贴图叠加而成（纸纤维 / 颗粒 / 褶皱）。<b>纹理尺寸</b> 越小颗粒越细。';
    p.appendChild(note);
  }

  function bindAuxSwitches() {
    var pane = $('#paneCanvas');
    if (!pane || pane.__aux) return;
    pane.__aux = true;
    pane.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-aux]') : null;
      if (!b) return;
      var k = b.dataset.aux;
      App.doc[k] = App.doc[k] || { on: true };
      App.doc[k].on = App.doc[k].on === false;
      App.apply(); App.commit();
      App.toast((k === 'snap' ? '吸附' : '参考线') + (App.doc[k].on ? '已开启' : '已关闭'));
    });
  }

  function syncCanvas() {
    setTimeout(function () { bindRangeFills(document); }, 0);
    var d = App.doc;
    var sw = $('#paperSwitch');
    if (sw) sw.classList.toggle('on', !(d.paper && d.paper.on === false));
    var DEF = { opacity: 80, noise: 60, scale: 260 };
    var p = Object.assign({}, DEF, d.paper || {});
    [].forEach.call(document.querySelectorAll('#paneCanvas [data-aux]'), function (b) {
      var o = App.doc[b.dataset.aux] || {};
      b.classList.toggle('on', o.on !== false);
    });
    Object.keys(paperRefs).forEach(function (k) {
      var o = paperRefs[k];
      if (!o.r) return;
      if (document.activeElement === o.r) return;
      o.r.value = p[k];
      o.v.textContent = p[k] + o.unit;
      o.hint.textContent = p[k] + o.unit;
    });
  }

  /* ---------- 选中后的：对齐 / 网格排列 / 缩放 / 旋转 ---------- */
  var gCols = 'auto', gGap = 32;

  /* ---------- 圆阵工具（属性面板） ---------- */
  /* ---------- 雷达图编辑器（数据/颜色/字号全可改） ---------- */
  function radarTools(l) {
    var out = [];
    var c = l.radar || (l.radar = CV.radarDefault());
    var gb = el('div');

    c.axes.forEach(function (ax, i) {
      var row = el('div', 'field');
      row.style.display = 'flex';
      row.style.gap = '6px';
      row.style.alignItems = 'center';
      var li = document.createElement('input');
      li.type = 'text'; li.value = ax.label;
      li.style.flex = '1';
      li.addEventListener('input', function () { ax.label = li.value; App.radarLive && App.radarLive(l); });
      li.addEventListener('change', function () { App.commit(); });
      var vi = document.createElement('input');
      vi.type = 'number'; vi.step = '0.01'; vi.value = ax.value;
      vi.style.width = '78px';
      vi.addEventListener('input', function () { ax.value = parseFloat(vi.value) || 0; App.radarLive && App.radarLive(l); });
      vi.addEventListener('change', function () { App.commit(); });
      row.appendChild(li); row.appendChild(vi);
      gb.appendChild(row);
    });

    var fm = el('div', 'field');
    fm.style.marginTop = '10px';
    var l1 = el('label'); l1.appendChild(el('span', null, '最大值'));
    fm.appendChild(l1);
    var mi = document.createElement('input');
    mi.type = 'number'; mi.min = '1'; mi.value = c.max;
    mi.style.width = '100%';
    mi.addEventListener('input', function () { c.max = parseFloat(mi.value) || 100; App.radarLive && App.radarLive(l); });
    mi.addEventListener('change', function () { App.commit(); });
    fm.appendChild(mi);
    gb.appendChild(fm);

    var cr = el('div', 'chiprow');
    cr.style.marginTop = '10px';
    [['线色', 'color'], ['填充', 'fill'], ['文字', 'labelColor']].forEach(function (o) {
      var wrap = el('div');
      wrap.style.textAlign = 'center';
      var ci = document.createElement('input');
      ci.type = 'color'; ci.value = c[o[1]] || '#000000';
      ci.addEventListener('input', function () {
        c[o[1]] = ci.value;
        if (o[1] === 'labelColor') c.valueColor = ci.value;
        App.radarLive && App.radarLive(l);
      });
      ci.addEventListener('change', function () { App.commit(); });
      wrap.appendChild(ci);
      var cap = el('span', 'hint', o[0]);
      cap.style.display = 'block';
      wrap.appendChild(cap);
      cr.appendChild(wrap);
    });
    gb.appendChild(cr);

    [['标签字号', 'labelSize', 12, 80], ['数值字号', 'valueSize', 12, 80]].forEach(function (o) {
      var f = el('div', 'field');
      f.style.marginTop = '10px';
      var lb = el('label');
      lb.appendChild(el('span', null, o[0]));
      var hv = el('span', 'hint', c[o[1]] + 'px');
      lb.appendChild(hv);
      f.appendChild(lb);
      var wr = el('div', 'slider');
      var r = document.createElement('input');
      r.type = 'range'; r.min = o[2]; r.max = o[3]; r.step = 1; r.value = c[o[1]];
      r.addEventListener('input', function () { hv.textContent = r.value + 'px'; c[o[1]] = parseInt(r.value, 10); App.radarLive && App.radarLive(l); });
      r.addEventListener('change', function () { App.commit(); });
      wr.appendChild(r);
      f.appendChild(wr);
      gb.appendChild(f);
    });

    out.push(group('雷达图数据', gb));
    return out;
  }

  function clusterTools() {
    var out = [];
    var c = App.__cluster;
    var gb = el('div');
    var tipn = el('p', 'empty', c ? ('当前 ' + c.cols + ' × ' + c.rows + '，直径 ' + Math.round(c.d) + 'px') : '先选图标，点一个网格即可排布');
    tipn.style.padding = '0 0 8px';
    gb.appendChild(tipn);

    var gr = el('div', 'chiprow');
    App.CLUSTER_GRIDS.forEach(function (g) {
      var on = c && c.cols === g[0] && c.rows === g[1];
      var b = el('button', on ? 'on' : '', g[0] + '×' + g[1]);
      b.type = 'button';
      b.addEventListener('click', function () { App.circleCluster(g); });
      gr.appendChild(b);
    });
    var au = el('button', '', '自动');
    au.type = 'button';
    au.addEventListener('click', function () { App.circleCluster('auto'); });
    gr.appendChild(au);
    gb.appendChild(gr);

    [['圆间距', 0, 30, App.__ringOpts.gap, '%', function (v) { App.clusterGapLive(v); }, function () { App.__ringOpts.gap = +this.value; App.commit(); }],
     ['整体缩放', 40, 200, 100, '%', function (v) { App.clusterScale(v); }, function () { App.commit(); }],
     ['整体旋转', -180, 180, 0, '°', function (v) { App.clusterRotate(v); }, function () { App.commit(); }]
    ].forEach(function (o) {
      var f = el('div', 'field');
      f.style.marginTop = '10px';
      var lb = el('label');
      lb.appendChild(el('span', null, o[0]));
      var hv = el('span', 'hint', o[3] + o[4]);
      lb.appendChild(hv);
      f.appendChild(lb);
      var wr = el('div', 'slider');
      var r = document.createElement('input');
      r.type = 'range'; r.min = o[1]; r.max = o[2]; r.step = 1; r.value = o[3];
      r.addEventListener('input', function () { hv.textContent = r.value + o[4]; o[5](parseInt(r.value, 10)); });
      r.addEventListener('change', function () { hv.textContent = r.value + o[4]; (o[6] || function () { App.commit(); }).call(r); if (window.Panels) Panels.syncInspector(); });
      wr.appendChild(r);
      f.appendChild(wr);
      gb.appendChild(f);
    });

    var tl = el('div', 'toggleline');
    tl.appendChild(el('span', null, '按品牌色描边'));
    var sw = el('button', App.__ringOpts.brand ? 'switch on' : 'switch');
    sw.type = 'button';
    sw.addEventListener('click', function () {
      App.__ringOpts.brand = !App.__ringOpts.brand;
      sw.classList.toggle('on', App.__ringOpts.brand);
      if (App.__cluster) App.circleCluster([App.__cluster.cols, App.__cluster.rows]);
    });
    tl.appendChild(sw);
    gb.appendChild(tl);
    out.push(group('圆阵排列', gb));
    return out;
  }

  function selectionTools(l) {
    var out = [];

    var ag = el('div');
    var row1 = el('div', 'toolgrid');
    [['左对齐', 'l'], ['水平居中', 'hc'], ['右对齐', 'r'],
    ['顶对齐', 't'], ['垂直居中', 'vc'], ['底对齐', 'b']].forEach(function (o) {
      var b = el('button', null, o[0]); b.type = 'button';
      b.dataset.act = 'align:' + o[1];
      row1.appendChild(b);
    });
    ag.appendChild(row1);
    var row2 = el('div', 'toolgrid');
    row2.style.marginTop = '4px';
    [['横向分布', 'h'], ['纵向分布', 'v']].forEach(function (o) {
      var b = el('button', null, o[0]); b.type = 'button';
      b.dataset.act = 'dist:' + o[1];
      row2.appendChild(b);
    });
    var all = el('button', null, '全选元素'); all.type = 'button';
    all.dataset.act = 'selectAll';
    row2.appendChild(all);
    ag.appendChild(row2);
    out.push(group('对齐', ag));

    var gb = el('div');
    var n1 = el('div', 'note');
    n1.textContent = '把图标整齐排成网格，自动居中（选中的非图标图层会自动跳过）';
    n1.style.marginBottom = '8px';
    gb.appendChild(n1);
    var f1 = el('div', 'field');
    var lb1 = el('label'); lb1.appendChild(el('span', null, '列数'));
    f1.appendChild(lb1);
    var cr = el('div', 'chiprow');
    ['2', '3', '4', '5', '6', '自动'].forEach(function (n) {
      var val = n === '自动' ? 'auto' : n;
      var b = el('button', gCols === val ? 'on' : '', n);
      b.type = 'button';
      b.dataset.cols = val;
      b.dataset.act = 'gridcols:' + val;
      b.title = '点一下就重排';
      cr.appendChild(b);
    });
    f1.appendChild(cr);
    gb.appendChild(f1);
    var f2 = el('div', 'field');
    var lb2 = el('label');
    lb2.appendChild(el('span', null, '间距'));
    var hint2 = el('span', 'hint', gGap + 'px');
    lb2.appendChild(hint2);
    f2.appendChild(lb2);
    var wrap2 = el('div', 'slider');
    var r2 = document.createElement('input');
    r2.type = 'range'; r2.min = 0; r2.max = 120; r2.step = 1; r2.value = gGap;
    var v2 = el('span', 'val', gGap + 'px');
    r2.addEventListener('input', function () { gGap = parseInt(r2.value, 10); v2.textContent = gGap + 'px'; hint2.textContent = gGap + 'px'; App.gridLive(gCols, gGap); });
    r2.addEventListener('change', function () { App.gridArrange(gCols, gGap); });
    wrap2.appendChild(r2); wrap2.appendChild(v2);
    f2.appendChild(wrap2);
    gb.appendChild(f2);
    var tip = el('p', 'empty', '点列数立即重排（只作用于图标）');
    tip.style.padding = '4px 0 0';
    gb.appendChild(tip);
    out.push(group('网格排列', gb));

    var sb = el('div');
    var c5 = el('div', 'chiprow');
    [0.5, 0.75, 1.25, 1.5, 2].forEach(function (k) {
      var b = el('button', null, '×' + k); b.type = 'button';
      b.dataset.act = 'scale:' + k;
      c5.appendChild(b);
    });
    sb.appendChild(c5);
    var f3 = el('div', 'field');
    f3.style.marginTop = '8px';
    var lb3 = el('label');
    lb3.appendChild(el('span', null, '缩放到'));
    var h3 = el('span', 'hint', '100%');
    lb3.appendChild(h3);
    f3.appendChild(lb3);
    var wrap3 = el('div', 'slider');
    var r3 = document.createElement('input');
    r3.type = 'range'; r3.min = 20; r3.max = 200; r3.step = 1; r3.value = 100;
    var v3 = el('span', 'val', '100%');
    r3.addEventListener('pointerdown', function () { App.__scaleBase = null; });
    r3.addEventListener('input', function () {
      v3.textContent = r3.value + '%'; h3.textContent = r3.value + '%';
      App.scaleSelTo(parseInt(r3.value, 10));
    });
    r3.addEventListener('change', function () {
      App.commit(); App.__scaleBase = null;
      r3.value = 100; v3.textContent = '100%'; h3.textContent = '100%';
    });
    wrap3.appendChild(r3); wrap3.appendChild(v3);
    f3.appendChild(wrap3);
    sb.appendChild(f3);
    out.push(group('整体缩放', sb));

    var rb = el('div');
    var c6 = el('div', 'chiprow');
    [-90, -45, -15, 15, 45, 90].forEach(function (d) {
      var b = el('button', null, (d > 0 ? '+' : '') + d + '°'); b.type = 'button';
      b.dataset.act = 'rotadd:' + d;
      c6.appendChild(b);
    });
    rb.appendChild(c6);
    var f4 = el('div', 'field');
    f4.style.marginTop = '8px';
    var lb4 = el('label');
    lb4.appendChild(el('span', null, '旋转到'));
    var h4 = el('span', 'hint', Math.round(l.rot || 0) + '°');
    lb4.appendChild(h4);
    f4.appendChild(lb4);
    var wrap4 = el('div', 'slider');
    var r4 = document.createElement('input');
    r4.type = 'range'; r4.min = -180; r4.max = 180; r4.step = 1; r4.value = Math.round(l.rot || 0);
    var v4 = el('span', 'val', Math.round(l.rot || 0) + '°');
    r4.addEventListener('input', function () {
      v4.textContent = r4.value + '°'; h4.textContent = r4.value + '°';
      App.rotateLive(parseFloat(r4.value));       /* 只改 transform，跟手 */
    });
    r4.addEventListener('change', function () {
      App.commit();                                /* 松手才落盘 */
      if (window.Panels) Panels.syncInspector();
    });
    wrap4.appendChild(r4); wrap4.appendChild(v4);
    f4.appendChild(wrap4);
    rb.appendChild(f4);
    out.push(group('整体旋转', rb));
    return out;
  }

  /* 滑块填充色：把 --p 写成 0-100% */
  function syncRangeFill(r) {
    var mn = parseFloat(r.min || 0), mx = parseFloat(r.max || 100);
    var p = ((parseFloat(r.value || 0) - mn) / (mx - mn)) * 100;
    r.style.setProperty('--p', p.toFixed(1) + '%');
  }
  function bindRangeFills(root) {
    [].forEach.call((root || document).querySelectorAll('input[type=range]'), function (r) {
      if (!r.__fill) {
        r.__fill = true;
        r.addEventListener('input', function () { syncRangeFill(r); });
      }
      syncRangeFill(r);
    });
  }
  window.bindRangeFills = bindRangeFills;

  /* ---------- 属性面板：事件委托（重绘也不会丢 handler） ---------- */
  function mountPanelDelegation() {
    var pane = $('#paneProps');
    if (!pane || pane.__bound) return;
    pane.__bound = true;
    pane.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!b) return;
      var act = b.dataset.act;
      if (act === 'selectAll') { App.selectAll(); return; }
      if (act === 'gridcols:') { return; }
      if (act.indexOf('gridcols:') === 0) { gCols = act.slice(9); App.gridArrange(gCols, gGap); return; }
      if (act === 'grid') { App.gridArrange(gCols, gGap); return; }
      if (act.indexOf('align:') === 0) { App.align(act.slice(6)); return; }
      if (act.indexOf('dist:') === 0) { App.distribute(act.slice(5)); return; }
      if (act.indexOf('scale:') === 0) {
        var k = parseFloat(act.slice(6));
        App.__scaleBase = null; App.scaleSelTo(k * 100); App.__scaleBase = null; App.commit();
        return;
      }
      if (act.indexOf('rotadd:') === 0) { App.rotateAdd(parseFloat(act.slice(7))); return; }
    });
  }

  /* ---------- 检查器 ---------- */
  function syncInspector() {
    setTimeout(function () { bindRangeFills(document); }, 0);
    var p = $('#paneProps');
    if (!p) return;
    var l = App.selLayer();
    p.innerHTML = '';
    if (!l) {
      p.appendChild(group('画布', [
        el('p', 'empty', '点画布上的元素开始编辑；双击文字直接改。')
      ]));
      var mk = el('div', 'note');
      mk.innerHTML = '<b>快捷键</b>：方向键微调 · Shift+方向 10px · Ctrl+Z 撤销 · Ctrl+D 复制 · Ctrl+S 出图 · [ ] 调字号 · Esc 取消选择';
      p.appendChild(mk);
      /* 未选中时也保留对齐 / 网格排列：没有选择就作用于全部图层 */
      selectionTools({ rot: 0 }).forEach(function (g) { p.appendChild(g); });
      clusterTools().forEach(function (g) { p.appendChild(g); });
      if (l && l.type === 'radar') radarTools(l).forEach(function (g) { p.appendChild(g); });
      return;
    }
    var patch = function (o) {
      App.suppress = true;
      App.updateSel(o);
      App.suppress = false;
    };
    var live = function (o) {
      for (var k in o) l[k] = o[k];
      var e = App.map[l.id];
      if (e) CV.applyLayer(e, l, App.doc);
      App.suppress = true;
      App.apply();
      App.suppress = false;
    };

    if (l.type === 'text') {
      var ta = document.createElement('textarea');
      ta.className = 'input'; ta.rows = 3; ta.value = l.text;
      ta.addEventListener('input', function () { l.text = ta.value; var e = App.map[l.id]; if (e) e.innerHTML = CV.rich(ta.value); live({ text: ta.value }); });
      ta.addEventListener('change', function () { App.commit(); });
      var goEdit = el('button', 'btn sm', '在画布上编辑（Enter）');
      goEdit.style.marginBottom = '8px';
      goEdit.addEventListener('click', function () { App.editSel(); });
      p.appendChild(rowField('文本', ta, '\\n 换行 · [[高亮]]'));
      p.appendChild(goEdit);

      var ff = el('select', 'input');
      [['heavy', '黑体 Heavy'], ['bold', '黑体 Bold'], ['puhui', '阿里普惠'], ['bahn', 'Bahnschrift'], ['impact', 'Impact'], ['black', 'Arial Black']].forEach(function (o) {
        var op = document.createElement('option');
        op.value = o[0]; op.textContent = o[1];
        if (o[0] === l.font) op.selected = true;
        ff.appendChild(op);
      });
      ff.addEventListener('change', function () { patch({ font: ff.value }); });
      p.appendChild(rowField('字体', ff));

      p.appendChild(rowField('字号', slider(l.size, 8, 220, 1, function (v) { live({ size: v }); }, function (v) { return Math.round(v); }), Math.round(l.size) + 'px'));
      p.appendChild(rowField('字重', seg([{ v: 400, t: '常规' }, { v: 700, t: '粗' }, { v: 900, t: '特粗' }], l.weight, function (v) { patch({ weight: v }); })));
      p.appendChild(rowField('行高', slider(l.lh, 0.82, 2, 0.01, function (v) { live({ lh: v }); }, function (v) { return v.toFixed(2); })));
      p.appendChild(rowField('字距', slider(l.ls, -0.08, 0.3, 0.005, function (v) { live({ ls: v }); }, function (v) { return v.toFixed(3); })));
      p.appendChild(rowField('对齐', seg([{ v: 'left', t: '左' }, { v: 'center', t: '中' }, { v: 'right', t: '右' }], l.align, function (v) { patch({ align: v }); })));
      p.appendChild(rowField('颜色', colorRow(l.color, function (c) { patch({ color: c }); })));
      p.appendChild(rowField('描边', num(l.stroke || 0, function (v) { live({ stroke: v }); })));
      p.appendChild(rowField('描边色', colorRow(l.strokeColor || '#ffffff', function (c) { patch({ strokeColor: c }); })));
      var sh = el('select', 'input');
      [['', '无'], ['glow', '发光'], ['hard', '硬投影'], ['drop', '柔投影'], ['lift', '悬浮']].forEach(function (o) {
        var op = document.createElement('option');
        op.value = o[0]; op.textContent = o[1];
        if ((l.shadow || '') === o[0]) op.selected = true;
        sh.appendChild(op);
      });
      sh.addEventListener('change', function () { patch({ shadow: sh.value }); });
      p.appendChild(rowField('文字阴影', sh));
      p.appendChild(rowField('不透明度', slider(l.opacity == null ? 1 : l.opacity, 0.05, 1, 0.01, function (v) { live({ opacity: v }); }, function (v) { return Math.round(v * 100) + '%'; })));
      p.appendChild(rowField('旋转', slider(l.rot || 0, -30, 30, 0.5, function (v) { live({ rot: v }); }, function (v) { return v.toFixed(1) + '°'; })));
      p.appendChild(rowField('自适应字号', seg([{ v: true, t: '开' }, { v: false, t: '关' }], !!l.fit, function (v) { patch({ fit: v }); })));
    }

    if (l.type === 'icon') {
      var cur = CV.iconParts(l.icon);
      var pick = el('button', 'btn');
      pick.textContent = CV.iconLabel(l.icon) + ' · 换一个';
      pick.style.width = '100%'; pick.style.justifyContent = 'center';
      pick.addEventListener('click', function () { switchTab('icons'); });
      p.appendChild(rowField('图标', pick));
      var it = null;
      ICONS.forEach(function (x) { if (x.id === cur.id) it = x; });
      if (it) {
        var vsel = el('select', 'input');
        it.variants.forEach(function (v) {
          var op = document.createElement('option');
          op.value = v; op.textContent = v;
          if (v === cur.variant) op.selected = true;
          vsel.appendChild(op);
        });
        vsel.addEventListener('change', function () { patch({ icon: cur.id + '#' + vsel.value }); });
        p.appendChild(rowField('变体', vsel));
      }
      p.appendChild(rowField('宽度', slider(l.w, 24, 900, 1, function (v) { live({ w: v }); if (l.h) { l.h = Math.round(v); var e = App.map[l.id]; if (e) CV.applyLayer(e, l, App.doc); } }, function (v) { return Math.round(v); })));
      p.appendChild(rowField('不透明度', slider(l.opacity == null ? 1 : l.opacity, 0.05, 1, 0.01, function (v) { live({ opacity: v }); }, function (v) { return Math.round(v * 100) + '%'; })));
      p.appendChild(rowField('旋转', slider(l.rot || 0, -180, 180, 1, function (v) { live({ rot: v }); }, function (v) { return Math.round(v) + '°'; })));
      p.appendChild(rowField('圆角', slider(l.radius || 0, 0, 200, 1, function (v) { live({ radius: v }); }, function (v) { return Math.round(v); })));
      p.appendChild(rowField('单色', seg([{ v: 'none', t: '原色' }, { v: 'mono', t: '全黑' }, { v: 'invert', t: '反白' }], l.tint || 'none', function (v) { patch({ tint: v }); })));
    }

    if (l.type === 'image') {
      var chg = el('button', 'btn sm', '换一张图片');
      chg.addEventListener('click', function () { var ii2 = $('#imgInput'); if (ii2) ii2.click(); });
      var bg2 = el('button', 'btn sm', '设为背景图');
      bg2.addEventListener('click', function () { App.setAsBg(); });
      var rowi = el('div', 'row');
      rowi.appendChild(chg); rowi.appendChild(bg2);
      p.appendChild(group('图片', rowi));
      p.appendChild(rowField('裁切', seg([{ v: 'cover', t: '铺满' }, { v: 'contain', t: '完整' }], l.fit || 'cover', function (v) { patch({ fit: v }); })));
      p.appendChild(rowField('压暗', slider(l.dim || 0, 0, 0.85, 0.01, function (v) { live({ dim: v }); }, function (v) { return Math.round(v * 100) + '%'; })));
      p.appendChild(rowField('压暗色', colorRow(l.dimColor || '#0e1115', function (c) { patch({ dimColor: c }); })));
      p.appendChild(rowField('模糊', slider(l.blur || 0, 0, 30, 0.5, function (v) { live({ blur: v }); }, function (v) { return v.toFixed(0) + 'px'; })));
      p.appendChild(rowField('黑白', slider(l.gray || 0, 0, 1, 0.05, function (v) { live({ gray: v }); }, function (v) { return Math.round(v * 100) + '%'; })));
      p.appendChild(rowField('圆角', slider(l.radius || 0, 0, 200, 1, function (v) { live({ radius: v }); }, function (v) { return Math.round(v); })));
      p.appendChild(rowField('不透明度', slider(l.opacity == null ? 1 : l.opacity, 0.05, 1, 0.01, function (v) { live({ opacity: v }); }, function (v) { return Math.round(v * 100) + '%'; })));
      p.appendChild(rowField('旋转', slider(l.rot || 0, -180, 180, 1, function (v) { live({ rot: v }); }, function (v) { return Math.round(v) + '°'; })));
    }

    if (l.type === 'shape' || l.type === 'raw') {
      if (l.type === 'shape') {
        var ss = el('select', 'input');
        [['rect', '矩形'], ['round', '圆角矩形'], ['circle', '圆形'], ['ring', '圆环'], ['bar', '长条'], ['line', '细线'],
        ['tri', '三角形'], ['tri-d', '倒三角'], ['wedge', '楔形'], ['quarter', '四分之一圆'], ['star4', '四角星'],
        ['blob', '有机形'], ['half', '半圆']].forEach(function (o) {
          var op = document.createElement('option');
          op.value = o[0]; op.textContent = o[1];
          if (o[0] === l.shape) op.selected = true;
          ss.appendChild(op);
        });
        ss.addEventListener('change', function () { patch({ shape: ss.value }); });
        p.appendChild(rowField('形状', ss));
        p.appendChild(rowField('颜色', colorRow(l.color, function (c) { patch({ color: c }); })));
        p.appendChild(rowField('边框', num(l.bw || 0, function (v) { live({ bw: v }); })));
        p.appendChild(rowField('边框色', colorRow(l.bc || '#000000', function (c) { patch({ bc: c }); })));
        p.appendChild(rowField('圆角', slider(l.radius || 0, 0, 200, 1, function (v) { live({ radius: v }); }, function (v) { return Math.round(v); })));
      } else {
        p.appendChild(el('p', 'empty', '这是预设生成的图形层（可移动 / 缩放 / 删除）。'));
      }
      p.appendChild(rowField('不透明度', slider(l.opacity == null ? 1 : l.opacity, 0.02, 1, 0.01, function (v) { live({ opacity: v }); }, function (v) { return Math.round(v * 100) + '%'; })));
      p.appendChild(rowField('旋转', slider(l.rot || 0, -180, 180, 1, function (v) { live({ rot: v }); }, function (v) { return Math.round(v) + '°'; })));
    }

    /* 通用：位置尺寸 */
    var pos = el('div');
    var r1 = el('div', 'row');
    r1.appendChild(rowField('X', num(Math.round(l.x), function (v) { live({ x: v }); })));
    r1.appendChild(rowField('Y', num(Math.round(l.y), function (v) { live({ y: v }); })));
    pos.appendChild(r1);
    var r2 = el('div', 'row');
    r2.appendChild(rowField('宽', num(Math.round(l.w), function (v) { live({ w: v }); })));
    r2.appendChild(rowField('高', num(Math.round(l.h || 0), function (v) { if (l.type !== 'text') live({ h: v }); })));
    pos.appendChild(r2);
    p.appendChild(group('位置与尺寸', pos));
    selectionTools(l).forEach(function (g) { p.appendChild(g); });
      clusterTools().forEach(function (g) { p.appendChild(g); });
      if (l && l.type === 'radar') radarTools(l).forEach(function (g) { p.appendChild(g); });

    var ops = el('div', 'row');
    ops.style.flexWrap = 'wrap';
    [['置顶', function () { App.order('front'); }], ['上移', function () { App.order('up'); }],
    ['下移', function () { App.order('down'); }], ['置底', function () { App.order('back'); }],
    ['复制', function () { App.duplicate(); }], ['删除', function () { App.removeSel(); }]].forEach(function (o) {
      var b = el('button', 'btn sm', o[0]);
      b.type = 'button';
      if (o[0] === '删除') b.style.color = 'var(--destructive)';
      b.addEventListener('click', o[1]);
      ops.appendChild(b);
    });
    p.appendChild(group('操作', ops));
  }

  /* ---------- 图层列表 ---------- */
  function syncLayers() {
    var p = $('#paneLayers');
    if (!p) return;
    p.innerHTML = '';
    var bar = el('div', 'lyrbar');
    [['清空全部', 'all', '删除画布上所有图层（可撤销）'], ['清空图标', 'icon', '只删图标图层，保留文字与装饰']].forEach(function (o) {
      var b = el('button', 'btn sm', o[0]);
      b.type = 'button';
      b.title = o[2];
      b.addEventListener('click', function () { App.clearLayers(o[1]); });
      bar.appendChild(b);
    });
    p.appendChild(bar);

    var list = el('div', 'layerlist');
    App.doc.layers.slice().reverse().forEach(function (l) {
      var r = el('div', 'lrow' + (l.id === App.sel ? ' on' : '') + (l.hidden ? ' hid' : ''));
      var ty = el('span', 'ty', l.type === 'text' ? 'T' : l.type === 'icon' ? '◉' : l.type === 'shape' ? '◼' : '✦');
      var tx = el('span', 'tx', (l.role || l.type) + ' · ' + (l.type === 'text' ? CV.plain(l.text).replace(/\n/g, ' ').slice(0, 18) : l.type === 'icon' ? CV.iconLabel(l.icon) : (l.shape || 'graphic')));
      var lock = el('span', 'eye', l.locked ? '🔒' : '🔓');
      lock.style.cursor = 'pointer';
      lock.style.opacity = l.locked ? '1' : '.35';
      lock.title = l.locked ? '已锁定（画布上点不到）' : '未锁定（可点选、可拖动）';
      lock.addEventListener('click', function (e) {
        e.stopPropagation();
        l.locked = !l.locked;
        App.apply(); App.commit();
        App.toast(l.locked ? '已锁定：' + (l.role || l.type) : '已解锁：' + (l.role || l.type), 'ok');
      });
      var eye = el('span', 'eye', l.hidden ? '○' : '●');
      eye.style.cursor = 'pointer';
      eye.addEventListener('click', function (e) {
        e.stopPropagation();
        l.hidden = !l.hidden;
        App.apply(); App.commit();
      });
      r.appendChild(ty); r.appendChild(tx); r.appendChild(lock); r.appendChild(eye);
      r.dataset.id = l.id;
      r.addEventListener('click', function () {
        if (App.__skipRowClick) { App.__skipRowClick = false; return; }
        App.select(l.id);
      });
      /* 拖拽排序：面板自上而下 = 顶层 → 底层 */
      r.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        var startY = e.clientY, moved = false;
        function move(ev) {
          if (!moved && Math.abs(ev.clientY - startY) < 4) return;
          moved = true;
          r.classList.add('dragging');
          var rows = [].slice.call(list.querySelectorAll('.lrow'));
          rows.forEach(function (row) {
            if (row === r) return;
            var b = row.getBoundingClientRect();
            if (ev.clientY > b.top && ev.clientY < b.bottom) {
              if (ev.clientY < b.top + b.height / 2) list.insertBefore(r, row);
              else list.insertBefore(r, row.nextSibling);
            }
          });
        }
        function up() {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
          r.classList.remove('dragging');
          if (!moved) return;
          App.__skipRowClick = true;
          setTimeout(function () { App.__skipRowClick = false; }, 80);
          var ids = [].slice.call(list.querySelectorAll('.lrow')).map(function (row) { return row.dataset.id; });
          ids.reverse();                       /* 面板自上而下 = 顶层 → 底层 */
          var map = {};
          App.doc.layers.forEach(function (x) { map[x.id] = x; });
          App.doc.layers = ids.map(function (id) { return map[id]; }).filter(Boolean);
          App.apply(); App.commit();
          App.toast('图层顺序已更新', 'ok');
        }
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      });
      list.appendChild(r);
    });
    p.appendChild(group('图层 · ' + App.doc.layers.length, list));
    var note = el('div', 'note');
    note.innerHTML = '自上而下＝前后叠放顺序（最上面的最先绘制在底层）。';
    p.appendChild(note);
  }

  function syncStyles() {
    syncCanvas();
    $$('.style-card').forEach(function (b) { b.classList.toggle('on', b.dataset.style === App.doc.style); });
    renderLayouts();
  }
  function syncHist() {
    var u = $('#btnUndo'), r = $('#btnRedo');
    if (u) u.disabled = App.hi <= 0;
    if (r) r.disabled = App.hi >= App.hist.length - 1;
  }
  function showShot(url, info) {
    shotURL = url;
    var p = $('#paneShot');
    p.innerHTML = '';
    var card = el('div', 'group');
    var img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'width:100%;border-radius:12px;border:1px solid var(--border);display:block';
    card.appendChild(img);
    if (info) {
      var kv1 = el('div', 'kv'); kv1.innerHTML = '<span class="k">文件</span><span class="v">' + CV.esc(info.name) + '</span>';
      var kv2 = el('div', 'kv'); kv2.innerHTML = '<span class="k">尺寸</span><span class="v">' + CV.esc(info.size || '') + '</span>';
      card.appendChild(kv1); card.appendChild(kv2);
    }
    p.appendChild(card);
    switchTab('shot', true);
  }

  /* ---------- Tab ---------- */
  function switchTab(name, right) {
    var scope = right ? '.panel.right' : '.panel.left';
    $$(scope + ' .tab').forEach(function (t) { t.classList.toggle('on', t.dataset.tab === name); });
    $$(scope + ' .pane').forEach(function (p) { p.classList.toggle('on', p.id === 'pane' + name.charAt(0).toUpperCase() + name.slice(1)); });
    if (!right && name === 'icons') renderIcons($('#iconSearchInput') ? $('#iconSearchInput').value : '');
  }

  /* ---------- AI 生成 ---------- */
  var ICON_KW = [
    ['kimi|moonshot|月之暗面', '月之暗面/Kimi'],
    ['claude|anthropic|opus|sonnet', 'Anthropic/Claude'],
    ['chatgpt|openai|gpt|sora', 'OpenAI/OpenAI'],
    ['codex', 'OpenAI/Codex'],
    ['gemini|谷歌|google|deepmind', 'Google/Gemini'],
    ['deepseek|深度求索', 'DeepSeek/DeepSeek'],
    ['豆包|doubao', '字节跳动/豆包'],
    ['即梦|seedance', '字节跳动/Seedance'],
    ['glm|智谱|chatglm', '智谱 AI/智谱 AI'],
    ['minimax|海螺', 'MiniMax/MiniMax'],
    ['qwen|通义|千问', '阿里通义/Qwen'],
    ['grok', 'xAI/Grok'],
    ['cursor', 'xAI/Cursor'],
    ['文心|ernie|百度', '百度/文心一言'],
    ['混元|hunyuan|腾讯', '腾讯/腾讯混元'],
    ['星火|讯飞', '科大讯飞/讯飞星火'],
    ['midjourney', 'Midjourney/Midjourney'],
    ['flux', 'Black Forest/FLUX'],
    ['suno', 'Suno/Suno'],
    ['perplexity', 'Perplexity/Perplexity'],
    ['manus', 'Manus/Manus'],
    ['llama|meta', 'Meta/Meta Llama'],
    ['mistral', 'Mistral AI/Mistral AI'],
    ['copilot', 'Microsoft/GitHub Copilot'],
    ['windsurf', 'Cognition/Windsurf'],
    ['devin', 'Cognition/Devin']
  ];

  function autoIcon(text) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < ICON_KW.length; i++) {
      var re = new RegExp(ICON_KW[i][0]);
      if (re.test(t)) return ICON_KW[i][1] + '#symbol-color';
    }
    return 'OpenAI/OpenAI#symbol-color';
  }

  function vlen(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) n += /[\x00-\xff]/.test(s.charAt(i)) ? 0.56 : 1;
    return n;
  }
  function tokens(s) {
    return s.match(/[A-Za-z0-9][A-Za-z0-9.:%+\-\/]*|\s+|[\s\S]/g) || [];
  }
  function autoBreak(text, per) {
    per = per || 7;
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    var segs = clean.split(/[|｜，,。！!？?；;、]/).filter(function (s) { return s.trim(); });
    if (!segs.length) segs = [clean || 'AI 日报'];
    var lines = [], cur = '';
    var flush = function () { if (cur.trim()) lines.push(cur.trim()); cur = ''; };
    segs.forEach(function (seg) {
      tokens(seg.trim()).forEach(function (tk) {
        if (tk === ' ') { if (cur) cur += ' '; return; }
        if (cur && vlen(cur + tk) > per) { flush(); cur = tk; }
        else cur += tk;
      });
      flush();
    });
    if (!lines.length) lines = [clean || 'AI 日报'];
    return lines.slice(0, 3).join('\n');
  }

  function smartParse(raw, styleId, layoutId) {
    var t = String(raw || '').trim();
    if (!t) return null;
    var now = new Date();
    var ymd = now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0');
    return {
      style: styleId || App.doc.style,
      layout: layoutId || App.doc.layout,
      content: {
        title: autoBreak(t, 7),
        sub: t.length > 12 ? t.slice(0, 22) : '今日 AI 速览',
        kicker: ymd + ' · AI 日报',
        date: ymd,
        series: (App.doc.content && App.doc.content.series) || '白鸦 · AI 日报',
        foot: 'AI 前沿速览 · 每日 18:00 更新',
        badge: String(now.getDate()),
        icon: autoIcon(t)
      }
    };
  }

  function openAiModal() {
    var mask = $('#mask'), modal = $('#modal');
    var cur = 0;
    var styles = CV.STYLES.map(function (s) { return { v: s.id, t: s.name }; });
    modal.innerHTML = '';
    var head = frag('<div class="modal-h"><div><h3>AI 一键生成</h3><p>三种方式：离线智能解析 / 直连模型 / 粘贴 JSON</p></div><div class="spacer"></div><button class="btn icon" id="mClose">✕</button></div>');
    var body = el('div', 'modal-b');
    var foot = el('div', 'modal-f');

    var tabs = el('div', 'seg');
    ['智能解析', '模型直连', '粘贴 JSON'].forEach(function (n, i) {
      var b = el('button', i === 0 ? 'on' : null, n);
      b.type = 'button';
      b.addEventListener('click', function () {
        cur = i;
        $$('button', tabs).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        render();
      });
      tabs.appendChild(b);
    });
    var holder = el('div');
    holder.style.marginTop = '12px';
    body.appendChild(tabs);
    body.appendChild(holder);
    modal.appendChild(head); modal.appendChild(body); modal.appendChild(foot);
    mask.classList.add('on');
    head.querySelector('#mClose').addEventListener('click', function () { mask.classList.remove('on'); });
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.classList.remove('on'); });

    function applyPayload(p) {
      if (!p || !p.content) { App.toast('返回内容为空', 'err'); return; }
      App.recompose({ style: p.style || App.doc.style, layout: p.layout || App.doc.layout, content: p.content });
      mask.classList.remove('on');
      App.toast('已生成：' + (CV.styleById(p.style || App.doc.style).name), 'ok');
    }

    function render() {
      holder.innerHTML = '';
      foot.innerHTML = '';
      if (cur === 0) {
        var ta = document.createElement('textarea');
        ta.className = 'input'; ta.rows = 3;
        ta.placeholder = '把今天最想突出的一条丢进来，例：智谱 GLM5.3 灰度推送，Orion 3 万亿参数曝光';
        holder.appendChild(rowField('原始标题', ta));
        var st = el('select', 'input');
        styles.forEach(function (o) {
          var op = document.createElement('option'); op.value = o.v; op.textContent = o.t;
          if (o.v === App.doc.style) op.selected = true;
          st.appendChild(op);
        });
        holder.appendChild(rowField('风格', st));
        var lay = el('select', 'input');
        CV.LAYOUTS.forEach(function (o) {
          var op = document.createElement('option'); op.value = o.id; op.textContent = o.name;
          if (o.id === App.doc.layout) op.selected = true;
          lay.appendChild(op);
        });
        holder.appendChild(rowField('版式', lay));
        var b = el('button', 'btn primary', '生成封面');
        b.addEventListener('click', function () {
          var p = smartParse(ta.value, st.value, lay.value);
          if (!p) { App.toast('先输入一句标题', 'err'); return; }
          applyPayload(p);
        });
        foot.appendChild(b);
      }
      if (cur === 1) {
        var ta2 = document.createElement('textarea');
        ta2.className = 'input'; ta2.rows = 4;
        ta2.placeholder = '描述这一期：主题、要点、想强调的数字、希望的语气…';
        holder.appendChild(rowField('创作简报', ta2, '由 serve.mjs 代理调用模型'));
        var st2 = el('select', 'input');
        var op0 = document.createElement('option'); op0.value = ''; op0.textContent = '（让模型决定）';
        st2.appendChild(op0);
        styles.forEach(function (o) { var op = document.createElement('option'); op.value = o.v; op.textContent = o.t; st2.appendChild(op); });
        holder.appendChild(rowField('指定风格', st2));
        var out = el('div', 'aiout hidden');
        holder.appendChild(out);
        var b2 = el('button', 'btn primary', '调用模型');
        b2.addEventListener('click', function () {
          b2.disabled = true; b2.innerHTML = '<span class="spin"></span> 生成中…';
          out.classList.remove('hidden'); out.textContent = '请求中…';
          fetch('/api/ai', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brief: ta2.value, style: st2.value })
          }).then(function (r) { return r.json(); }).then(function (j) {
            b2.disabled = false; b2.textContent = '调用模型';
            if (j.ok) { out.textContent = JSON.stringify(j.data, null, 2); applyPayload(j.data); }
            else {
              out.textContent = j.error || '失败';
              var p2 = smartParse(ta2.value, st2.value || App.doc.style);
              if (p2) { out.textContent += '\n\n已回退到离线智能解析。'; applyPayload(p2); }
            }
          }).catch(function (e) {
            b2.disabled = false; b2.textContent = '调用模型';
            out.textContent = '网络错误：' + e.message;
          });
        });
        var copy = el('button', 'btn', '复制提示词');
        copy.addEventListener('click', function () {
          fetch('api/prompt').then(function (r) { return r.text(); }).then(function (t) {
            t = t.replace('{{BRIEF}}', ta2.value || '').replace('{{STYLE}}', st2.value || '');
            navigator.clipboard.writeText(t).then(function () { App.toast('提示词已复制，可粘贴到任意对话模型', 'ok'); });
          });
        });
        foot.appendChild(copy); foot.appendChild(b2);
      }
      if (cur === 2) {
        var ta3 = document.createElement('textarea');
        ta3.className = 'input'; ta3.rows = 8;
        ta3.placeholder = '{"style":"bauhaus","layout":"poster","content":{"title":"...","series":"..."}}';
        holder.appendChild(rowField('模型返回的 JSON', ta3));
        var b3 = el('button', 'btn primary', '应用');
        b3.addEventListener('click', function () {
          try {
            var j = JSON.parse(ta3.value);
            if (j.content) applyPayload(j);
            else if (j.layers) { App.setDoc(j); mask.classList.remove('on'); App.toast('已载入完整封面 JSON', 'ok'); }
            else applyPayload({ content: j });
          } catch (e) { App.toast('JSON 解析失败：' + e.message, 'err'); }
        });
        foot.appendChild(b3);
      }
    }
    render();
  }

  /* ---------- 初始化 ---------- */
  function init(app) {
    App = app;
    App.gdragging = false;

    $$('.panel.left .tab').forEach(function (t) {
      t.addEventListener('click', function () { switchTab(t.dataset.tab); });
    });
    $$('.panel.right .tab').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.panel.right .tab').forEach(function (x) { x.classList.remove('on'); });
        t.classList.add('on');
        $$('.panel.right .pane').forEach(function (p) { p.classList.toggle('on', p.id === 'pane' + t.dataset.tab.charAt(0).toUpperCase() + t.dataset.tab.slice(1)); });
      });
    });

    mountPanelDelegation();
    buildContentPane();
    buildStylePane();
    buildIconPane();
    if (!SPRITE) loadSprite();
    buildTextPane();
    buildCanvasPane();
    bindAuxSwitches();

    $('#btnUndo').addEventListener('click', function () { App.undo(); });
    $('#btnRedo').addEventListener('click', function () { App.redo(); });
    $('#btnPng').addEventListener('click', function () { App.exportPng(2); });
    $('#btnJson').addEventListener('click', function () { App.exportJson(); });
    var bh = $('#btnHtml');
    if (bh) bh.addEventListener('click', function () { App.exportHtml(); });
    $('#btnImport').addEventListener('click', function () { $('#fileInput').click(); });
    $('#fileInput').addEventListener('change', function (e) {
      if (e.target.files[0]) App.importJson(e.target.files[0]);
      e.target.value = '';
    });
    var rsel = $('#ratioSelect');
    if (rsel && window.CV && CV.RATIOS) {
      var fams = [];
      CV.RATIOS.forEach(function (r) { if (fams.indexOf(r.family) < 0) fams.push(r.family); });
      fams.forEach(function (fam) {
        var og = document.createElement('optgroup');
        og.label = fam;
        CV.RATIOS.filter(function (r) { return r.family === fam; }).forEach(function (r) {
          var op = document.createElement('option');
          op.value = r.id;
          op.textContent = r.name + '  ' + r.w + '×' + r.h;
          og.appendChild(op);
        });
        rsel.appendChild(og);
      });
      rsel.addEventListener('change', function () { App.setRatio(rsel.value); });
    }
    var bi = $('#btnImg'), ii = $('#imgInput');
    if (bi && ii) {
      bi.addEventListener('click', function () { ii.click(); });
      ii.addEventListener('change', function (e) {
        if (e.target.files[0]) App.pickImage(e.target.files[0], false);
        e.target.value = '';
      });
    }
    $('#btnAi').addEventListener('click', openAiModal);
    $('#btnFit').addEventListener('click', function () { App.fitZoom(); App.drawSel(); });
    var mk = document.querySelector('.brand-mark');
    if (mk) {
      mk.style.cursor = 'pointer';
      mk.addEventListener('click', cycleMark);
      var savedMark = null;
      try { savedMark = localStorage.getItem('cover-mark'); } catch (e) { }
      applyMark(savedMark || 'stack');
    }
    var th = $('#btnTheme');
    if (th) th.addEventListener('click', function () {
      var root = document.documentElement;
      var dark = root.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('cover-theme', next); } catch (e) { }
      App.toast(next === 'dark' ? '深色模式' : '浅色模式');
    });
    try {
      if (localStorage.getItem('cover-theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    } catch (e) { }
    $$('#scaleSeg button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#scaleSeg button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        App.exportPng(parseInt(b.dataset.scale, 10));
      });
    });

    fetch('assets/icons.json').then(function (r) { return r.json(); }).then(function (j) {
      ICONS = j.items || [];
      var byName = {};
      ICONS.forEach(function (it) {
        var m = { id: it.id, vendor: it.vendor, product: it.product, kw: it.kw, variants: it.variants.slice() };
        (byName[m.vendor] = byName[m.vendor] || []).push(m);
      });
      VENDORS = Object.keys(byName).map(function (name) {
        var models = byName[name];
        models.sort(function (a, b) {
          return b.variants.length - a.variants.length || a.product.localeCompare(b.product);
        });
        var best = models[0];
        var total = 0, kw = name;
        models.forEach(function (m) { total += m.variants.length; kw += ' ' + m.kw; });
        return {
          vendor: name, models: models, total: total, kw: kw.toLowerCase(),
          rep: { id: best.id, variant: repVariant(best.variants) }
        };
      }).sort(function (a, b) {
        var ra = hotRank(a.vendor), rb = hotRank(b.vendor);
        return ra - rb || a.vendor.localeCompare(b.vendor, 'zh');
      });
      V_BY_NAME = byName;
      renderIcons($('#iconSearchInput') ? $('#iconSearchInput').value : '');
    }).catch(function () { App.toast('图标索引加载失败', 'err'); });
  }

  function afterBoot() {
    var c = App.doc.content || CV.defaultContent();
    FIELDS.forEach(function (f) {
      var n = $('[data-k="' + f.k + '"]');
      if (n) n.value = c[f.k] == null ? '' : c[f.k];
    });
    var b = $('#btnPickIcon');
    if (b) b.textContent = '当前：' + CV.iconLabel(c.icon || '') + ' · 换一个';
    syncStyles(); syncHist();
    var sz = $('#sizeLabel');
    if (sz) sz.textContent = App.doc.w + ' × ' + App.doc.h;
    var rsel2 = $('#ratioSelect');
    if (rsel2 && App.doc.ratio) rsel2.value = App.doc.ratio;
  }

  /* 落位：先量出「1 个设计单位 = 多少屏幕像素」，再反算坐标与尺寸。
     完全不假设缩放方式，舞台怎么套 transform / zoom / 内容缩放都准。 */
  function dropAtCursor(ref, clientX, clientY, tileScreen) {
    var layer = CV.I('icon', ref, { x: 0, y: 0, w: 100, h: 100 });
    App.addLayer(layer, true);
    var el = App.map[layer.id];
    if (!el) return;
    function put(x, y, w) {
      layer.x = x; layer.y = y; layer.w = w; layer.h = w;
      CV.applyLayer(el, layer, App.doc);
      return el.getBoundingClientRect();
    }
    var a = put(0, 0, 100);        // doc(0,0) 的屏幕位置
    var b = put(200, 200, 100);    // 移动 200 设计单位后的屏幕位置
    var perX = (b.left - a.left) / 200;   // 屏幕像素 / 设计单位
    var perY = (b.top - a.top) / 200;
    if (!isFinite(perX) || !isFinite(perY) || perX === 0 || perY === 0) {
      App.apply(); App.commit();
      App.toast('落位失败：无法测量画布缩放', 'err');
      return;
    }
    var size = Math.max(16, Math.min(1200, Math.round(tileScreen / perX)));
    var nx = (clientX - a.left) / perX - size / 2;
    var ny = (clientY - a.top) / perY - size / 2;
    layer.x = Math.round(nx);
    layer.y = Math.round(ny);
    layer.w = size; layer.h = size;
    App.apply();
    /* 布局定稿后再量一次并静默校正（不再触发 apply，避免又一次重排/滚动） */
    try {
      var el2 = App.map[layer.id];
      if (el2) {
        var r2 = el2.getBoundingClientRect();
        var dx2 = clientX - (r2.left + r2.width / 2);
        var dy2 = clientY - (r2.top + r2.height / 2);
        if (Math.abs(dx2) > 0.6 || Math.abs(dy2) > 0.6) {
          layer.x = Math.round((layer.x + dx2 / perX) * 10) / 10;
          layer.y = Math.round((layer.y + dy2 / perY) * 10) / 10;
          CV.applyLayer(el2, layer, App.doc);
          if (App.drawSel) App.drawSel();
        }
      }
    } catch (e) { }
    App.commit();
    App.toast('落点 (' + layer.x + ',' + layer.y + ') · 尺寸 ' + size + '（屏幕 ' + Math.round(size * perX) + 'px）', 'ok');
    try {
      console.log('[drop] perDoc=' + perX.toFixed(4) + ' size=' + size +
        ' 屏幕尺寸=' + (size * perX).toFixed(1) + 'px 期望=' + Math.round(tileScreen) +
        ' layer=(' + layer.x + ',' + layer.y + ')');
    } catch (e) { }
  }

  /* ---------- 指针拖拽：不依赖 HTML5 drag，放在文件末尾避免被替换 ---------- */
  var ghostEl = null;
  /* 落点换算：只用「视觉盒子 / 设计尺寸」的比例，缩放怎么实现都不影响 */
  function docPoint(cx, cy) {
    var cv = (window.App && App.root) || document.querySelector('#cover .cv');
    if (!cv) return null;
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
    var dw = cv.offsetWidth || (window.App && App.doc && App.doc.w) || r.width;
    var dh = cv.offsetHeight || (window.App && App.doc && App.doc.h) || r.height;
    return {
      x: (cx - r.left) / r.width * dw,
      y: (cy - r.top) / r.height * dh,
      scale: r.width / dw
    };
  }
  function startIconDrag(ev, ref, fromPop) {
    if (ev.button !== 0) return;
    /* 阻止浏览器原生拖拽/选择，否则会走另一条旧公式，落点会偏 */
    if (ev.preventDefault) ev.preventDefault();
    var sx = ev.clientX, sy = ev.clientY, moved = false;
    var srcEl = ev.currentTarget;
    var tileScreen = 0;
    try {
      var tb = srcEl.getBoundingClientRect();
      tileScreen = Math.max(16, Math.min(tb.width, tb.height));
    } catch (e) { }
    if (!tileScreen) tileScreen = 40;
    function move(e) {
      if (!moved) {
        if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < 5) return;
        moved = true;
        document.body.classList.add('cv-dragging');
        ghostEl = el('div', 'icdrag');
        var im = document.createElement('img');
        im.src = CV.iconSrc(ref, App.doc.dark);
        ghostEl.appendChild(im);
        document.body.appendChild(ghostEl);
      }
      var gs = Math.max(24, Math.min(160, Math.round(tileScreen)));
      ghostEl.style.width = gs + 'px';
      ghostEl.style.height = gs + 'px';
      ghostEl.style.borderRadius = Math.round(gs * 0.17) + 'px';
      ghostEl.style.transform = 'translate(' + (e.clientX - gs / 2) + 'px,' + (e.clientY - gs / 2) + 'px)';
      var dp = docPoint(e.clientX, e.clientY);
      var drop = document.querySelector('.cv-drop');
      if (drop) drop.classList.toggle('on', !!dp);
    }
    function up(e) {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      document.body.classList.remove('cv-dragging');
      if (ghostEl) { ghostEl.remove(); ghostEl = null; }
      var drop = document.querySelector('.cv-drop');
      if (drop) drop.classList.remove('on');
      if (!moved) {
        if (!fromPop) { App.__skipClick = true; placeIcon(ref, 'main'); setTimeout(function () { App.__skipClick = false; }, 60); }
        return;
      }
      var dp = docPoint(e.clientX, e.clientY);
      if (!dp) return;
      App.__skipClick = true;
      dropAtCursor(ref, e.clientX, e.clientY, tileScreen);
      if (fromPop && typeof closePop === 'function') closePop();
      setTimeout(function () { App.__skipClick = false; }, 60);
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  /* ---------- 品牌标记：四款可切换 ---------- */
  var MARKS = [
    {
      id: 'stack', name: '封面叠层',
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="mkA" x1="6" y1="4" x2="30" y2="30" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="#5B93FF"/><stop offset=".55" stop-color="#1F6BFF"/><stop offset="1" stop-color="#0043AD"/>' +
        '</linearGradient></defs>' +
        '<rect x="2.6" y="2.6" width="17.4" height="17.4" rx="5" fill="#C7D8FF" opacity=".72"/>' +
        '<rect x="10.2" y="10.2" width="18.8" height="18.8" rx="5.6" fill="url(#mkA)"/>' +
        '<rect x="13.6" y="14.6" width="9.6" height="2.3" rx="1.15" fill="#fff" opacity=".96"/>' +
        '<rect x="13.6" y="18.6" width="5.4" height="2.3" rx="1.15" fill="#fff" opacity=".62"/>' +
        '<path d="M24.55 20.4l.86 2.44 2.44.86-2.44.86-.86 2.44-.86-2.44-2.44-.86 2.44-.86.86-2.44z" fill="#fff" opacity=".95"/>' +
        '</svg>'
    },
    {
      id: 'construct', name: '构成主义',
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="mkB" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="#4A86FF"/><stop offset="1" stop-color="#00307F"/></linearGradient>' +
        '<clipPath id="mkBc"><rect x="3" y="3" width="26" height="26" rx="7"/></clipPath></defs>' +
        '<rect x="3" y="3" width="26" height="26" rx="7" fill="url(#mkB)"/>' +
        '<g clip-path="url(#mkBc)">' +
        '<path d="M0 22.6 L32 8.2 L32 15.4 L0 29.8 Z" fill="#fff" opacity=".93"/>' +
        '<path d="M0 16.6 L32 2.2 L32 5.4 L0 19.8 Z" fill="#fff" opacity=".38"/>' +
        '</g>' +
        '<circle cx="9.6" cy="9.2" r="3.5" fill="#fff" opacity=".92"/>' +
        '</svg>'
    },
    {
      id: 'bauhaus', name: '包豪斯',
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="mkC" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="#4F8CFF"/><stop offset="1" stop-color="#002E7A"/></linearGradient></defs>' +
        '<rect x="2" y="2" width="28" height="28" rx="8" fill="url(#mkC)"/>' +
        '<circle cx="11" cy="10.6" r="4.1" fill="#fff"/>' +
        '<rect x="17.6" y="15.4" width="8.2" height="8.2" rx="1" fill="#BFD4FF" transform="rotate(12 21.7 19.5)"/>' +
        '<path d="M9 20.6l4.7 7.6H4.3z" fill="#fff" opacity=".86"/>' +
        '</svg>'
    },
    {
      id: 'swiss', name: '瑞士极简',
      svg: '<svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="mkD" x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="#3C7BFF"/><stop offset="1" stop-color="#002F80"/></linearGradient></defs>' +
        '<rect x="3" y="3" width="26" height="26" rx="4.5" fill="url(#mkD)"/>' +
        '<rect x="8" y="8.6" width="16" height="3.2" rx="1.6" fill="#fff" opacity=".96"/>' +
        '<rect x="8" y="14.9" width="10.6" height="3.2" rx="1.6" fill="#fff" opacity=".56"/>' +
        '<rect x="8" y="21.2" width="16" height="1.6" rx=".8" fill="#fff" opacity=".32"/>' +
        '</svg>'
    }
  ];
  function applyMark(id) {
    var box = document.querySelector('.brand-mark');
    if (!box) return;
    var m = MARKS[0];
    for (var i = 0; i < MARKS.length; i++) if (MARKS[i].id === id) m = MARKS[i];
    box.innerHTML = m.svg;
    box.title = '品牌标记：' + m.name + '（点击切换）';
    box.dataset.mark = m.id;
    try { localStorage.setItem('cover-mark', m.id); } catch (e) { }
  }
  function cycleMark() {
    var cur = null;
    try { cur = localStorage.getItem('cover-mark'); } catch (e) { }
    var idx = 0;
    for (var i = 0; i < MARKS.length; i++) if (MARKS[i].id === cur) idx = i;
    var next = MARKS[(idx + 1) % MARKS.length];
    applyMark(next.id);
    App.toast('品牌标记：' + next.name + '（' + (idx + 2) + '/4）');
  }

  window.Panels = {
    init: init, afterBoot: afterBoot,
    syncInspector: syncInspector, syncLayers: syncLayers, syncStyles: syncStyles,
    syncHist: syncHist, showShot: showShot, syncCanvas: syncCanvas, commit: function () { if (App) App.commit(); },
    smartParse: smartParse
  };
})();


/* ==== studio.js ==== */
/* studio core part 1 */
(function () {
  var CV = window.CV;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var App = { doc: null, sel: null, zoom: 1, hist: [], hi: -1, editing: false, map: {}, locked: false };
  window.App = App;

  /* 命中兜底：没点到图层时按 7px 容差找最近的（细长条 / 1px 线专用） */
  function hitFallback(cx, cy) {
    var pad = 7, best = null;
    for (var i = App.doc.layers.length - 1; i >= 0; i--) {
      var l = App.doc.layers[i];
      if (l.hidden || l.locked) continue;
      var el = App.map[l.id];
      if (!el) continue;
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      if (cx >= r.left - pad && cx <= r.right + pad && cy >= r.top - pad && cy <= r.bottom + pad) {
        best = { l: l, el: el };
        break;
      }
    }
    return best;
  }
  App.hitFallback = hitFallback;

  /* 命中栈：从顶到底列出盖住该点的图层；细线（屏幕宽或高 <=6px）额外给 5px 容差 */
  function layersAt(cx, cy) {
    var out = [];
    App.doc.layers.forEach(function (l) {
      if (l.hidden || l.locked) return;
      var el = App.map[l.id];
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var thin = (r.width <= 6 || r.height <= 6);
      var pad = thin ? 5 : 0;
      if (cx >= r.left - pad && cx <= r.right + pad && cy >= r.top - pad && cy <= r.bottom + pad) {
        out.push({ l: l, el: el, thin: thin });
      }
    });
    return out.reverse();   /* 顶层在前 */
  }
  /* 取点上的图层：细线优先；deep=true 时从当前选中往下轮一个（Figma 的 Ctrl 深选） */
  function pickAt(cx, cy, deep) {
    var stack = layersAt(cx, cy);
    if (!stack.length) return null;
    if (deep) {
      var idx = -1;
      stack.forEach(function (h, i) { if (h.l.id === App.sel) idx = i; });
      return stack[(idx + 1) % stack.length];
    }
    var t = null;
    stack.forEach(function (h) { if (!t && h.thin) t = h; });
    return t || stack[0];
  }
  App.pickAt = pickAt;

  App.getLayer = function (id) {
    var L = App.doc.layers;
    for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i];
    return null;
  };
  /* 拖拽状态清理：pointerup 丢失 / 切窗口 / 失焦时兜底，避免永远「拖不动」 */
  function clearDragState() {
    document.body.classList.remove('cv-dragging');
    document.body.classList.remove('marquee-drag');
    document.body.classList.remove('alt-down');
    var mv = document.querySelector('.marquee');
    if (mv) mv.remove();
    var gh = document.querySelector('.icdrag');
    if (gh) gh.remove();
  }
  App.clearDragState = clearDragState;
  window.addEventListener('blur', clearDragState);
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearDragState(); });
  document.addEventListener('pointercancel', clearDragState);
  /* 任何新的按下都先清一次历史状态 */
  document.addEventListener('pointerdown', function () { 
    document.body.classList.remove('marquee-drag');
  }, true);

  /* 真实缩放：量渲染宽 / CSS 宽反推，transform / zoom / 改宽度都准 */
  function stageScale() {
    var cv = App.root || document.querySelector('#cover .cv');
    if (!cv) return App.zoom || 1;
    var w = cv.getBoundingClientRect().width;
    var dw = cv.offsetWidth || (App.doc && App.doc.w) || w;
    return (w > 0 && dw > 0) ? w / dw : (App.zoom || 1);
  }
  App.stageScale = stageScale;

  /* 屏幕像素 → 设计单位：用图层自身渲染宽反推，内容被缩放也不会偏 */
  function screenToDoc(el, l) {
    try {
      var s0 = stageScale();                 /* 屏幕 px / 文档 px */
      var ow = el.offsetWidth, oh = el.offsetHeight;   /* 布局尺寸，不受 rotate/scale 影响 */
      if (s0 > 0 && ow > 2 && l.w > 2) return l.w / (ow * s0);   /* 母版单位 / 屏幕 px */
      if (s0 > 0 && oh > 2 && (l.h || 0) > 2) return l.h / (oh * s0);
    } catch (e) { }
    var s = stageScale();
    return s > 0 ? 1 / s : 1;
  }
  App.screenToDoc = screenToDoc;

  App.selLayer = function () { return App.sel ? App.getLayer(App.sel) : null; };

  App.pushHist = function () {
    var snap = JSON.stringify(App.doc);
    if (App.hist[App.hi] === snap) return;
    App.hist = App.hist.slice(0, App.hi + 1);
    App.hist.push(snap);
    if (App.hist.length > 80) App.hist.shift();
    App.hi = App.hist.length - 1;
    saveLocal();
    if (window.Panels) Panels.syncHist();
  };
  App.undo = function () {
    if (!App.hist || App.hist.length < 2) { App.toast('没有可撤销的步骤'); return false; }
    if (App.hi <= 0) return;
    App.hi--; App.doc = JSON.parse(App.hist[App.hi]); App.sel = null; App.apply(); saveLocal();
    if (window.Panels) Panels.syncHist();
    App.toast('已撤销');
  };
  App.redo = function () {
    if (!App.future || !App.future.length) { App.toast('没有可重做的步骤'); return false; }
    if (App.hi >= App.hist.length - 1) return;
    App.hi++; App.doc = JSON.parse(App.hist[App.hi]); App.sel = null; App.apply(); saveLocal();
    if (window.Panels) Panels.syncHist();
    App.toast('已重做');
  };

  function saveLocal() {
    try { localStorage.setItem('cover-studio-doc', JSON.stringify(App.doc)); } catch (e) { }
  }
  App.loadLocal = function () {
    try { var s = localStorage.getItem('cover-studio-doc'); return s ? JSON.parse(s) : null; }
    catch (e) { return null; }
  };

  App.setDoc = function (doc, keepSel) {
    App.doc = doc;
    if (!keepSel) App.sel = null;
    App.pushHist();
    App.apply();
  };
  App.content = function () {
    var c = JSON.parse(JSON.stringify(App.doc.content || CV.defaultContent()));
    ['series', 'kicker', 'date', 'title', 'sub', 'foot'].forEach(function (role) {
      var l = null;
      App.doc.layers.forEach(function (x) { if (x.role === role && !l) l = x; });
      if (l) c[role] = l.text;
    });
    var ic = null;
    App.doc.layers.forEach(function (x) { if (x.type === 'icon' && x.role === 'icon' && !ic) ic = x; });
    if (ic) c.icon = ic.icon;
    return c;
  };
  App.setRatio = function (id) {
    var RT = CV.ratioOf(id);
    var wasP = App.doc.h > App.doc.w;
    var nowP = RT.h > RT.w;
    if (wasP !== nowP) {
      var next = CV.ALT[App.doc.layout] || (nowP ? 'stack' : 'hero');
      App.recompose({ ratio: RT.id, layout: next });
    } else {
      App.doc.w = RT.w;
      App.doc.h = RT.h;
      App.doc.ratio = RT.id;
      App.apply();
      App.commit();
      saveLocal();
    }
    App.toast('画幅：' + RT.name + ' · ' + RT.w + '×' + RT.h, 'ok');
  };
  App.recompose = function (opts) {
    opts = opts || {};
    var content = opts.content || App.content();
    var keep = App.doc.layers.filter(function (l) { return l.type === 'image' && l.role === 'bg'; });
    var doc = CV.compose(opts.style || App.doc.style, opts.layout || App.doc.layout, content, opts.ratio || App.doc.ratio);
    if (keep.length) doc.layers = keep.concat(doc.layers);
    doc.id = App.doc.id;
    doc.brand = App.doc.brand;   /* 保留采样到的品牌色 */
    App.doc = doc; App.sel = null;
    App.pushHist(); App.apply(); saveLocal();
  };

  /* 纸纹实时预览：拖滑块时只改 fx 的内联样式，零重绘 */
  /* 背景：纯色 / 渐变（实时预览，松手才进撤销栈） */
  App.setBgPattern = function (id) {
    if (!id) delete App.doc.bgPattern; else App.doc.bgPattern = id;
    App.apply(); App.commit();
  };

  App.setBg = function (css, commit) {
    App.doc.bg = css;
    if (App.root) App.root.style.background = css;
    if (commit) App.commit();
  };
  App.gradientCss = function (a, b, angle) {
    return 'linear-gradient(' + angle + 'deg,' + a + ' 0%,' + b + ' 100%)';
  };
  App.setBgImage = function (obj) {
    if (obj === null) delete App.doc.bgImage;
    else App.doc.bgImage = Object.assign({ fit: 'cover', blur: 0, dim: 0, x: 0, y: 0, w: 100, h: 100, opacity: 100, fade: { dir: 'none', strength: 45 } }, App.doc.bgImage || {}, obj);
    App.apply();
    App.commit();
  };
  /* 上传图片 -> 压缩到 1920 宽以内，存 dataURL */
  App.readImageFile = function (file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var maxW = 1920, sc = Math.min(1, maxW / img.naturalWidth);
        var c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * sc);
        c.height = Math.round(img.naturalHeight * sc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        try { cb(c.toDataURL('image/jpeg', 0.86)); } catch (e) { cb(fr.result); }
      };
      img.onerror = function () { cb(fr.result); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };

  App.paperLive = function () {
    var root = App.root;
    if (!root) return;
    var p = App.doc.paper || {};
    var on = p.on === true;
    var hasPaper = !!root.querySelector('.cv-fx.paper');
    if (on !== hasPaper) { App.apply(); return; }      /* 开关状态变化才需要重建 */
    var po = (p.opacity == null ? 80 : p.opacity) / 100;
    var pn = (p.noise == null ? 60 : p.noise) / 100;
    var ps = p.scale == null ? 260 : p.scale;
    var e1 = root.querySelector('.cv-fx.paper');
    if (e1) { e1.style.opacity = (po * 0.55).toFixed(3); e1.style.backgroundSize = ps + 'px ' + ps + 'px'; }
    var e2 = root.querySelector('.cv-fx.wrinkle');
    if (e2) { e2.style.opacity = (po * 0.34).toFixed(3); e2.style.backgroundSize = (ps * 1.9) + 'px ' + (ps * 1.9) + 'px'; }
    var e3 = root.querySelector('.cv-fx.grain');
    if (e3) { e3.style.opacity = (pn * 0.5).toFixed(3); e3.style.backgroundSize = Math.max(32, Math.round(ps * 0.5)) + 'px ' + Math.max(32, Math.round(ps * 0.5)) + 'px'; }
  };

  /* 网格间距实时预览：直接挪 DOM，不整屏重绘 */
  App.gridLive = function (cols, gap) {
    var pk = App.iconSet();
    var set = pk.list;
    if (!set.length) { App.gridArrange(cols, gap); return; }
    App.gridPlace(set, cols, gap);
    set.forEach(function (l) {
      var el = App.map[l.id];
      if (el) { el.style.left = l.x + 'px'; el.style.top = l.y + 'px'; }
    });
    if (App.drawSel) App.drawSel();
  };

  App.apply = function () {
    if (App.editing) return;
    var host = $('#cover');
    var out = CV.render(App.doc, host, { edit: true });
    [].forEach.call(out.root.querySelectorAll('.cv-text[contenteditable]'), function (e) { e.removeAttribute('contenteditable'); });
    App.map = out.map;
    App.root = out.root;
    bindStage(out.root);
    App.fitZoom();
    drawSel();
    if (App.syncBrand) requestAnimationFrame(function () { App.syncBrand(); });
    (function () {
      var bs = document.getElementById('brandSub');
      if (bs && CV.STYLES) bs.textContent = 'COVER STUDIO · ' + CV.STYLES.length + ' STYLES';
    })();
    if (window.Panels) {
      if (!App.suppress) Panels.syncInspector();
      Panels.syncLayers();
      Panels.syncStyles();
    }
  };
  /* 从主视觉图标取品牌色，套到背景与标题上（只改颜色，不动版式） */
  App.__brandFor = null;
  App.syncBrand = function () {
    var doc = App.doc;
    if (doc.style !== 'xiaoxinya') return;
    var ic = null;
    doc.layers.forEach(function (l) { if (!ic && l.type === 'icon' && l.role === 'icon') ic = l; });
    if (!ic) return;
    var key = ic.icon;
    if (App.__brandFor === key) return;
    var el = App.map[ic.id];
    if (!el || !el.complete || !el.naturalWidth) {
      App.__brandTry = (App.__brandTry || 0) + 1;
      if (App.__brandTry < 12) setTimeout(function () { App.syncBrand(); }, 160);
      return;
    }
    App.__brandTry = 0;
    var c = CV.brandColorOf(el);
    if (!c) {
      App.__brandTry = (App.__brandTry || 0) + 1;
      if (App.__brandTry < 12) setTimeout(function () { App.syncBrand(); }, 160);
      return;
    }
    App.__brandFor = key;
    doc.brand = c;
    doc.bg = 'linear-gradient(135deg,' + CV.tint(c, 0.92) + ' 0%,' + CV.tint(c, 0.875) + ' 55%,' + CV.tint(c, 0.82) + ' 100%)';
    if (App.root) App.root.style.background = doc.bg;
    doc.layers.forEach(function (l) {
      if (l.role === 'title') l.color = c;
      else if (l.role === 'pill') l.color = c;
      else if (l.role === 'kicker') l.color = CV.tint(c, 0.18);
      else return;
      var e2 = App.map[l.id];
      if (e2) { if (l.type === 'shape') e2.style.background = l.color; else e2.style.color = l.color; }
    });
    App.commit();
  };

  App.schedule = (function () {
    var q = false;
    return function () {
      if (q) return;
      q = true;
      requestAnimationFrame(function () { q = false; App.apply(); });
    };
  })();

  App.fitZoom = function () {
    var wrap = $('#stageScroll'), box = $('#stageBox');
    var aw = wrap.clientWidth - 60, ah = wrap.clientHeight - 60;
    var z = Math.min(aw / App.doc.w, ah / App.doc.h, 1);
    z = Math.max(0.12, Math.round(z * 1000) / 1000);
    App.zoom = z;
    box.style.width = Math.round(App.doc.w * z) + 'px';
    box.style.height = Math.round(App.doc.h * z) + 'px';
    var cover = $('#cover'), selL = $('#selLayer');
    [cover, selL].forEach(function (el) {
      el.style.transformOrigin = 'top left';
      el.style.transform = 'scale(' + z + ')';
      el.style.width = App.doc.w + 'px';
      el.style.height = App.doc.h + 'px';
    });
    selL.style.position = 'absolute';
    selL.style.left = '0';
    selL.style.top = '0';
    var zp = $('#zoomLabel');
    if (zp) zp.textContent = Math.round(z * 100) + '%';
  };

  App.multi = [];
  App.selSet = function () {
    var ids = App.multi.length ? App.multi : (App.sel ? [App.sel] : []);
    var out = [];
    ids.forEach(function (id) { var l = App.getLayer(id); if (l) out.push(l); });
    return out;
  };
  App.select = function (id, additive) {
    if (!id) { App.sel = null; App.multi = []; }
    else if (additive) {
      var i = App.multi.indexOf(id);
      if (i > -1) App.multi.splice(i, 1);
      else App.multi.push(id);
      if (!App.multi.length) App.multi = [id];
      App.sel = App.multi[App.multi.length - 1];
    } else {
      App.multi = [id];
      App.sel = id;
    }
    drawSel();
    if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
  };
  App.deselect = function () { App.select(null); };
  App.selectMany = function (ids) {
    App.multi = (ids || []).slice();
    App.sel = App.multi.length ? App.multi[App.multi.length - 1] : null;
    drawSel();
    if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
    if (App.multi.length) App.toast('已框选 ' + App.multi.length + ' 个图层', 'ok');
  };
  App.selectAll = function () {
    App.multi = App.doc.layers.filter(function (l) { return !l.hidden; }).map(function (l) { return l.id; });
    App.sel = App.multi[App.multi.length - 1] || null;
    drawSel();
    if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
  };

  /* 参考线常显：中线 / 三分线 / 安全区（只画在编辑器覆盖层，不进出图） */
  function drawGuides() {
    var host = $('#selLayer');
    if (!host) return;
    [].forEach.call(host.querySelectorAll('.guide-line'), function (n) { n.remove(); });
    var g = App.doc.guides || {};
    if (g.on === false) return;
    var W = App.doc.w, H = App.doc.h, S = 64;
    var vs = [W / 2, W / 3, (W * 2) / 3, S, W - S];
    var hs = [H / 2, H / 3, (H * 2) / 3, S, H - S];
    vs.forEach(function (x, i) {
      var d = document.createElement('div');
      d.className = 'guide-line' + (i === 0 ? ' strong' : '');
      d.style.cssText = 'position:absolute;left:' + x + 'px;top:0;width:1px;height:' + H + 'px;pointer-events:none;' +
        'background:' + (i === 0 ? 'rgba(255,45,135,.55)' : 'rgba(0,101,253,.28)');
      host.appendChild(d);
    });
    hs.forEach(function (y, i) {
      var d = document.createElement('div');
      d.className = 'guide-line' + (i === 0 ? ' strong' : '');
      d.style.cssText = 'position:absolute;top:' + y + 'px;left:0;height:1px;width:' + W + 'px;pointer-events:none;' +
        'background:' + (i === 0 ? 'rgba(255,45,135,.55)' : 'rgba(0,101,253,.28)');
      host.appendChild(d);
    });
  }
  App.drawGuides = drawGuides;

  /* 选中圆阵成员时，返回整组包围盒（让外框包住整组并跟手） */
  function clusterSelBounds() {
    var c = App.__cluster;
    if (!c || !c.base) return null;
    var sel = App.multi && App.multi.length ? App.multi : (App.sel ? [App.sel] : []);
    if (!sel.length) return null;
    var ids = c.base.map(function (b) { return b.id; });
    var hit = sel.some(function (id) { return ids.indexOf(id) > -1; });
    if (!hit) return null;
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    ids.forEach(function (id) {
      var l = App.getLayer(id); if (!l) return;
      x0 = Math.min(x0, l.x); y0 = Math.min(y0, l.y);
      x1 = Math.max(x1, l.x + (l.w || 0)); y1 = Math.max(y1, l.y + (l.h || l.w || 0));
    });
    if (!isFinite(x0)) return null;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, n: ids.length };
  }

  function drawSel() {
    var host = $('#selLayer');
    if (!host) return;
    host.innerHTML = '';
    var cb = clusterSelBounds();
    if (cb) {
      var b = $('#selBox') || document.createElement('div');
      b.id = 'selBox';
      b.className = 'sel';
      b.style.cssText = 'position:absolute;left:' + cb.x + 'px;top:' + cb.y + 'px;width:' + cb.w + 'px;height:' + cb.h + 'px;pointer-events:none';
      host.appendChild(b);
      showSelInfo({ length: cb.n, x: cb.x, y: cb.y, w: cb.w, h: cb.h }, 'cluster');
      return;
    }
    var set = App.selSet();
    showSelInfo(set);
    if (!set.length) return;
    if (set.length > 6) {
      var b = { x: 1e9, y: 1e9, x2: -1e9, y2: -1e9 };
      set.forEach(function (l) {
        var e2 = App.map[l.id]; if (!e2) return;
        var h = l.type === 'text' ? e2.offsetHeight : (l.h || e2.offsetHeight);
        b.x = Math.min(b.x, l.x); b.y = Math.min(b.y, l.y);
        b.x2 = Math.max(b.x2, l.x + l.w); b.y2 = Math.max(b.y2, l.y + h);
      });
      var box = document.createElement('div');
      box.className = 'sel secondary';
      box.style.left = b.x + 'px'; box.style.top = b.y + 'px';
      box.style.width = (b.x2 - b.x) + 'px'; box.style.height = (b.y2 - b.y) + 'px';
      var tg = document.createElement('div');
      tg.className = 'tag';
      tg.textContent = set.length + ' 个图层 · Esc 取消';
      box.appendChild(tg);
      host.appendChild(box);
      return;
    }
    set.forEach(function (l) {
      var el2 = App.map[l.id];
      if (!el2) return;
      var box = document.createElement('div');
      box.className = 'sel' + (l.id === App.sel ? '' : ' secondary');
      box.style.left = el2.offsetLeft + 'px';
      box.style.top = el2.offsetTop + 'px';
      box.style.width = el2.offsetWidth + 'px';
      box.style.height = el2.offsetHeight + 'px';
      if (l.rot) box.style.transform = 'rotate(' + l.rot + 'deg)';
      if (l.id === App.sel) {
        var tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = (set.length > 1 ? set.length + ' 个 · ' : '') + (l.role || l.type) + ' · ' +
          Math.round(l.w) + ' × ' + Math.round(el2.offsetHeight);
        box.appendChild(tag);
        ['nw', 'ne', 'sw', 'se'].forEach(function (k) {
          if (l.type === 'text' && (k === 'nw' || k === 'sw')) return;
          var hd = document.createElement('div');
          hd.className = 'h';
          hd.dataset.h = k;
          hd.addEventListener('pointerdown', function (e) { startResize(e, k); });
          box.appendChild(hd);
        });
      }
      host.appendChild(box);
    });
  }
  App.drawSel = drawSel;

  var selInfoEl = null;
  function showSelInfo(set) {
    if (!selInfoEl) {
      selInfoEl = document.createElement('div');
      selInfoEl.id = 'selInfo';
      selInfoEl.className = 'selinfo';
      document.body.appendChild(selInfoEl);
    }
    if (!set || set.length < 2) { selInfoEl.classList.remove('on'); return; }
    var l = App.selLayer();
    selInfoEl.innerHTML = '<b>已选 ' + set.length + ' 个图层</b>' +
      '<span>主选：' + CV.esc((l && (l.role || l.type)) || '-') + '</span>' +
      '<button type="button">取消选择 (Esc)</button>';
    selInfoEl.querySelector('button').addEventListener('click', function () { App.deselect(); });
    selInfoEl.classList.add('on');
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Alt') document.body.classList.add('alt-down'); });
  document.addEventListener('keyup', function (e) { if (e.key === 'Alt') document.body.classList.remove('alt-down'); });
  window.addEventListener('blur', function () { document.body.classList.remove('alt-down'); });
  /* ---------------- 画布交互 ---------------- */
  function bindStage(root) {
    if (root._bound) return;
    root._bound = true;
    /* 中键：任意位置起框选，顺便压掉浏览器自动滚动 */
    root.addEventListener('mousedown', function (e) { if (e.button === 1) e.preventDefault(); });
    root.addEventListener('auxclick', function (e) { if (e.button === 1) e.preventDefault(); });
    root.addEventListener('pointerdown', function (e) {
      if (e.button === 1) {
        e.preventDefault();
        startMarquee(e, e.shiftKey, true);   /* 中键：只框图标 */
        return;
      }
      if (e.button !== 0) return;
      var deep = e.ctrlKey || e.metaKey;
      var pick = pickAt(e.clientX, e.clientY, deep);
      if (!pick) {
        if (!e.shiftKey) App.deselect();
        startMarquee(e, e.shiftKey, false);
        return;
      }
      var el = pick.el;
      var l = pick.l;
      /* 点已多选中的元素时不要打散多选，否则整组拖动失效 */
      var inMulti = App.multi.length > 1 && App.multi.indexOf(l.id) > -1;
      if (e.shiftKey || !inMulti) {
        App.select(l.id, e.shiftKey);
      } else {
        App.sel = l.id;
        drawSel();
        if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
      }
      if (App.editing) return;
      /* 自己判定双击：同一个文字图层 350ms 内点两下 → 直接进入编辑 */
      var now = Date.now();
      if (l.type === 'text' && App.__lastClick && App.__lastClick.id === l.id && now - App.__lastClick.t < 500) {
        App.__lastClick = null;
        startEdit(el, l);
        return;
      }
      App.__lastClick = { id: l.id, t: now };
      startDrag(e, el, l);
    });
    root.addEventListener('dblclick', function (e) {
      var el = e.target.closest ? e.target.closest('.cv-text') : null;
      if (!el) return;
      var l = App.getLayer(el.dataset.id);
      if (!l) return;
      e.preventDefault();
      startEdit(el, l);
    });
    root.addEventListener('paste', function (e) {
      if (!App.editing) return;
      e.preventDefault();
      var t = (e.clipboardData || window.clipboardData).getData('text');
      document.execCommand('insertText', false, t);
    });
    root.addEventListener('dragover', function (e) {
      if (e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.indexOf('Files') > -1) {
        e.preventDefault();
        if (root._drop) root._drop.classList.add('on');
        return;
      }
      if (!App.gdragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'none';
    });
    root.addEventListener('dragleave', function () { if (root._drop) root._drop.classList.remove('on'); });
    root.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        e.preventDefault();
        App.pickImage(e.dataTransfer.files[0], false);
        return;
      }
      if (root._drop) root._drop.classList.remove('on');
      /* 图标投放统一走 panels.js 的指针拖拽（比例换算 + 与格子同尺寸），这里不再处理 */
    });
  }

  var NG = [];
  function showGuides(list) {
    var host = $('#selLayer');
    NG.forEach(function (g) { g.remove(); });
    NG = (list || []).map(function (g) {
      var d = document.createElement('div');
      d.className = 'guide';
      d.style.cssText = g.vertical
        ? 'left:' + g.at + 'px;top:0;width:1px;height:' + App.doc.h + 'px'
        : 'top:' + g.at + 'px;left:0;height:1px;width:' + App.doc.w + 'px';
      host.appendChild(d);
      return d;
    });
  }

  function startDrag(e, el, l) {
    var sx = e.clientX, sy = e.clientY, ox = l.x, oy = l.y, moved = false, z = screenToDoc(el, l);
    /* 命中已多选的图层时，整组一起拖 */
    var group = null, fromCluster = false;
    if (App.multi.length > 1 && App.multi.indexOf(l.id) > -1) {
      group = App.selSet().map(function (x) { return { id: x.id, x: x.x, y: x.y }; });
    } else if (App.clusterIds) {
      var cids = App.clusterIds();
      if (cids.length > 1 && cids.indexOf(l.id) > -1) {
        fromCluster = true;
        group = cids.map(function (id) { return App.getLayer(id); })
          .filter(Boolean).map(function (x) { return { id: x.id, x: x.x, y: x.y }; });
      }
    }
    function move(ev) {
      var dx = (ev.clientX - sx) * z, dy = (ev.clientY - sy) * z;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 1.5) return;
      moved = true;
      document.body.classList.add('cv-dragging');
      if (group) {
        group.forEach(function (g) {
          var L = App.getLayer(g.id);
          if (!L) return;
          L.x = Math.round(g.x + dx); L.y = Math.round(g.y + dy);
          var e2 = App.map[g.id];
          if (e2) { e2.style.left = L.x + 'px'; e2.style.top = L.y + 'px'; }
        });
        drawSel();
        return;
      }
      var nx = ox + dx, ny = oy + dy;
      var sn = (!ev.altKey && App.doc.snap && App.doc.snap.on === true) ? snapPos(nx, ny, l) : null;   /* 吸附默认关：要跟手 */
      if (sn) { nx = sn.x; ny = sn.y; showGuides(sn.guides); }
      l.x = nx; l.y = ny;
      el.style.left = l.x + 'px'; el.style.top = l.y + 'px';
      drawSel();
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.body.classList.remove('cv-dragging');
      showGuides([]);
      if (moved) {
        if (group) { App.apply(); if (fromCluster && App.refreshClusterBase) App.refreshClusterBase(); App.toast('已移动 ' + group.length + ' 个图层'); }
        App.commit();
        if (window.Panels) Panels.syncInspector();
      }
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  function snapPos(x, y, l) {
    var T = 5, out = { x: x, y: y, guides: [] }, W = App.doc.w, H = App.doc.h, hh = l.h || 0;
    var cx = [0, Math.round((W - l.w) / 2), W - l.w, 64, W - 64 - l.w];
    var cy = [0, Math.round((H - hh) / 2), H - hh, 64, H - 64 - hh];
    for (var i = 0; i < cx.length; i++) {
      if (Math.abs(x - cx[i]) < T) { out.x = cx[i]; out.guides.push({ at: cx[i] + (i === 1 ? l.w / 2 : 0), vertical: true }); break; }
    }
    for (var j = 0; j < cy.length; j++) {
      if (Math.abs(y - cy[j]) < T) { out.y = cy[j]; out.guides.push({ at: cy[j], vertical: false }); break; }
    }
    return out.guides.length ? out : null;
  }

  function startResize(e, dir) {
    e.stopPropagation();
    e.preventDefault();
    var l = App.selLayer(); if (!l) return;
    var el = App.map[l.id]; if (!el) return;
    var sx = e.clientX, sy = e.clientY, z = screenToDoc(el, l);
    var o = { x: l.x, y: l.y, w: l.w, h: l.h || el.offsetHeight };
    var ratio = o.w ? o.h / o.w : 1;
    document.body.classList.add('cv-dragging');
    function move(ev) {
      var dx = (ev.clientX - sx) * z, dy = (ev.clientY - sy) * z;
      var x = o.x, y = o.y, w = o.w, h = o.h;
      if (dir.indexOf('e') > -1) w = o.w + dx;
      if (dir.indexOf('w') > -1) { w = o.w - dx; x = o.x + dx; }
      if (dir.indexOf('s') > -1) h = o.h + dy;
      if (dir.indexOf('n') > -1) { h = o.h - dy; y = o.y + dy; }
      w = Math.max(32, w);
      if (l.type === 'text') h = el.offsetHeight;
      else h = Math.max(8, ev.shiftKey ? w * ratio : h);
      l.x = Math.round(x); l.y = Math.round(y); l.w = Math.round(w);
      if (l.type !== 'text') l.h = Math.round(h);
      CV.applyLayer(el, l, App.doc);
      drawSel();
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.body.classList.remove('cv-dragging');
      App.apply();
      App.commit();
      if (window.Panels) Panels.syncInspector();
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  /* ---------------- 框选（中键 或 左键空白处） ---------------- */
  function startMarquee(e, additive, onlyIcon) {
    var sx = e.clientX, sy = e.clientY;
    var base = additive ? App.multi.slice() : [];
    var mv = document.createElement('div');
    mv.className = 'marquee';
    document.body.appendChild(mv);
    document.body.classList.add('cv-dragging');
    document.body.classList.add('marquee-drag');
    var moved = false;
    function paint(ev) {
      var x = Math.min(sx, ev.clientX), y = Math.min(sy, ev.clientY);
      var w = Math.abs(ev.clientX - sx), h = Math.abs(ev.clientY - sy);
      mv.style.left = x + 'px'; mv.style.top = y + 'px';
      mv.style.width = w + 'px'; mv.style.height = h + 'px';
      return { l: x, t: y, r: x + w, b: y + h, w: w, h: h };
    }
    function move(ev) {
      if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 3) moved = true;
      if (moved) paint(ev);
    }
    function up(ev) {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      document.body.classList.remove('cv-dragging');
      document.body.classList.remove('marquee-drag');
      var box = paint(ev);
      mv.remove();
      if (!moved) {
        if (!additive) App.deselect();
        return;
      }
      var ids = base.slice();
      App.doc.layers.forEach(function (l) {
        if (l.hidden || l.locked) return;
        if (onlyIcon && l.type !== 'icon') return;
        var el = App.map[l.id];
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.right >= box.l && r.left <= box.r && r.bottom >= box.t && r.top <= box.b) {
          if (ids.indexOf(l.id) < 0) ids.push(l.id);
        }
      });
      App.selectMany(ids);
      if (ids.length) App.toast('已框选 ' + ids.length + ' 个' + (onlyIcon ? '图标' : '图层'), 'ok');
      else App.toast(onlyIcon ? '范围内没有图标' : '框选范围内没有图层');
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  /* ---------------- 行内编辑 ---------------- */
  function serializeRich(el) {
    var out = '';
    (function walk(n) {
      [].slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1) {
          if (c.tagName === 'BR') out += '\n';
          else if (c.classList && c.classList.contains('hl')) out += '[[' + c.textContent + ']]';
          else if (c.tagName === 'DIV' || c.tagName === 'P') {
            if (out && out.slice(-1) !== '\n') out += '\n';
            walk(c);
          } else walk(c);
        }
      });
    })(el);
    return out.replace(/\u00a0/g, ' ').replace(/\n+$/, '');
  }

  function startEdit(el, l) {
    App.editing = true;
    el.setAttribute('contenteditable', 'true');
    el.focus();
    try {
      var r = document.createRange(); r.selectNodeContents(el);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    } catch (err) { }
    function done(save) {
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKey);
      el.removeAttribute('contenteditable');   /* 关键：不摘掉的话双击会变浏览器选词 */
      try { var sel = window.getSelection(); if (sel && sel.rangeCount) sel.removeAllRanges(); } catch (e) { }
      App.editing = false;
      var t = serializeRich(el);
      if (save && t !== l.text) {
        l.text = t;
        App.apply(); App.commit();
      } else App.apply();
    }
    function onBlur() { done(true); }
    function onKey(ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); el.blur(); }
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); el.blur(); }
      ev.stopPropagation();
    }
    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKey);
  }

  App.editSel = function () {
    var l = App.selLayer();
    if (!l || l.type !== 'text') return;
    var el = App.map[l.id];
    if (el) startEdit(el, l);
  };

  /* ---------------- 群组操作 ---------------- */
  function selBounds(set) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    set.forEach(function (l) {
      var el2 = App.map[l.id];
      var w = l.w || 0, h = l.type === 'text' ? (el2 ? el2.offsetHeight : 0) : (l.h || 0);
      x0 = Math.min(x0, l.x); y0 = Math.min(y0, l.y);
      x1 = Math.max(x1, l.x + w); y1 = Math.max(y1, l.y + h);
    });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  App.align = function (mode) {
    var set = App.selSet(); if (!set.length) return;
    var W = App.doc.w, H = App.doc.h, M = 64;
    set.forEach(function (l) {
      var el2 = App.map[l.id];
      var w = l.w || 0, h = l.type === 'text' ? (el2 ? el2.offsetHeight : 0) : (l.h || 0);
      if (mode === 'l') l.x = M;
      else if (mode === 'r') l.x = W - M - w;
      else if (mode === 'hc') l.x = Math.round((W - w) / 2);
      else if (mode === 't') l.y = M;
      else if (mode === 'b') l.y = H - M - h;
      else if (mode === 'vc') l.y = Math.round((H - h) / 2);
    });
    App.apply(); App.commit();
    App.toast('已对齐');
  };
  App.distribute = function (dir) {
    var set = App.selSet();
    if (set.length < 3) { App.toast('至少选 3 个元素才能分布', 'err'); return; }
    if (dir === 'h') {
      set.sort(function (a, b) { return a.x - b.x; });
      var x0 = set[0].x, xn = set[set.length - 1].x, s = (xn - x0) / (set.length - 1);
      set.forEach(function (l, i) { l.x = Math.round(x0 + s * i); });
    } else {
      set.sort(function (a, b) { return a.y - b.y; });
      var y0 = set[0].y, yn = set[set.length - 1].y, s2 = (yn - y0) / (set.length - 1);
      set.forEach(function (l, i) { l.y = Math.round(y0 + s2 * i); });
    }
    App.apply(); App.commit();
    App.toast('已等距分布');
  };
  /* 网格排列只对图标生效：优先用选中的图标，没有就用画布上全部图标 */
  App.iconSet = function () {
    var sel = App.selSet().filter(function (l) { return l.type === 'icon'; });
    if (sel.length >= 2) return { list: sel, from: 'sel' };
    var all = App.doc.layers.filter(function (l) { return l.type === 'icon' && !l.hidden && !l.locked; });
    if (all.length >= 2) return { list: all, from: 'all' };
    return { list: [], from: 'none' };
  };

  /* 网格落位：以选中图标的「原始包围盒中心」为锚点，不强制挪到画布正中 */
  /* 图标圆阵：等径圆整齐堆叠 + 同步缩放/旋转/间距 */
  App.__ringOpts = { gap: 8, brand: true };
  App.__cluster = null;            /* { cols, rows, d, cx, cy, base: [{id,x,y,w,h}] } */
  App.CLUSTER_GRIDS = [[2, 1], [3, 1], [2, 2], [3, 2], [4, 2], [3, 3], [4, 3], [5, 3]];

  function clusterMembers() {
    var rings = {}, icons = [];
    App.doc.layers.forEach(function (l) {
      var r = String(l.role);
      if (r.indexOf('cring_') === 0) rings[r.slice(6)] = l;
    });
    App.doc.layers.forEach(function (l) {
      if (l.type === 'icon' && rings[l.id]) icons.push(l);
    });
    var all = [];
    icons.forEach(function (ic) { all.push(rings[ic.id], ic); });
    return all;
  }

  App.circleCluster = function (spec) {
    var pick = App.iconSet();
    if (!pick.list.length) { App.toast('画布上没有图标', 'err'); return; }
    var set = pick.list;
    var total = set.length;
    var grid;
    if (spec && spec.length === 2) grid = spec;
    else if (spec === 'auto' || !spec) {
      var n0 = total;
      grid = n0 <= 2 ? [2, 1] : (n0 === 3 ? [3, 1] : (n0 === 4 ? [2, 2] : (n0 <= 6 ? [3, 2] : (n0 <= 8 ? [4, 2] : [3, 3]))));
    } else grid = [parseInt(spec, 10) || 3, Math.ceil(total / (parseInt(spec, 10) || 3))];

    var gap = App.__ringOpts.gap == null ? 8 : App.__ringOpts.gap;
    var d = 0;
    set.forEach(function (l) {
      var old = App.doc.layers.filter(function (r) { return r.role === 'cring_' + l.id; })[0];
      if (old && old.w > d) d = old.w;
    });
    if (!d) set.forEach(function (l) { d = Math.max(d, l.clusterD || l.w || 0); });
    if (!d) d = Math.round(App.doc.w * 0.125);
    var gpx = Math.round(d * gap / 100);

    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    set.forEach(function (l) {
      x0 = Math.min(x0, l.x); y0 = Math.min(y0, l.y);
      x1 = Math.max(x1, l.x + (l.w || d)); y1 = Math.max(y1, l.y + (l.h || d));
    });
    var totalW = grid[0] * d + (grid[0] - 1) * gpx;
    var totalH = grid[1] * d + (grid[1] - 1) * gpx;
    var ox = Math.round((x0 + x1) / 2 - totalW / 2);
    var oy = Math.round((y0 + y1) / 2 - totalH / 2);

    App.doc.layers = App.doc.layers.filter(function (l) {
      var r = String(l.role);
      if (r.indexOf('cring_') === 0) return false;
      if (/^ring\d+$/.test(r)) return false;
      return true;
    });

    set.forEach(function (l, i) {
      var col = i % grid[0], row = Math.floor(i / grid[0]);
      var cx = ox + col * (d + gpx), cy = oy + row * (d + gpx);
      var brand = '#101114';
      var el = App.map[l.id];
      if (App.__ringOpts.brand && el) { try { brand = CV.brandColorOf(el) || '#101114'; } catch (e) { } }
      var ring = CV.S('cring_' + l.id, 'circle', {
        x: cx, y: cy, w: d, h: d, color: '#ffffff', radius: 999,
        bw: Math.max(2, Math.round(d * 0.028)), bc: brand
      });
      var at = App.doc.layers.indexOf(l);
      App.doc.layers.splice(at, 0, ring);
      var pad = Math.round(d * 0.22);
      l.clusterD = d;
      l.w = Math.round(d * 0.56); l.h = l.w;
      l.x = cx + pad; l.y = cy + pad;
      l.rot = 0;
    });

    App.__cluster = {
      cols: grid[0], rows: grid[1], d: d, gap: gap,
      cx: ox + totalW / 2, cy: oy + totalH / 2,
      base: clusterMembers().map(function (l) {
        return { id: l.id, x: l.x, y: l.y, w: l.w, h: l.h || l.w, rot: l.rot || 0 };
      })
    };
    App.apply(); App.commit();
    App.toast('已排成 ' + grid[0] + ' × ' + grid[1] + ' 圆阵（' + set.length + ' 个图标）', 'ok');
  };

  /* 圆阵成员 id（圆环 + 对应图标） */
  App.clusterIds = function () {
    var c = App.__cluster;
    if (c && c.base && c.base.length) {
      return c.base.map(function (b) { return b.id; }).filter(function (id) { return !!App.getLayer(id); });
    }
    return clusterMembers().map(function (l) { return l.id; });
  };
  /* 拖动后刷新基点，保证后续缩放/旋转仍然以新位置为中心 */
  App.refreshClusterBase = function () {
    var c = App.__cluster; if (!c) return;
    var mem = clusterMembers();
    if (!mem.length) { App.__cluster = null; return; }
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    mem.forEach(function (l) {
      x0 = Math.min(x0, l.x); y0 = Math.min(y0, l.y);
      x1 = Math.max(x1, l.x + (l.w || 0)); y1 = Math.max(y1, l.y + (l.h || l.w || 0));
    });
    c.cx = (x0 + x1) / 2; c.cy = (y0 + y1) / 2;
    c.base = mem.map(function (l) {
      return { id: l.id, x: l.x, y: l.y, w: l.w, h: l.h || l.w, rot: l.rot || 0 };
    });
  };

  /* 同步缩放（跟手，不重绘） */
  /* 雷达图实时预览：只重画这一张 SVG */
  App.radarLive = function (l) {
    var el = App.map[l.id];
    if (!el) return;
    var html = CV.radarSvg(l.radar || {});
    el.innerHTML = html;
    el.__rb = html;
  };

  App.clusterScale = function (pct) {
    var c = App.__cluster; if (!c) return;
    c.scalePct = pct;
    var k = pct / 100;
    c.base.forEach(function (b) {
      var l = App.getLayer(b.id); if (!l) return;
      l.x = Math.round(c.cx + (b.x - c.cx) * k);
      l.y = Math.round(c.cy + (b.y - c.cy) * k);
      l.w = Math.max(8, Math.round(b.w * k));
      l.h = Math.max(8, Math.round(b.h * k));
      var el = App.map[l.id];
      if (el) {
        el.style.left = l.x + 'px'; el.style.top = l.y + 'px';
        el.style.width = l.w + 'px'; el.style.height = l.h + 'px';
      }
    });
    if (App.drawSel) App.drawSel();
  };

  /* 同步旋转（跟手） */
  App.clusterRotate = function (deg) {
    var c = App.__cluster; if (!c) return;
    c.base.forEach(function (b) {
      var l = App.getLayer(b.id); if (!l) return;
      l.rot = deg;
      var el = App.map[l.id];
      if (el) el.style.transform = deg ? 'rotate(' + deg + 'deg)' : '';
    });
    if (App.drawSel) App.drawSel();
  };

  /* 同步间距（跟手：按新间距重排一次，不落盘） */
  App.clusterGapLive = function (gapPct) {
    if (!App.__cluster) return;
    var keep = App.__ringOpts.gap;
    App.__ringOpts.gap = gapPct;
    App.circleCluster([App.__cluster.cols, App.__cluster.rows]);
    App.__ringOpts.gap = keep;
  };

  App.gridPlace = function (set, cols, gap) {
    gap = gap == null ? 32 : gap;
    var n = cols === 'auto' ? Math.ceil(Math.sqrt(set.length)) : parseInt(cols, 10);
    n = Math.max(1, Math.min(n || 1, set.length));
    var rows = Math.ceil(set.length / n);
    var items = set.map(function (l) {
      var el = App.map[l.id];
      var h = l.type === 'text' ? (el ? el.offsetHeight : 0) : (l.h || 0);
      return { l: l, w: l.w || 0, h: h };
    });
    var cw = 0, ch = 0;
    items.forEach(function (it) { cw = Math.max(cw, it.w); ch = Math.max(ch, it.h); });
    var cellW = cw + gap, cellH = ch + gap;
    var totalW = n * cellW - gap, totalH = rows * cellH - gap;
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    items.forEach(function (it) {
      x0 = Math.min(x0, it.l.x); y0 = Math.min(y0, it.l.y);
      x1 = Math.max(x1, it.l.x + it.w); y1 = Math.max(y1, it.l.y + it.h);
    });
    var bxc = (x0 + x1) / 2, byc = (y0 + y1) / 2;
    var ox = bxc - totalW / 2, oy = byc - totalH / 2;
    var M = 64;
    if (totalW <= App.doc.w - M * 2) ox = Math.max(M, Math.min(ox, App.doc.w - M - totalW));
    if (totalH <= App.doc.h - M * 2) oy = Math.max(M, Math.min(oy, App.doc.h - M - totalH));
    items.forEach(function (it, i) {
      var c = i % n, r = Math.floor(i / n);
      it.l.x = Math.round(ox + c * cellW + (cw - it.w) / 2);
      it.l.y = Math.round(oy + r * cellH + (ch - it.h) / 2);
    });
    return { n: n, rows: rows };
  };

  App.gridArrange = function (cols, gap) {
    var pick = App.iconSet();
    if (!pick.list.length) { App.toast('画布上没有图标可排布', 'err'); return; }
    var set = pick.list;
    if (pick.from === 'all') {
      App.selectMany(set.map(function (l) { return l.id; }));
      App.toast('只排图标：本次作用于画布上全部 ' + set.length + ' 个图标');
    } else if (set.length < App.selSet().length) {
      App.toast('只排图标：忽略 ' + (App.selSet().length - set.length) + ' 个非图标图层');
    }
    var r = App.gridPlace(set, cols, gap);
    App.apply(); App.commit();
    App.toast('已排成 ' + r.n + ' 列 × ' + r.rows + ' 行（' + set.length + ' 个图标，位置沿用原处）', 'ok');
  };
  App.scaleSelTo = function (pct) {
    var set = App.selSet(); if (!set.length) return;
    if (!App.__scaleBase) {
      App.__scaleBase = set.map(function (l) {
        var el2 = App.map[l.id];
        return {
          id: l.id, x: l.x, y: l.y, w: l.w || 0, size: l.size,
          h: l.type === 'text' ? (el2 ? el2.offsetHeight : 0) : (l.h || 0)
        };
      });
    }
    var b = selBounds(set), k = pct / 100;
    var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    App.__scaleBase.forEach(function (o) {
      var l = App.getLayer(o.id); if (!l) return;
      l.x = Math.round(cx + (o.x - cx) * k);
      l.y = Math.round(cy + (o.y - cy) * k);
      l.w = Math.max(l.type === 'text' ? 24 : 2, Math.round(o.w * k));
      if (l.type === 'text') { if (o.size) l.size = Math.max(8, Math.round(o.size * k)); }
      else l.h = Math.max(1, Math.round(o.h * k));
    });
    App.suppress = true; App.apply(); App.suppress = false;
  };
  /* 实时旋转：只改内联 transform，零重绘零落盘（跟手） */
  App.rotateLive = function (deg) {
    var set = App.selSet();
    set.forEach(function (l) {
      l.rot = deg;
      var el = App.map[l.id];
      if (el) el.style.transform = deg ? 'rotate(' + deg + 'deg)' : '';
    });
    if (App.drawSel) App.drawSel();
  };

  App.rotateSelTo = function (deg) {
    App.selSet().forEach(function (l) { l.rot = deg; });
    App.apply(); App.commit();
  };
  App.rotateAdd = function (deg) {
    App.selSet().forEach(function (l) { l.rot = Math.round(((l.rot || 0) + deg) * 10) / 10; });
    App.apply(); App.commit();
  };

  /* ---------------- 图层操作 ---------------- */
  App.commit = function () { App.pushHist(); saveLocal(); };
  App.addLayerAt = function (l, quiet, index) {
    App.doc.layers.splice(index == null ? App.doc.layers.length : index, 0, l);
    App.sel = l.id;
    App.apply();
    App.commit();
    if (!quiet) App.toast('已添加图片图层');
    return l;
  };
  App.addLayer = function (l, quiet) {
    App.doc.layers.push(l);
    App.sel = l.id;
    App.apply();
    App.commit();
    if (!quiet) App.toast('已添加' + ({ text: '文字', icon: '图标', shape: '形状', raw: '图形' }[l.type] || '图层'));
    return l;
  };
  App.updateSel = function (patch) {
    var l = App.selLayer(); if (!l) return;
    for (var k in patch) l[k] = patch[k];
    var el = App.map[l.id];
    if (el) CV.applyLayer(el, l, App.doc);
    App.apply();
    App.commit();
  };
  App.clearLayers = function (mode) {
    var before = App.doc.layers.length;
    App.doc.layers = App.doc.layers.filter(function (l) {
      return mode === 'icon' ? l.type !== 'icon' : false;
    });
    var removed = before - App.doc.layers.length;
    if (!removed) { App.toast(mode === 'icon' ? '没有图标可清空' : '画布已经是空的', 'err'); return; }
    App.sel = null;
    App.multi = [];
    App.apply();
    App.commit();
    App.toast((mode === 'icon' ? '已清空 ' + removed + ' 个图标' : '已清空全部 ' + removed + ' 个图层') + ' · Ctrl+Z 可撤销', 'ok');
  };

  App.removeSel = function () {
    var set = App.selSet(); if (!set.length) return;
    var kill = {};
    set.forEach(function (l) { kill[l.id] = 1; });
    App.doc.layers = App.doc.layers.filter(function (x) { return !kill[x.id]; });
    App.sel = null; App.multi = [];
    App.apply(); App.commit();
    App.toast('已删除 ' + set.length + ' 个图层');
  };
  App.duplicate = function () {
    var set = App.selSet(); if (!set.length) return;
    var made = [];
    set.forEach(function (l) {
      var c = JSON.parse(JSON.stringify(l));
      c.id = CV.uid(l.type.charAt(0));
      c.x += 24; c.y += 24;
      App.doc.layers.push(c);
      made.push(c.id);
    });
    App.multi = made; App.sel = made[made.length - 1];
    App.apply(); App.commit();
    App.toast('已创建副本 ×' + made.length);
  };
  App.order = function (dir) {
    var l = App.selLayer(); if (!l) return;
    var L = App.doc.layers, i = L.indexOf(l);
    if (i < 0) return;
    L.splice(i, 1);
    var j = dir === 'front' ? L.length : dir === 'back' ? 0 : Math.min(L.length, Math.max(0, i + (dir === 'up' ? 1 : -1)));
    L.splice(j, 0, l);
    App.apply(); App.commit();
  };
  App.nudge = function (dx, dy) {
    var set = App.selSet(); if (!set.length) return;
    set.forEach(function (l) {
      l.x += dx; l.y += dy;
      var el = App.map[l.id];
      if (el) { el.style.left = l.x + 'px'; el.style.top = l.y + 'px'; }
    });
    drawSel();
    if (window.Panels) Panels.syncInspector();
  };

  /* ---------------- 导出 ---------------- */
  App.slug = function () {
    var d = (App.doc.content && App.doc.content.date) || '';
    var k = d.replace(/[^\d]/g, '');
    if (k.length >= 8) k = k.slice(0, 4) + '-' + k.slice(4, 6) + '-' + k.slice(6, 8);
    return (k || 'cover') + '_' + App.doc.style + '_' + App.doc.layout;
  };
  App.exportPng = function (scale) {
    scale = scale || 2;
    if (App.locked) return;
    App.locked = true;
    App.toast('正在出图…', 'wait');
    fetch('api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc: App.doc, name: App.slug(), scale: scale })
    }).then(function (r) {
      if (r.status === 404 || (r.headers.get('content-type') || '').indexOf('json') < 0) throw new Error('no-render-api');
      return r.json();
    }).then(function (j) {
      App.locked = false;
      if (j.ok) {
        App.toast('已出图 ' + j.name, 'ok', j.size);
        if (window.Panels) Panels.showShot(j.url + '?t=' + Date.now(), j);
      } else {
        App.toast('出图失败：' + (j.error || '未知'), 'err');
      }
    }).catch(function (err) {
      App.locked = false;
      if (err.message === 'no-render-api') {
        App.toast('静态托管模式：已改为导出 JSON（本地跑工具可出图）', 'ok');
        App.exportJson();
      } else {
        App.toast('出图失败：' + err.message, 'err');
      }
    });
  };
  /* 读图 -> 压到 1600px 宽 -> dataURL，避免 JSON 过大 */
  App.pickImage = function (file, asBg) {
    if (!file || !/^image\//.test(file.type)) { App.toast('请拖入图片文件', 'err'); return; }
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var maxW = 1600;
        var k = Math.min(1, maxW / img.naturalWidth);
        var c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k);
        c.height = Math.round(img.naturalHeight * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        var url = c.toDataURL('image/jpeg', 0.86);
        var layer = CV.IMG(asBg ? 'bg' : 'pic', url, {
          x: 0, y: 0, w: CV.W, h: CV.H, fit: 'cover',
          dim: asBg ? 0.18 : 0, dimColor: (App.doc.tokens && App.doc.tokens.ink) || '#0e1115'
        });
        if (asBg) App.addLayerAt(layer, true, 0);
        else App.addLayer(layer, true);
        App.toast(asBg ? '已设为背景图' : '已插入图片', 'ok');
      };
      img.onerror = function () { App.toast('图片读取失败', 'err'); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };
  App.setAsBg = function () {
    var l = App.selLayer();
    if (!l || l.type !== 'image') return;
    l.x = 0; l.y = 0; l.w = CV.W; l.h = CV.H; l.fit = 'cover'; l.role = 'bg';
    var i = App.doc.layers.indexOf(l);
    if (i > 0) { App.doc.layers.splice(i, 1); App.doc.layers.unshift(l); }
    App.apply(); App.commit();
    App.toast('已设为背景图', 'ok');
  };
  function toDataUrl(url) {
    return fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
      return new Promise(function (res, rej) {
        var fr = new FileReader();
        fr.onload = function () { res(fr.result); };
        fr.onerror = rej;
        fr.readAsDataURL(b);
      });
    });
  }
  App.exportHtml = function () {
    App.toast('正在打包 HTML…', 'wait');
    var steps = [fetch('assets/css/cover.css').then(function (r) { return r.text(); })];
    Promise.all(steps).then(function (arr) {
      var css = arr[0];
      var texNames = ['grain', 'paper', 'wrinkle', 'dot', 'stripe'];
      return Promise.all(texNames.map(function (n) {
        return toDataUrl('assets/tex/' + n + '.png').then(function (d) { return { n: n, d: d }; }).catch(function () { return null; });
      })).then(function (tex) {
        tex.forEach(function (t) {
          if (!t) return;
          css = css.split('../tex/' + t.n + '.png').join(t.d);
        });
        return css;
      });
    }).then(function (css) {
      var host = document.querySelector('#cover .cv');
      var clone = host.cloneNode(true);
      var imgs = [].slice.call(clone.querySelectorAll('img'));
      return Promise.all(imgs.map(function (im) {
        var src = im.getAttribute('src') || '';
        if (!src || src.indexOf('data:') === 0) return null;
        var abs = src.charAt(0) === '/' ? src.slice(1) : src;
        return toDataUrl(abs).then(function (d) { im.setAttribute('src', d); }).catch(function () { });
      })).then(function () { return css; });
    }).then(function (css) {
      var host = document.querySelector('#cover .cv');
      var clone = host.cloneNode(true);
      clone.classList.remove('cv-edit');
      var html = '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n' +
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
        '<title>' + CV.esc(App.slug()) + '</title>\n' +
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&family=Noto+Serif+SC:wght@400;700;900&family=Archivo+Black&display=swap">\n' +
        '<style>\n*{margin:0;padding:0;box-sizing:border-box}\nhtml,body{background:#e9edf3;min-height:100%;display:grid;place-items:center;padding:24px}\n' +
        css + '\n</style>\n</head>\n<body>\n' + clone.outerHTML + '\n</body>\n</html>\n';
      App.__lastHtml = html;
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = App.slug() + '.html';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
      App.toast('已导出 HTML（含内联图片/纹理，双击即开）', 'ok');
    }).catch(function (e) { App.toast('导出失败：' + e.message, 'err'); });
  };
  App.exportJson = function () {
    var blob = new Blob([JSON.stringify(App.doc, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = App.slug() + '.cover.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    App.toast('已导出 JSON');
  };
  App.importJson = function (file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var d = JSON.parse(fr.result);
        if (!d.layers) throw new Error('不是有效的封面 JSON');
        App.sel = null; App.setDoc(d);
        App.toast('已载入 ' + (file.name || 'JSON'), 'ok');
      } catch (err) { App.toast('载入失败：' + err.message, 'err'); }
    };
    fr.readAsText(file);
  };

  /* ---------------- toast ---------------- */
  App.toast = function (msg, kind, sub) {
    var box = $('#toasts');
    if (!box) return;
    var d = document.createElement('div');
    d.className = 'toast' + (kind === 'ok' ? ' ok' : kind === 'err' ? ' err' : '');
    d.innerHTML = (kind === 'wait' ? '<span class="spin"></span>' : '') + CV.esc(msg) +
      (sub ? ' <code>' + CV.esc(sub) + '</code>' : '');
    box.appendChild(d);
    setTimeout(function () {
      d.style.transition = 'opacity .3s,transform .3s';
      d.style.opacity = 0; d.style.transform = 'translateY(8px)';
      setTimeout(function () { d.remove(); }, 320);
    }, kind === 'wait' ? 1400 : 2800);
  };

  /* ---------------- 快捷键 ---------------- */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var inField = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    var mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? App.redo() : App.undo(); return; }
    if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); App.redo(); return; }
    if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); App.exportPng(); return; }
    if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); App.duplicate(); return; }
    if (mod && e.key.toLowerCase() === 'a') { e.preventDefault(); App.selectAll(); return; }
    if (inField) return;
    if (e.key === 'Escape') { if (!App.editing) App.deselect(); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); App.removeSel(); return; }
    if (e.key.indexOf('Arrow') === 0) {
      e.preventDefault();
      var s = e.shiftKey ? 10 : 1;
      App.nudge(e.key === 'ArrowLeft' ? -s : e.key === 'ArrowRight' ? s : 0,
        e.key === 'ArrowUp' ? -s : e.key === 'ArrowDown' ? s : 0);
      App.commit();
      return;
    }
    var l = App.selLayer();
    if (!l) return;
    if (l.type === 'text' && (e.key === 'Enter' || e.key === 'F2')) {
      e.preventDefault();
      App.editSel();
      return;
    }
    if (l.type === 'text' && (e.key === '[' || e.key === ']')) {
      e.preventDefault();
      App.updateSel({ size: Math.max(10, l.size + (e.key === ']' ? 2 : -2)) });
    }
    if (e.code === 'Backquote') { e.preventDefault(); App.recompose(); App.toast('已按当前预设重排'); }
  });

  /* ---------------- 启动 ---------------- */
  App.BUILD = '20261029-f51';
  function stampBuild() {
    document.documentElement.dataset.build = App.BUILD;
    var bar = document.querySelector('.stage-bar');
    if (!bar || document.getElementById('buildTag')) return;
    var tag = document.createElement('span');
    tag.id = 'buildTag';
    tag.className = 'pill';
    tag.title = '当前运行的前端构建号，用于确认是否已更新';
    tag.textContent = 'build ' + App.BUILD;
    tag.style.opacity = '.62';
    bar.appendChild(tag);
  }

  App.boot = function () {
    stampBuild();
    var doc = App.loadLocal();
    if (!doc || !doc.layers) doc = CV.compose('swiss', 'hero', CV.defaultContent(), 'land');
    if (!doc.ratio) doc.ratio = 'land';
    /* 版式升级：老存档按当前预设自动重排，避免看到过期布局 */
    var prevPv = doc.pv;
    if (doc.style && prevPv && prevPv !== CV.PRESET_VERSION && CV.styleById(doc.style)) {
      var cc = doc.content || CV.defaultContent();
      var fresh = CV.compose(doc.style, doc.layout || 'hero', cc, doc.ratio || 'land');
      fresh.brand = doc.brand;
      fresh.id = doc.id;
      doc = fresh;
      setTimeout(function () { App.toast('版式已升级到 ' + CV.PRESET_VERSION + '（text 内容保留）', 'ok'); }, 600);
    }
    doc.paper = Object.assign({ on: false, opacity: 80, noise: 60, scale: 260 }, doc.paper || {});
    if (doc.paper.on !== true) doc.paper.on = false;
    App.doc = doc;
    App.hist = [JSON.stringify(doc)];
    App.hi = 0;
    App.apply();
    window.addEventListener('resize', function () { App.fitZoom(); drawSel(); });
    App.toast('就绪 · 左侧拖图标进画布，双击文字直接改', 'ok');
  };
  window.addEventListener('DOMContentLoaded', function () {
    if (window.Panels) Panels.init(App);
    App.boot();
    if (window.Panels) Panels.afterBoot();
  });

})();
