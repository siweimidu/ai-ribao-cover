/* studio core part 1 */
(function () {
  var CV = window.CV;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var App = { doc: null, sel: null, zoom: 1, hist: [], hi: -1, editing: false, map: {}, locked: false };
  window.App = App;

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
      var r = el.getBoundingClientRect();
      if (r.width > 2 && l.w > 2) return l.w / r.width;
      if (r.height > 2 && (l.h || 0) > 2) return l.h / r.height;
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
    if (App.hi <= 0) return;
    App.hi--; App.doc = JSON.parse(App.hist[App.hi]); App.sel = null; App.apply(); saveLocal();
    if (window.Panels) Panels.syncHist();
    App.toast('已撤销');
  };
  App.redo = function () {
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
    App.doc = doc; App.sel = null;
    App.pushHist(); App.apply(); saveLocal();
  };

  App.apply = function () {
    if (App.editing) return;
    var host = $('#cover');
    var out = CV.render(App.doc, host, { edit: true });
    App.map = out.map;
    App.root = out.root;
    bindStage(out.root);
    App.fitZoom();
    drawSel();
    if (window.Panels) {
      if (!App.suppress) Panels.syncInspector();
      Panels.syncLayers();
      Panels.syncStyles();
    }
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

  function drawSel() {
    var host = $('#selLayer');
    if (!host) return;
    host.innerHTML = '';
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
      var el = e.target.closest ? e.target.closest('.cv-el') : null;
      if (!el) {
        /* Figma：空白处左键拖动 = 框选（Shift 追加） */
        if (!e.shiftKey) App.deselect();
        startMarquee(e, e.shiftKey, false);
        return;
      }
      var l = App.getLayer(el.dataset.id);
      if (!l) return;
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
    var group = null;
    if (App.multi.length > 1 && App.multi.indexOf(l.id) > -1) {
      group = App.selSet().map(function (x) { return { id: x.id, x: x.x, y: x.y }; });
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
      var sn = ev.altKey ? null : snapPos(nx, ny, l);
      if (sn) { nx = sn.x; ny = sn.y; showGuides(sn.guides); }
      l.x = Math.round(nx); l.y = Math.round(ny);
      el.style.left = l.x + 'px'; el.style.top = l.y + 'px';
      drawSel();
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.body.classList.remove('cv-dragging');
      showGuides([]);
      if (moved) {
        if (group) { App.apply(); App.toast('已移动 ' + group.length + ' 个图层'); }
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
  App.gridArrange = function (cols, gap) {
    var set = App.selSet();
    if (set.length < 2) {
      /* 没框选就直接排布：按 Figma 习惯退回「全部可见图层」，并说明 */
      var all = App.doc.layers.filter(function (l) { return !l.hidden; });
      if (all.length < 2) { App.toast('画布上不足 2 个图层', 'err'); return; }
      App.selectMany(all.map(function (l) { return l.id; }));
      set = App.selSet();
      App.toast('未框选，已对全部 ' + set.length + ' 个图层排布');
    }
    gap = gap == null ? 32 : gap;
    var n = cols === 'auto' ? Math.ceil(Math.sqrt(set.length)) : parseInt(cols, 10);
    n = Math.max(1, Math.min(n, set.length));
    var rows = Math.ceil(set.length / n);
    try { console.log('[grid] n=' + n + ' rows=' + rows + ' set=' + set.length + ' gap=' + gap); } catch (e) { }
    var M = 64;                                   /* 设计边距 */
    var availW = App.doc.w - M * 2;
    var availH = App.doc.h - M * 2;
    /* 关键：格子按画布均分，而不是按最宽的元素 —— 否则一张全宽色带就会把整张网格推出画布 */
    var colW = Math.max(24, (availW - gap * (n - 1)) / n);
    var rowH = Math.max(24, (availH - gap * (rows - 1)) / rows);
    set.forEach(function (l, i) {
      var el2 = App.map[l.id];
      var h = l.type === 'text' ? (el2 ? el2.offsetHeight : 0) : (l.h || 0);
      var w = l.w || 0;
      var c = i % n, r = Math.floor(i / n);
      var cellX = M + c * (colW + gap);
      var cellY = M + r * (rowH + gap);
      var x = cellX + (w <= colW ? (colW - w) / 2 : 0);
      var y = cellY + (h <= rowH ? (rowH - h) / 2 : 0);
      l.x = Math.round(Math.max(M, Math.min(x, App.doc.w - M - Math.min(w, availW))));
      l.y = Math.round(Math.max(M, Math.min(y, App.doc.h - M - Math.min(h, availH))));
    });
    App.apply(); App.commit();
    App.toast('已排成 ' + n + ' 列 × ' + rows + ' 行（' + set.length + ' 个图层）', 'ok');
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
  App.BUILD = '20261029-f13';
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