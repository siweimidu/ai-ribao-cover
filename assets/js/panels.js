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
    p.appendChild(group('风格预设 · 11 套', grid));

    var lays = el('div', 'layouts');
    lays.id = 'layoutGrid';
    p.appendChild(group('版式', lays));


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
      var img = document.createElement('img');
      img.src = variantURL(v.rep.id, v.rep.variant, App.doc.dark);
      img.alt = v.vendor;
      img.draggable = false;
      tile.appendChild(img);
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
          App.addLayer(it[1](t), true);
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
    var gl = el('label'); gl.appendChild(el('span', null, '渐变'));
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
      b.style.border = '1px solid rgba(0,0,0,.08)';
      b.addEventListener('click', function () {
        App.setBg('linear-gradient(135deg,' + g[1][0] + ' 0%,' + g[1][1] + ' 55%,' + g[1][2] + ' 100%)', true);
        App.toast('背景：' + g[0] + '渐变', 'ok');
      });
      grow.appendChild(b);
    });
    g2.appendChild(grow);

    /* ---- 自定义纯色 ---- */
    var cl = el('div', 'field');
    var clb = el('label'); clb.appendChild(el('span', null, '自定义底色'));
    cl.appendChild(clb);
    var crow = el('div', 'chiprow');
    var cIn = document.createElement('input');
    cIn.type = 'color';
    cIn.value = '#eef2ff';
    cIn.style.width = '46px'; cIn.style.height = '30px'; cIn.style.padding = '0'; cIn.style.border = '0';
    cIn.addEventListener('input', function () { App.setBg(cIn.value, false); });
    cIn.addEventListener('change', function () { App.setBg(cIn.value, true); });
    crow.appendChild(cIn);
    var cHint = el('span', 'hint', '直接调色');
    crow.appendChild(cHint);
    cl.appendChild(crow);
    g2.appendChild(cl);

    /* ---- 自定义渐变 ---- */
    var gl2 = el('div', 'field');
    var glb = el('label'); glb.appendChild(el('span', null, '自定义渐变'));
    var gv = el('span', 'hint', '135°');
    glb.appendChild(gv);
    gl2.appendChild(glb);
    var g2row = el('div', 'chiprow');
    var c1 = document.createElement('input'); c1.type = 'color'; c1.value = '#e8f0ff';
    var c2 = document.createElement('input'); c2.type = 'color'; c2.value = '#f8ecf3';
    [c1, c2].forEach(function (x) {
      x.style.width = '46px'; x.style.height = '30px'; x.style.padding = '0'; x.style.border = '0';
      g2row.appendChild(x);
    });
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
    var up = el('button', 'btn');
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
      var rm = el('button', 'btn');
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
    n1.textContent = '把选中元素整齐排成表格，自动居中（左键拖框选全部 / 中键拖只选图标）';
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
    var tip = el('p', 'empty', '点列数就立即重排，不用再点按钮');
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
      App.rotateSelTo(parseFloat(r4.value));
    });
    r4.addEventListener('change', function () { App.commit(); });
    wrap4.appendChild(r4); wrap4.appendChild(v4);
    f4.appendChild(wrap4);
    rb.appendChild(f4);
    out.push(group('整体旋转', rb));
    return out;
  }

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
