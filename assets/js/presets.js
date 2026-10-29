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
          x.add(CV.R('chart', radarHand(), { x: cw + 46, y: 176, w: 296, h: 296, opacity: .95 }));
          var labs = [['前端', '60.33', cw + 140, 148], ['后端', '55.34', cw + 316, 250],
          ['算法', '79.79', cw + 306, 400], ['数据', '69.81', cw + 34, 400], ['研究', '85.07', cw + 140, 496]];
          labs.forEach(function (l, i) {
            x.add(CV.T('lb' + i, l[0], { x: l[2], y: l[3], w: 120, size: 15, font: 'hand', color: '#141210', align: 'center' }));
            x.add(CV.T('lv' + i, l[1], { x: l[2], y: l[3] + 20, w: 120, size: 15, font: 'hand', color: t.accent, align: 'center' }));
          });
        }
        var ti = find(L, 'title');
        if (ti) merge(ti, lay === 'poster' ? { size: 118 } : { x: 46, y: 118, w: cw - 96, size: 118, maxH: 420 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, lay === 'poster' ? { x: W / 2 - 54, y: 24, w: 108, h: 108 } : { x: cw + 96, y: 520, w: 190, h: 190, opacity: .9 });
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

    /* 15 —— 真报纸头版 ------------------------------------ */
    {
      id: 'newspaper', name: '真报纸', sub: '灵感港 · 报头 / 多栏 / 密排',
      t: { ink: '#1e1a16', ink2: '#6f6558', accent: '#b3261e', bgSolid: '#efe7d6' },
      bg: 'radial-gradient(120% 100% at 30% 0%,#f8f2e4 0%,#efe7d6 48%,#e3d8c1 100%)',
      fx: ['paper', 'wrinkle', 'grain', 'vignette'], dark: false,
      title: { font: 'serif', size: 96, lh: 1.04, ls: .01, color: '#1e1a16' },
      decor: function (x) {
        var t = x.t, L = x.L;
        if (x.layout === 'split') return;
        x.add(CV.S('r1', 'bar', { x: 48, y: 96, w: W - 96, h: 3, color: t.ink }));
        x.add(CV.S('r2', 'bar', { x: 48, y: 102, w: W - 96, h: 1, color: t.ink, opacity: .65 }));
        x.add(CV.S('tag', 'rect', { x: 48, y: 30, w: 132, h: 30, color: t.accent }));
        x.add(CV.S('r3', 'bar', { x: 48, y: 424, w: W - 96, h: 1, color: t.ink, opacity: .5 }));
        x.add(CV.T('mast', 'AI   日   报', {
          x: 196, y: 16, w: 620, size: 42, font: 'serif', weight: 700, ls: .14,
          color: t.ink, align: 'left'
        }));
        x.add(CV.T('issue', '第 561 期 · 2026.10.28', {
          x: 830, y: 40, w: 282, size: 13, font: 'mono', ls: .1, color: t.ink2, align: 'right'
        }));
        var body = (x.c.sub || '') + '　' + (x.c.foot || '') + '　' + (x.c.kicker || '') + '　' +
          '每日精选 AI 前沿动态，覆盖模型发布、产品更新、算力与资本动向，为创作者提供可直接使用的选题与判读。　' +
          (x.c.sub || '') + '　' + (x.c.foot || '') + '　' + (x.c.kicker || '') + '　' +
          '本期共收录 22 条资讯，全部经人工核对来源，标注可信度与影响面，便于二次创作时引用。';
        x.add(CV.T('body', body, {
          x: 48, y: 442, w: W - 96, size: 12.5, font: 'serif', weight: 400, lh: 1.82,
          ls: .015, color: '#3a332b', cols: 3, gap: 30, rule: 'rgba(30,26,22,.28)', maxH: 206
        }));
        var ti = find(L, 'title');
        if (ti) merge(ti, { x: 48, y: 128, w: 900, size: 92, align: 'left' });
        var k = find(L, 'kicker');
        if (k) merge(k, { x: 48, y: 72, w: 400, size: 12, color: t.ink2, ls: .1 });
        var s = find(L, 'series');
        if (s) merge(s, { x: 48, y: 32, w: 150, size: 13, font: 'mono', color: '#fdf6e8', ls: .06, align: 'center' });
        var d = find(L, 'date');
        if (d) merge(d, { opacity: 0 });
        var sb = find(L, 'sub');
        if (sb) merge(sb, { x: 48, y: 340, w: 780, size: 17, lh: 1.6, color: '#4a4238' });
        var f = find(L, 'foot');
        if (f) merge(f, { x: 48, y: 656, w: 620, size: 11, color: t.ink2, ls: .1 });
        var ic = find(L, 'icon');
        if (ic) merge(ic, { x: 940, y: 128, w: 172, h: 172 });
      }
    },
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
        x.bgOverride = 'linear-gradient(115deg,' + CV.tint(brand, 0.62) + ' 0%,' + CV.tint(brand, 0.93) + ' 46%,' +
          CV.tint(brand, 0.93) + ' 62%,' + CV.tint(brand, 0.82) + ' 100%)';

        /* 白卡（实测：x 5.5%W, y 26.7%H, 29.4%W × 52.4%H, 圆角 3.75%W） */
        x.add(CV.S('card', 'round', {
          x: Math.round(Wd * 0.055), y: Math.round(Ht * 0.2667),
          w: Math.round(Wd * 0.2938), h: Math.round(Ht * 0.5244),
          color: t.card, radius: Math.round(Wd * 0.0375),
          shadow: '0 22px 44px -26px rgba(120,60,40,.35)'
        }));

        if (lay === 'poster') {
          var icp = find(L, 'icon');
          if (icp) merge(icp, { x: Math.round(Wd / 2 - Wd * 0.0844), y: Math.round(Ht * 0.30), w: Math.round(Wd * 0.169), h: Math.round(Wd * 0.169) });
          var tp = find(L, 'title');
          if (tp) merge(tp, { x: Math.round(Wd * 0.08), y: Math.round(Ht * 0.60), w: Math.round(Wd * 0.84), align: 'center', size: Math.round(Wd * 0.062), color: brand });
          ['date', 'series', 'rule', 'foot', 'footline'].forEach(function (r) { var l = find(L, r); if (l) l.opacity = 0; });
          var kp = find(L, 'kicker');
          if (kp) merge(kp, { x: Math.round(Wd * 0.08), y: Math.round(Ht * 0.55), w: Math.round(Wd * 0.84), align: 'center', size: Math.round(Wd * 0.0188), color: t.ink2 });
          return;
        }

        /* 左上白圈（实测：中心 8.4%W, 14.1%H，直径 4.9%W） */
        var d0 = Math.round(Wd * 0.0488);
        x.add(CV.S('dot0', 'circle', {
          x: Math.round(Wd * 0.0844 - d0 / 2), y: Math.round(Ht * 0.1411 - d0 / 2), w: d0, h: d0,
          color: '#ffffff', bw: 2, bc: 'rgba(255,255,255,.9)',
          shadow: '0 6px 16px -6px rgba(150,80,55,.35)'
        }));

        /* 右上 pill（实测：x 82.6%W, y 5.6%H, 12.5%W × 5.6%H；实心品牌色 + 白字） */
        var pw = Math.round(Wd * 0.125), ph = Math.round(Ht * 0.0556);
        x.add(CV.S('pill', 'round', { x: Math.round(Wd * 0.826), y: Math.round(Ht * 0.0556), w: pw, h: ph, color: brand, radius: 999 }));
        x.add(CV.T('pilltext', 'AI 快讯', {
          x: Math.round(Wd * 0.826), y: Math.round(Ht * 0.0556 + ph * 0.24), w: pw,
          size: Math.round(Wd * 0.0138), font: 'bold', weight: 700, color: '#ffffff', align: 'center', ls: .01
        }));

        /* focus 行（实测：x 40%W, y 29.8%H, 30px@1600） */
        var k = find(L, 'kicker');
        if (k) merge(k, {
          x: Math.round(Wd * 0.40), y: Math.round(Ht * 0.298), w: Math.round(Wd * 0.55),
          size: Math.round(Wd * 0.0188), font: 'bold', weight: 700, ls: .06,
          color: CV.tint(brand, 0.18), upper: false
        });

        /* 标题（实测：x 40%W, y 36.7%H, 字号 7.5%W, lh 1.04） */
        var ti = find(L, 'title');
        if (ti) merge(ti, {
          x: Math.round(Wd * 0.40), y: Math.round(Ht * 0.367), w: Math.round(Wd * 0.56),
          size: Math.round(Wd * 0.075), font: 'heavy', weight: 900, lh: 1.04, ls: -.01,
          color: brand, fit: false, maxH: 0
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
    }
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
      v: CV.VERSION, w: RT.w, h: RT.h, ratio: RT.id, master: MAST, style: p.id, layout: lay,
      bg: ctx.bgOverride || p.bg, fx: (p.fx || []).slice(), dark: !!p.dark, brand: ctx.brand,
      paper: { on: false, opacity: 80, noise: 60, scale: 260 },
      tokens: CV.clone(t), content: c,
      layers: under.filter(Boolean).concat(L.filter(Boolean))
    };
  };
})();
