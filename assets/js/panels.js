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
        $$('.sw-btn', sw).forEach(function (x) { x.classList.remove('on'); });
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
    hx.className = 'hex'; hx.value = value;
    ci.addEventListener('input', function () { hx.value = ci.value; onpick(ci.value); });
    hx.addEventListener('change', function () {
      var v = hx.value.trim();
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) onpick(v);
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
      nm.innerHTML = CV.esc(s.name) + '<small>' + CV.esc(s.sub) + '</small>';
      b.appendChild(sw); b.appendChild(nm);
      b.addEventListener('click', function () {
        App.recompose({ style: s.id });
        App.toast('已切换：' + s.name, 'ok');
      });
      grid.appendChild(b);
    });
    p.appendChild(group('风格预设 · 11 套', grid));

    var lays = el('div', 'layouts');
    CV.LAYOUTS.forEach(function (l) {
      var b = el('button', 'lay');
      var bars = l.id === 'hero' ? [[0, 0, 60, 34], [60, 8, 38, 18]]
        : l.id === 'poster' ? [[16, 30, 68, 14], [30, 48, 40, 8]]
          : l.id === 'split' ? [[0, 0, 100, 18], [0, 22, 58, 34]]
            : [[0, 20, 46, 40], [52, 8, 46, 52]];
      b.style.gridTemplateRows = '1fr 1fr';
      bars.forEach(function (r2) {
        var d = el('b');
        d.style.cssText = 'grid-column:1/-1;opacity:' + (r2[3] > 20 ? 0.95 : 0.55);
        b.appendChild(d);
      });
      b.title = l.name;
      b.dataset.layout = l.id;
      b.addEventListener('click', function () { App.recompose({ layout: l.id }); });
      lays.appendChild(b);
    });
    p.appendChild(group('版式', lays));

    var note = el('div', 'note');
    note.innerHTML = '<b>换风格不丢文案</b>：先从「内容」填一次，之后随时切风格/版式，文字会自动带过去。';
    p.appendChild(note);
  }

  /* ---------- 图标库（按公司分组 · 全变体 · 左键拖拽 · 右键弹窗） ---------- */
  var GROUPS = [];

  var V_ORDER = ['symbol-color', 'symbol-black', 'symbol-white', 'symbol-trans-color', 'symbol-trans-black',
    'appicon', 'appicon-trans', 'tile-light', 'tile-dark', 'tile-light-app', 'tile-dark-app',
    'wordmark-color', 'wordmark-black', 'wordmark-white'];
  function vRank(v) { var i = V_ORDER.indexOf(v); return i < 0 ? 90 : i; }

  function buildIconPane() {
    var p = $('#paneIcons');
    p.innerHTML = '';
    var sc = el('div', 'icsearch');
    sc.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    var si = input('', function (v) { renderIcons(v); });
    si.id = 'iconSearchInput';
    si.placeholder = '搜品牌：kimi / claude / 智谱 / 豆包';
    sc.appendChild(si);
    p.appendChild(sc);
    var bar = el('div', 'icbar');
    var cnt = el('span', 'iccount', '');
    cnt.id = 'iconCount';
    bar.appendChild(cnt);
    bar.appendChild(el('span', 'ichint', '左键拖入画布 · 右键看全部变体'));
    p.appendChild(bar);
    var list = el('div', 'iclist');
    list.id = 'iconList';
    p.appendChild(list);
  }

  function variantURL(id, v, dark) { return CV.iconSrc(id + '#' + v, dark); }

  function renderIcons(q) {
    var host = $('#iconList');
    if (!host) return;
    host.innerHTML = '';
    var kw = (q || '').toLowerCase().trim();
    var hits = GROUPS.filter(function (g) { return !kw || g.kw.indexOf(kw) > -1; });
    var cnt = $('#iconCount');
    if (cnt) {
      var n = 0;
      hits.forEach(function (g) { n += g.variants.length; });
      cnt.textContent = hits.length + ' 个模型 · ' + n + ' 个图标';
    }
    if (!hits.length) { host.appendChild(el('p', 'empty', '没有匹配的品牌')); return; }
    var frag = document.createDocumentFragment();
    hits.slice(0, 80).forEach(function (g) { frag.appendChild(groupRow(g)); });
    host.appendChild(frag);
  }

  function groupRow(g) {
    var box = el('div', 'icg');
    var head = el('div', 'icg-h');
    head.appendChild(el('span', 'icg-n', g.product));
    head.appendChild(el('span', 'icg-s', g.variants.length + ' 变体'));
    head.appendChild(el('span', 'icg-v', g.vendor));
    box.appendChild(head);
    var row = el('div', 'icg-b');
    g.variants.forEach(function (v) {
      var t = el('div', 'ictile');
      t.draggable = true;
      t.title = g.vendor + ' / ' + g.product + ' · ' + v + ' — 拖入画布，或右键查看';
      var img = document.createElement('img');
      img.src = variantURL(g.id, v, App.doc.dark);
      img.alt = v;
      img.draggable = false;
      t.appendChild(img);
      t.appendChild(el('span', 'itl', v.replace(/^(symbol|tile|wordmark|appicon)-?/, '').replace(/-(app)$/, '') || 'logo'));
      t.addEventListener('dragstart', function (e) {
        App.gdragging = true;
        e.dataTransfer.setData('text/cv-icon', g.id + '#' + v);
        e.dataTransfer.effectAllowed = 'copy';
      });
      t.addEventListener('dragend', function () { App.gdragging = false; });
      t.addEventListener('click', function () { placeIcon(g.id + '#' + v, 'main'); });
      t.addEventListener('contextmenu', function (e) { e.preventDefault(); openVariants(g, e.clientX, e.clientY, v); });
      row.appendChild(t);
    });
    box.appendChild(row);
    return box;
  }

  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function openVariants(g, x, y, cur) {
    closePop();
    pop = el('div', 'icpop');
    var head = el('div', 'icpop-h');
    head.innerHTML = '<b>' + CV.esc(g.product) + '</b><span>' + CV.esc(g.vendor) + ' · ' + g.variants.length + ' 个变体</span>';
    pop.appendChild(head);
    var grid = el('div', 'icpop-g');
    g.variants.forEach(function (v) {
      var b = el('button', 'icpop-i' + (v === cur ? ' on' : ''));
      b.type = 'button';
      b.title = v;
      var im = document.createElement('img');
      im.src = variantURL(g.id, v, App.doc.dark);
      b.appendChild(im);
      b.appendChild(el('span', null, v));
      b.draggable = true;
      b.addEventListener('dragstart', function (e) {
        App.gdragging = true;
        e.dataTransfer.setData('text/cv-icon', g.id + '#' + v);
        e.dataTransfer.effectAllowed = 'copy';
      });
      b.addEventListener('click', function () { placeIcon(g.id + '#' + v, 'main'); closePop(); });
      grid.appendChild(b);
    });
    pop.appendChild(grid);
    var acts = el('div', 'icpop-a');
    var key = cur || g.variants[0];
    var a1 = el('button', 'btn sm', '设为主视觉');
    a1.type = 'button';
    a1.addEventListener('click', function () { placeIcon(g.id + '#' + key, 'main'); closePop(); });
    var a2 = el('button', 'btn sm', '插入为新图层');
    a2.type = 'button';
    a2.addEventListener('click', function () { placeIcon(g.id + '#' + key, 'layer'); closePop(); });
    acts.appendChild(a1); acts.appendChild(a2);
    pop.appendChild(acts);
    document.body.appendChild(pop);
    var w = pop.offsetWidth || 340, h = pop.offsetHeight || 260;
    pop.style.left = Math.max(8, Math.min(x, window.innerWidth - w - 12)) + 'px';
    pop.style.top = Math.max(8, Math.min(y, window.innerHeight - h - 12)) + 'px';
    setTimeout(function () { document.addEventListener('pointerdown', onDoc, true); }, 0);
    function onDoc(ev) {
      if (pop && !pop.contains(ev.target)) {
        closePop();
        document.removeEventListener('pointerdown', onDoc, true);
      }
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

  /* ---------- 检查器 ---------- */
  function syncInspector() {
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
      return;
    }
    var patch = function (o) { App.updateSel(o); };
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
    var list = el('div', 'layerlist');
    App.doc.layers.slice().reverse().forEach(function (l) {
      var r = el('div', 'lrow' + (l.id === App.sel ? ' on' : '') + (l.hidden ? ' hid' : ''));
      var ty = el('span', 'ty', l.type === 'text' ? 'T' : l.type === 'icon' ? '◉' : l.type === 'shape' ? '◼' : '✦');
      var tx = el('span', 'tx', (l.role || l.type) + ' · ' + (l.type === 'text' ? CV.plain(l.text).replace(/\n/g, ' ').slice(0, 18) : l.type === 'icon' ? CV.iconLabel(l.icon) : (l.shape || 'graphic')));
      var eye = el('span', 'eye', l.hidden ? '○' : '●');
      eye.style.cursor = 'pointer';
      eye.addEventListener('click', function (e) {
        e.stopPropagation();
        l.hidden = !l.hidden;
        App.apply(); App.commit();
      });
      r.appendChild(ty); r.appendChild(tx); r.appendChild(eye);
      r.addEventListener('click', function () { App.select(l.id); switchTab('props', true); });
      list.appendChild(r);
    });
    p.appendChild(group('图层 · ' + App.doc.layers.length, list));
    var note = el('div', 'note');
    note.innerHTML = '自上而下＝前后叠放顺序（最上面的最先绘制在底层）。';
    p.appendChild(note);
  }

  function syncStyles() {
    $$('.style-card').forEach(function (b) { b.classList.toggle('on', b.dataset.style === App.doc.style); });
    $$('.lay').forEach(function (b) { b.classList.toggle('on', b.dataset.layout === App.doc.layout); });
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

    buildContentPane();
    buildStylePane();
    buildIconPane();

    $('#btnUndo').addEventListener('click', function () { App.undo(); });
    $('#btnRedo').addEventListener('click', function () { App.redo(); });
    $('#btnPng').addEventListener('click', function () { App.exportPng(2); });
    $('#btnJson').addEventListener('click', function () { App.exportJson(); });
    $('#btnImport').addEventListener('click', function () { $('#fileInput').click(); });
    $('#fileInput').addEventListener('change', function (e) {
      if (e.target.files[0]) App.importJson(e.target.files[0]);
      e.target.value = '';
    });
    $('#btnAi').addEventListener('click', openAiModal);
    $('#btnFit').addEventListener('click', function () { App.fitZoom(); App.drawSel(); });
    $$('#scaleSeg button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#scaleSeg button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        App.exportPng(parseInt(b.dataset.scale, 10));
      });
    });

    fetch('assets/icons.json').then(function (r) { return r.json(); }).then(function (j) {
      ICONS = j.items || [];
      GROUPS = ICONS.map(function (it) {
        return {
          id: it.id, vendor: it.vendor, product: it.product, kw: it.kw,
          variants: it.variants.slice().sort(function (a, b) { return vRank(a) - vRank(b); })
        };
      });
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
  }

  window.Panels = {
    init: init, afterBoot: afterBoot,
    syncInspector: syncInspector, syncLayers: syncLayers, syncStyles: syncStyles,
    syncHist: syncHist, showShot: showShot, commit: function () { if (App) App.commit(); },
    smartParse: smartParse
  };
})();
