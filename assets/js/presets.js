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
  CV.LAYOUTS = [
    { id: 'hero', name: '主视觉' }, { id: 'poster', name: '通栏大标' },
    { id: 'split', name: '分栏头条' }, { id: 'feature', name: '图标巨化' }
  ];

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
      t: { ink: '#14110e', ink2: '#8a7a68', accent: '#b81f2b', bgSolid: '#f4f0e6', grad: 'linear-gradient(135deg,#3b82f6 0%,#a855f7 48%,#ec4899 100%)' },
      bg: 'radial-gradient(130% 110% at 78% 8%,#fbf8ef 0%,#f4f0e6 48%,#ece5d6 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'heavy', size: 104, color: '#b81f2b', lh: .96, ls: -.03 },
      sub: { color: '#5a4a3c' },
      decor: function (x) {
        var t = x.t, L = x.L;
        x.add(CV.S('star', 'star4', { x: 806, y: 86, w: 316, h: 316, color: t.grad, rot: 0, opacity: .95 }));
        x.add(CV.S('tag', 'rect', { x: M, y: 34, w: 122, h: 32, color: t.accent }));
        var k = find(L, 'kicker');
        if (k) merge(k, { x: M, y: 42, size: 13, color: '#fff', ls: .04, upper: false });
        var d = find(L, 'date');
        if (d) merge(d, { y: 40, size: 14, color: t.ink2 });
        var s = find(L, 'series');
        if (s) merge(s, { y: 78, size: 17, font: 'mono', ls: .18, upper: true, color: t.ink2, weight: 700 });
        var r = find(L, 'rule');
        if (r) merge(r, { y: 118, w: 96, h: 6 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { y: 152, w: 660, size: 104 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 596, y: 300, w: 200, h: 200, opacity: .96 });
        x.add(CV.S('b1', 'bar', { x: M, y: 616, w: 96, h: 6, color: t.ink }));
      }
    },
    /* 7 —— 荡殇：暗色杂志 ------------------------------ */
    {
      id: 'noir', name: '暗色杂志', sub: '荡殇 · 发光与斜体',
      t: { ink: '#f3f5f9', ink2: '#8b97ab', accent: '#ff3b30', violet: '#6d5cff' },
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
        x.add(CV.S('c', 'circle', { x: po ? 52 : 1022, y: po ? 92 : 44, w: po ? 148 : 118, h: po ? 148 : 118, color: t.red }));
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
      id: 'zine', name: '撕纸拼贴', sub: '荡殇永魔 · 撕口与粗黑对照',
      t: { ink: '#141210', ink2: '#6d6459', accent: '#c8102e', blue: '#1c5fd0', bgSolid: '#efe8d9' },
      bg: 'radial-gradient(128% 108% at 16% 2%,#f8f1e2 0%,#eee6d5 48%,#dfd4be 100%)',
      fx: ['paper', 'wrinkle', 'grain', 'vignette'], dark: false,
      title: { font: 'black', size: 96, lh: 0.94, ls: -.028, color: '#141210' },
      decor: function (x) {
        var t = x.t, L = x.L, lay = x.layout;
        var tx = lay === 'poster' ? 0 : lay === 'feature' ? 730 : lay === 'split' ? 600 : 540;
        if (tx) {
          x.add(CV.S('sheet', 'rect', { x: tx + 82, y: 0, w: W - tx - 82, h: H, color: 'rgba(255,250,236,.55)' }));
          x.add(CV.S('shade', 'rect', { x: tx - 96, y: 0, w: 98, h: H, color: 'linear-gradient(to right,rgba(74,56,30,0),rgba(74,56,30,.30))' }));
          x.add(CV.R('tear', tearRaw(82), { x: tx, y: 0, w: 82, h: H }));
          x.add(CV.S('blot', 'blob', { x: 30, y: 130, w: 560, h: 330, color: t.accent, opacity: .055, rot: -3 }));
        }
        var ti = find(L, 'title');
        if (ti && lay !== 'poster') merge(ti, { x: 52, w: tx ? tx - 40 : 620, size: lay === 'feature' ? 86 : 98, maxH: 340 });
        if (ti && lay === 'poster') merge(ti, { size: 104 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, lay === 'feature' ? { x: 838, y: 210, w: 250, h: 250 } : { x: tx ? tx + 96 : 712, y: 132, w: 372, h: 372 });
        x.add(CV.S('rule1', 'bar', { x: 56, y: 618, w: 118, h: 8, color: t.accent }));
        x.add(CV.S('rule2', 'bar', { x: 56, y: 632, w: 62, h: 4, color: t.ink, opacity: .5 }));
        x.add(CV.S('rule3', 'bar', { x: 56, y: 646, w: 26, h: 3, color: t.accent, opacity: .8 }));
      }
    },
    /* 13 —— 黑鸦：贴纸描边 --------------------------------- */
    {
      id: 'sticker', name: '贴纸描边', sub: '黑鸦 · 巨号白描边红字',
      t: { ink: '#17130f', ink2: '#8a7a5f', accent: '#d8232a', blue: '#2f7bd6', bgSolid: '#f8eed6' },
      bg: 'linear-gradient(180deg,#f4e2bb 0%,#efd9a8 58%,#e6cb90 100%)',
      fx: ['paper', 'grain'], dark: false,
      title: { font: 'black', size: 118, lh: 1.0, ls: -.02, color: '#d8232a', stroke: 14, strokeColor: '#ffffff', shadow: 'drop' },
      decor: function (x) {
        var t = x.t, L = x.L;
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 746, y: 210, w: 330, h: 330 });
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 56, w: 640, size: 112 });
        x.add(CV.S('dot1', 'circle', { x: 1104, y: 120, w: 18, h: 18, color: t.blue, opacity: .8 }));
        x.add(CV.S('dot2', 'circle', { x: 1064, y: 596, w: 30, h: 30, color: t.accent, opacity: .9 }));
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
        x.add(CV.S('ul', 'bar', { x: 74, y: 470, w: 300, h: 14, color: t.yellow, rot: -1.2, radius: 8, opacity: .85 }));
      }
    }
  ];

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
      var bn3 = u('bignum') || f('bignum'); if (bn3) merge(bn3, { y: 508 });
      var nm3 = find(U, 'num'); if (nm3) merge(nm3, { y: 470 });
    }
    return { L: L, U: U };
  }

  /* ============================ 组装 ============================ */
  CV.styleById = function (id) {
    for (var i = 0; i < CV.STYLES.length; i++) if (CV.STYLES[i].id === id) return CV.STYLES[i];
    return CV.STYLES[0];
  };

  CV.compose = function (styleId, layoutId, content) {
    var p = CV.styleById(styleId);
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
    var ctx = { t: t, c: c, add: addU, top: add, L: L, layout: lay, W: W, H: H, p: p };
    if (p.decor) p.decor(ctx);
    if (p.post) p.post(ctx);
    layoutFix(p, lay, L, under);
    return {
      v: CV.VERSION, w: W, h: H, style: p.id, layout: lay,
      bg: p.bg, fx: (p.fx || []).slice(), dark: !!p.dark,
      tokens: CV.clone(t), content: c,
      layers: under.filter(Boolean).concat(L.filter(Boolean))
    };
  };
})();
