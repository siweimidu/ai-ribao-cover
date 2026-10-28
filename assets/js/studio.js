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
    var c = App.content();
    var doc = CV.compose(App.doc.style, App.doc.layout, c, RT.id);
    doc.id = App.doc.id;
    App.doc = doc;
    App.sel = null;
    App.pushHist();
    App.apply();
    saveLocal();
    App.toast('画幅：' + RT.name + ' · ' + RT.w + '×' + RT.h, 'ok');
  };
  App.recompose = function (opts) {
    opts = opts || {};
    var content = opts.content || App.content();
    var doc = CV.compose(opts.style || App.doc.style, opts.layout || App.doc.layout, content, opts.ratio || App.doc.ratio);
    doc.id = App.doc.id;
    App.doc = doc; App.sel = null;
    App.pushHist(); App.apply(); saveLocal();
  };

  App.apply = function () {
    if (App.editing) return;
    var host = $('#cover');
    var out = CV.render(App.doc, host, { edit: true });
    App.map = out.map;
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

  App.select = function (id) {
    App.sel = id;
    drawSel();
    if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
  };
  App.deselect = function () { App.select(null); };

  function drawSel() {
    var host = $('#selLayer');
    if (!host) return;
    host.innerHTML = '';
    var l = App.selLayer();
    if (!l) return;
    var el = App.map[l.id];
    if (!el) return;
    var box = document.createElement('div');
    box.className = 'sel';
    box.style.left = el.offsetLeft + 'px';
    box.style.top = el.offsetTop + 'px';
    box.style.width = el.offsetWidth + 'px';
    box.style.height = el.offsetHeight + 'px';
    if (l.rot) box.style.transform = 'rotate(' + l.rot + 'deg)';
    var tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = (l.role || l.type) + ' · ' + Math.round(l.w) + ' × ' + Math.round(el.offsetHeight);
    box.appendChild(tag);
    ['nw', 'ne', 'sw', 'se'].forEach(function (k) {
      if (l.type === 'text' && (k === 'nw' || k === 'sw')) return;
      var h = document.createElement('div');
      h.className = 'h';
      h.dataset.h = k;
      h.addEventListener('pointerdown', function (e) { startResize(e, k); });
      box.appendChild(h);
    });
    host.appendChild(box);
  }
  App.drawSel = drawSel;
  /* ---------------- 画布交互 ---------------- */
  function bindStage(root) {
    if (root._bound) return;
    root._bound = true;
    root.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var el = e.target.closest ? e.target.closest('.cv-el') : null;
      if (!el) { App.deselect(); return; }
      var l = App.getLayer(el.dataset.id);
      if (!l) return;
      App.select(l.id);
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
      if (!App.gdragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (root._drop) root._drop.classList.add('on');
    });
    root.addEventListener('dragleave', function () { if (root._drop) root._drop.classList.remove('on'); });
    root.addEventListener('drop', function (e) {
      if (root._drop) root._drop.classList.remove('on');
      var icon = e.dataTransfer.getData('text/cv-icon');
      if (!icon) return;
      e.preventDefault();
      var r = root.getBoundingClientRect();
      var x = (e.clientX - r.left) / App.zoom - 90;
      var y = (e.clientY - r.top) / App.zoom - 90;
      App.addLayer(CV.I('icon', icon, { x: Math.round(x), y: Math.round(y), w: 180, h: 180 }), true);
      App.commit();
      App.toast('已放入 ' + CV.iconLabel(icon), 'ok');
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
    var sx = e.clientX, sy = e.clientY, ox = l.x, oy = l.y, moved = false, z = App.zoom;
    function move(ev) {
      var dx = (ev.clientX - sx) / z, dy = (ev.clientY - sy) / z;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 1.5) return;
      moved = true;
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
      showGuides([]);
      if (moved) { App.commit(); if (window.Panels) Panels.syncInspector(); }
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
    var sx = e.clientX, sy = e.clientY, z = App.zoom;
    var o = { x: l.x, y: l.y, w: l.w, h: l.h || el.offsetHeight };
    var ratio = o.w ? o.h / o.w : 1;
    function move(ev) {
      var dx = (ev.clientX - sx) / z, dy = (ev.clientY - sy) / z;
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
      App.apply();
      App.commit();
      if (window.Panels) Panels.syncInspector();
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
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

  /* ---------------- 图层操作 ---------------- */
  App.commit = function () { App.pushHist(); saveLocal(); };
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
    var l = App.selLayer(); if (!l) return;
    App.doc.layers = App.doc.layers.filter(function (x) { return x.id !== l.id; });
    App.sel = null; App.apply(); App.commit(); App.toast('已删除');
  };
  App.duplicate = function () {
    var l = App.selLayer(); if (!l) return;
    var c = JSON.parse(JSON.stringify(l));
    c.id = CV.uid(l.type.charAt(0));
    c.x += 24; c.y += 24;
    App.addLayer(c, true);
    App.toast('已复制图层');
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
    var l = App.selLayer(); if (!l) return;
    l.x += dx; l.y += dy;
    var el = App.map[l.id];
    if (el) { el.style.left = l.x + 'px'; el.style.top = l.y + 'px'; }
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
  App.boot = function () {
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