/* studio core part 1 */
(function () {
  var CV = window.CV;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var App = { doc: null, sel: null, zoom: 1, hist: [], hi: -1, editing: false, map: {}, locked: false };
  window.App = App;

  /* 鍛戒腑鍏滃簳锛氭病鐐瑰埌鍥惧眰鏃舵寜 7px 瀹瑰樊鎵炬渶杩戠殑锛堢粏闀挎潯 / 1px 绾夸笓鐢級 */
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

  /* 鍛戒腑鏍堬細浠庨《鍒板簳鍒楀嚭鐩栦綇璇ョ偣鐨勫浘灞傦紱缁嗙嚎锛堝睆骞曞鎴栭珮 <=6px锛夐澶栫粰 5px 瀹瑰樊 */
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
    return out.reverse();   /* 椤跺眰鍦ㄥ墠 */
  }
  /* 鍙栫偣涓婄殑鍥惧眰锛氱粏绾夸紭鍏堬紱deep=true 鏃朵粠褰撳墠閫変腑寰€涓嬭疆涓€涓紙Figma 鐨?Ctrl 娣遍€夛級 */
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
  /* 鎷栨嫿鐘舵€佹竻鐞嗭細pointerup 涓㈠け / 鍒囩獥鍙?/ 澶辩劍鏃跺厹搴曪紝閬垮厤姘歌繙銆屾嫋涓嶅姩銆?*/
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
  /* 浠讳綍鏂扮殑鎸変笅閮藉厛娓呬竴娆″巻鍙茬姸鎬?*/
  document.addEventListener('pointerdown', function () { 
    document.body.classList.remove('marquee-drag');
  }, true);

  /* 鐪熷疄缂╂斁锛氶噺娓叉煋瀹?/ CSS 瀹藉弽鎺紝transform / zoom / 鏀瑰搴﹂兘鍑?*/
  function stageScale() {
    var cv = App.root || document.querySelector('#cover .cv');
    if (!cv) return App.zoom || 1;
    var w = cv.getBoundingClientRect().width;
    var dw = cv.offsetWidth || (App.doc && App.doc.w) || w;
    return (w > 0 && dw > 0) ? w / dw : (App.zoom || 1);
  }
  App.stageScale = stageScale;

  /* 灞忓箷鍍忕礌 鈫?璁捐鍗曚綅锛氱敤鍥惧眰鑷韩娓叉煋瀹藉弽鎺紝鍐呭琚缉鏀句篃涓嶄細鍋?*/
  function screenToDoc(el, l) {
    /* 涓?style 鍐欏叆涓ユ牸浜掗€嗭細style = M.x(l.x)锛屽睆骞?= style * stageScale */
    try {
      var M = CV.metrics(App.doc);
      var s = stageScale();
      if (s > 0 && M.k > 0) {
        var y0 = (l && l.y) || 0;
        var dyDoc = Math.abs(M.y(y0 + 1) - M.y(y0)) || M.k;   /* y 鏂瑰悜鏄垎娈电嚎鎬э紝鍙栧眬閮ㄦ枩鐜?*/
        return { x: 1 / (M.k * s), y: 1 / (dyDoc * s) };
      }
    } catch (e) { }
    var s2 = stageScale();
    var k2 = s2 > 0 ? 1 / s2 : 1;
    return { x: k2, y: k2 };
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
    if (!App.hist || App.hist.length < 2) { App.toast('娌℃湁鍙挙閿€鐨勬楠?); return false; }
    if (App.hi <= 0) return;
    App.hi--; App.doc = JSON.parse(App.hist[App.hi]); App.sel = null; App.apply(); saveLocal();
    if (window.Panels) Panels.syncHist();
    App.toast('宸叉挙閿€');
  };
  App.redo = function () {
    if (!App.future || !App.future.length) { App.toast('娌℃湁鍙噸鍋氱殑姝ラ'); return false; }
    if (App.hi >= App.hist.length - 1) return;
    App.hi++; App.doc = JSON.parse(App.hist[App.hi]); App.sel = null; App.apply(); saveLocal();
    if (window.Panels) Panels.syncHist();
    App.toast('宸查噸鍋?);
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
    App.toast('鐢诲箙锛? + RT.name + ' 路 ' + RT.w + '脳' + RT.h, 'ok');
  };
  App.recompose = function (opts) {
    opts = opts || {};
    var content = opts.content || App.content();
    var keep = App.doc.layers.filter(function (l) { return l.type === 'image' && l.role === 'bg'; });
    var doc = CV.compose(opts.style || App.doc.style, opts.layout || App.doc.layout, content, opts.ratio || App.doc.ratio);
    if (keep.length) doc.layers = keep.concat(doc.layers);
    doc.id = App.doc.id;
    doc.brand = App.doc.brand;   /* 淇濈暀閲囨牱鍒扮殑鍝佺墝鑹?*/
    App.doc = doc; App.sel = null;
    App.pushHist(); App.apply(); saveLocal();
  };

  /* 绾哥汗瀹炴椂棰勮锛氭嫋婊戝潡鏃跺彧鏀?fx 鐨勫唴鑱旀牱寮忥紝闆堕噸缁?*/
  /* 鑳屾櫙锛氱函鑹?/ 娓愬彉锛堝疄鏃堕瑙堬紝鏉炬墜鎵嶈繘鎾ら攢鏍堬級 */
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
  /* 涓婁紶鍥剧墖 -> 鍘嬬缉鍒?1920 瀹戒互鍐咃紝瀛?dataURL */
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
    if (on !== hasPaper) { App.apply(); return; }      /* 寮€鍏崇姸鎬佸彉鍖栨墠闇€瑕侀噸寤?*/
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

  /* 缃戞牸闂磋窛瀹炴椂棰勮锛氱洿鎺ユ尓 DOM锛屼笉鏁村睆閲嶇粯 */
  App.gridLive = function (cols, gap) {
    var pk = App.iconSet();
    var set = pk.list;
    if (!set.length) { App.gridArrange(cols, gap); return; }
    App.gridPlace(set, cols, gap);
    var ML = CV.metrics(App.doc);
    set.forEach(function (l) {
      var el = App.map[l.id];
      if (el) { el.style.left = ML.x(l.x) + 'px'; el.style.top = ML.y(l.y) + 'px'; }
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
      if (bs && CV.STYLES) bs.textContent = 'COVER STUDIO 路 ' + CV.STYLES.length + ' STYLES';
    })();
    if (window.Panels) {
      if (!App.suppress) Panels.syncInspector();
      Panels.syncLayers();
      Panels.syncStyles();
    }
  };
  /* 浠庝富瑙嗚鍥炬爣鍙栧搧鐗岃壊锛屽鍒拌儗鏅笌鏍囬涓婏紙鍙敼棰滆壊锛屼笉鍔ㄧ増寮忥級 */
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
    if (App.multi.length) App.toast('宸叉閫?' + App.multi.length + ' 涓浘灞?, 'ok');
  };
  App.selectAll = function () {
    App.multi = App.doc.layers.filter(function (l) { return !l.hidden; }).map(function (l) { return l.id; });
    App.sel = App.multi[App.multi.length - 1] || null;
    drawSel();
    if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
  };

  /* 鍙傝€冪嚎甯告樉锛氫腑绾?/ 涓夊垎绾?/ 瀹夊叏鍖猴紙鍙敾鍦ㄧ紪杈戝櫒瑕嗙洊灞傦紝涓嶈繘鍑哄浘锛?*/
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

  /* 閫変腑鍦嗛樀鎴愬憳鏃讹紝杩斿洖鏁寸粍鍖呭洿鐩掞紙璁╁妗嗗寘浣忔暣缁勫苟璺熸墜锛?*/
  /* 鐢ㄦ垚鍛樺厓绱犵殑灞忓箷鐭╁舰鎹㈢畻鎴愯鐩栧眰鍧愭爣锛堣鐩栧眰涓庣敾甯冨悓涓?doc 鍍忕礌锛?*/
  function unionRectInStage(ids) {
    var root = App.root; if (!root) return null;
    var rr = root.getBoundingClientRect(), s = stageScale() || 1;
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    ids.forEach(function (id) {
      var el = App.map[id]; if (!el) return;
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
      x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
    });
    if (!isFinite(x0)) return null;
    return { x: (x0 - rr.left) / s, y: (y0 - rr.top) / s, w: (x1 - x0) / s, h: (y1 - y0) / s };
  }

  function clusterSelBounds() {
    /* 鍙敤鐪熷疄瀛樺湪鐨勫渾闃垫垚鍛橈紙cring_ 鐜?+ 瀵瑰簲鍥炬爣锛夌殑褰撳墠鍧愭爣锛屼笉鐢ㄥ巻鍙?base */
    var ids = clusterMembers().map(function (l) { return l.id; });
    if (ids.length < 2) return null;
    var sel = (App.multi && App.multi.length) ? App.multi : (App.sel ? [App.sel] : []);
    if (!sel.length) return null;
    var hit = false;
    sel.forEach(function (id) { if (ids.indexOf(id) > -1) hit = true; });
    if (!hit) return null;
    var b = { x: 1e9, y: 1e9, x2: -1e9, y2: -1e9 };
    ids.forEach(function (id) {
      var l = App.getLayer(id); if (!l) return;
      var e2 = App.map[id];
      var h = l.type === 'text' ? (e2 ? e2.offsetHeight : l.h || 0) : (l.h || l.w || (e2 ? e2.offsetHeight : 0));
      b.x = Math.min(b.x, l.x); b.y = Math.min(b.y, l.y);
      b.x2 = Math.max(b.x2, l.x + (l.w || 0)); b.y2 = Math.max(b.y2, l.y + h);
    });
    var ur = unionRectInStage(ids);
    if (!ur) return null;
    ur.n = ids.length;
    return ur;
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
      var ur2 = unionRectInStage(set.map(function (l) { return l.id; })) || { x: b.x, y: b.y, w: 0, h: 0 };
      var box = document.createElement('div');
      box.className = 'sel secondary';
      box.style.left = ur2.x + 'px'; box.style.top = ur2.y + 'px';
      box.style.width = ur2.w + 'px'; box.style.height = ur2.h + 'px';
      var tg = document.createElement('div');
      tg.className = 'tag';
      tg.textContent = set.length + ' 涓浘灞?路 Esc 鍙栨秷';
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
        tag.textContent = (set.length > 1 ? set.length + ' 涓?路 ' : '') + (l.role || l.type) + ' 路 ' +
          Math.round(l.w) + ' 脳 ' + Math.round(el2.offsetHeight);
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
    selInfoEl.innerHTML = '<b>宸查€?' + set.length + ' 涓浘灞?/b>' +
      '<span>涓婚€夛細' + CV.esc((l && (l.role || l.type)) || '-') + '</span>' +
      '<button type="button">鍙栨秷閫夋嫨 (Esc)</button>';
    selInfoEl.querySelector('button').addEventListener('click', function () { App.deselect(); });
    selInfoEl.classList.add('on');
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Alt') document.body.classList.add('alt-down'); });
  document.addEventListener('keyup', function (e) { if (e.key === 'Alt') document.body.classList.remove('alt-down'); });
  window.addEventListener('blur', function () { document.body.classList.remove('alt-down'); });
  /* ---------------- 鐢诲竷浜や簰 ---------------- */
  function bindStage(root) {
    if (root._bound) return;
    root._bound = true;
    /* 涓敭锛氫换鎰忎綅缃捣妗嗛€夛紝椤轰究鍘嬫帀娴忚鍣ㄨ嚜鍔ㄦ粴鍔?*/
    root.addEventListener('mousedown', function (e) { if (e.button === 1) e.preventDefault(); });
    root.addEventListener('auxclick', function (e) { if (e.button === 1) e.preventDefault(); });
    root.addEventListener('pointerdown', function (e) {
      if (e.button === 1) {
        e.preventDefault();
        startMarquee(e, e.shiftKey, true);   /* 涓敭锛氬彧妗嗗浘鏍?*/
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
      /* 鐐瑰凡澶氶€変腑鐨勫厓绱犳椂涓嶈鎵撴暎澶氶€夛紝鍚﹀垯鏁寸粍鎷栧姩澶辨晥 */
      var inMulti = App.multi.length > 1 && App.multi.indexOf(l.id) > -1;
      if (e.shiftKey || !inMulti) {
        App.select(l.id, e.shiftKey);
      } else {
        App.sel = l.id;
        drawSel();
        if (window.Panels) { Panels.syncInspector(); Panels.syncLayers(); }
      }
      if (App.editing) return;
      /* 鑷繁鍒ゅ畾鍙屽嚮锛氬悓涓€涓枃瀛楀浘灞?350ms 鍐呯偣涓や笅 鈫?鐩存帴杩涘叆缂栬緫 */
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
      /* 鍥炬爣鎶曟斁缁熶竴璧?panels.js 鐨勬寚閽堟嫋鎷斤紙姣斾緥鎹㈢畻 + 涓庢牸瀛愬悓灏哄锛夛紝杩欓噷涓嶅啀澶勭悊 */
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
    /* 鍛戒腑宸插閫夌殑鍥惧眰鏃讹紝鏁寸粍涓€璧锋嫋 */
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
      var dx = (ev.clientX - sx) * z.x, dy = (ev.clientY - sy) * z.y;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 1.5) return;
      moved = true;
      document.body.classList.add('cv-dragging');
      if (group) {
        var MG = CV.metrics(App.doc);
        group.forEach(function (g) {
          var L = App.getLayer(g.id);
          if (!L) return;
          L.x = g.x + dx; L.y = g.y + dy;
          var e2 = App.map[g.id];
          if (e2) { e2.style.left = MG.x(L.x) + 'px'; e2.style.top = MG.y(L.y) + 'px'; }
        });
        drawSel();
        return;
      }
      var nx = ox + dx, ny = oy + dy;
      var sn = (!ev.altKey && App.doc.snap && App.doc.snap.on === true) ? snapPos(nx, ny, l) : null;   /* 鍚搁檮榛樿鍏筹細瑕佽窡鎵?*/
      if (sn) { nx = sn.x; ny = sn.y; showGuides(sn.guides); }
      var MWd = (CV.MASTER ? CV.MASTER.w : 1160), MHd = (CV.MASTER ? CV.MASTER.h : 720);
      var halfW = (l.w || 0) * 0.5, halfH = ((l.type === 'text' ? el.offsetHeight : l.h) || l.w || 0) * 0.5;
      l.x = Math.min(Math.max(nx, -halfW), MWd - halfW);
      l.y = Math.min(Math.max(ny, -halfH), MHd - halfH);
      var M1 = CV.metrics(App.doc);
      el.style.left = M1.x(l.x) + 'px'; el.style.top = M1.y(l.y) + 'px';
      drawSel();
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.body.classList.remove('cv-dragging');
      showGuides([]);
      if (moved) {
        if (group) { App.apply(); if (fromCluster && App.refreshClusterBase) App.refreshClusterBase(); App.toast('宸茬Щ鍔?' + group.length + ' 涓浘灞?); }
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

  /* ---------------- 妗嗛€夛紙涓敭 鎴?宸﹂敭绌虹櫧澶勶級 ---------------- */
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
      if (ids.length) App.toast('宸叉閫?' + ids.length + ' 涓? + (onlyIcon ? '鍥炬爣' : '鍥惧眰'), 'ok');
      else App.toast(onlyIcon ? '鑼冨洿鍐呮病鏈夊浘鏍? : '妗嗛€夎寖鍥村唴娌℃湁鍥惧眰');
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  /* ---------------- 琛屽唴缂栬緫 ---------------- */
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
      el.removeAttribute('contenteditable');   /* 鍏抽敭锛氫笉鎽樻帀鐨勮瘽鍙屽嚮浼氬彉娴忚鍣ㄩ€夎瘝 */
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

  /* ---------------- 缇ょ粍鎿嶄綔 ---------------- */
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
    App.toast('宸插榻?);
  };
  App.distribute = function (dir) {
    var set = App.selSet();
    if (set.length < 3) { App.toast('鑷冲皯閫?3 涓厓绱犳墠鑳藉垎甯?, 'err'); return; }
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
    App.toast('宸茬瓑璺濆垎甯?);
  };
  /* 缃戞牸鎺掑垪鍙鍥炬爣鐢熸晥锛氫紭鍏堢敤閫変腑鐨勫浘鏍囷紝娌℃湁灏辩敤鐢诲竷涓婂叏閮ㄥ浘鏍?*/
  App.iconSet = function () {
    var sel = App.selSet().filter(function (l) { return l.type === 'icon'; });
    if (sel.length >= 2) return { list: sel, from: 'sel' };
    var all = App.doc.layers.filter(function (l) { return l.type === 'icon' && !l.hidden && !l.locked; });
    if (all.length >= 2) return { list: all, from: 'all' };
    return { list: [], from: 'none' };
  };

  /* 缃戞牸钀戒綅锛氫互閫変腑鍥炬爣鐨勩€屽師濮嬪寘鍥寸洅涓績銆嶄负閿氱偣锛屼笉寮哄埗鎸埌鐢诲竷姝ｄ腑 */
  /* 鍥炬爣鍦嗛樀锛氱瓑寰勫渾鏁撮綈鍫嗗彔 + 鍚屾缂╂斁/鏃嬭浆/闂磋窛 */
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
    if (!pick.list.length) { App.toast('鐢诲竷涓婃病鏈夊浘鏍?, 'err'); return; }
    var set = pick.list;
    var total = set.length;
    var grid;
    if (typeof spec === 'number' && isFinite(spec)) {
      var c0 = Math.max(1, Math.min(spec, total));
      grid = [c0, Math.ceil(total / c0)];
    } else if (spec && spec.length === 2) grid = spec;
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
    App.toast('宸叉帓鎴?' + grid[0] + ' 脳 ' + grid[1] + ' 鍦嗛樀锛? + set.length + ' 涓浘鏍囷級', 'ok');
  };

  /* 鍦嗛樀鎴愬憳 id锛堝渾鐜?+ 瀵瑰簲鍥炬爣锛?*/
  App.clusterIds = function () {
    var live = clusterMembers().map(function (l) { return l.id; });
    if (live.length > 1) return live;
    var c = App.__cluster;
    if (c && c.base && c.base.length) {
      return c.base.map(function (b) { return b.id; }).filter(function (id) { return !!App.getLayer(id); });
    }
    return clusterMembers().map(function (l) { return l.id; });
  };
  /* 鎷栧姩鍚庡埛鏂板熀鐐癸紝淇濊瘉鍚庣画缂╂斁/鏃嬭浆浠嶇劧浠ユ柊浣嶇疆涓轰腑蹇?*/
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

  /* 鍚屾缂╂斁锛堣窡鎵嬶紝涓嶉噸缁橈級 */
  /* 闆疯揪鍥惧疄鏃堕瑙堬細鍙噸鐢昏繖涓€寮?SVG */
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
        var MC = CV.metrics(App.doc);
        el.style.left = MC.x(l.x) + 'px'; el.style.top = MC.y(l.y) + 'px';
        el.style.width = MC.w(l.w) + 'px'; el.style.height = MC.w(l.h) + 'px';
      }
    });
    if (App.drawSel) App.drawSel();
  };

  /* 鍚屾鏃嬭浆锛堣窡鎵嬶級 */
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

  /* 鍚屾闂磋窛锛堣窡鎵嬶細鎸夋柊闂磋窛閲嶆帓涓€娆★紝涓嶈惤鐩橈級 */
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
    if (!pick.list.length) { App.toast('鐢诲竷涓婃病鏈夊浘鏍囧彲鎺掑竷', 'err'); return; }
    var set = pick.list;
    if (pick.from === 'all') {
      App.selectMany(set.map(function (l) { return l.id; }));
      App.toast('鍙帓鍥炬爣锛氭湰娆′綔鐢ㄤ簬鐢诲竷涓婂叏閮?' + set.length + ' 涓浘鏍?);
    } else if (set.length < App.selSet().length) {
      App.toast('鍙帓鍥炬爣锛氬拷鐣?' + (App.selSet().length - set.length) + ' 涓潪鍥炬爣鍥惧眰');
    }
    var r = App.gridPlace(set, cols, gap);
    App.apply(); App.commit();
    App.toast('宸叉帓鎴?' + r.n + ' 鍒?脳 ' + r.rows + ' 琛岋紙' + set.length + ' 涓浘鏍囷紝浣嶇疆娌跨敤鍘熷锛?, 'ok');
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
  /* 瀹炴椂鏃嬭浆锛氬彧鏀瑰唴鑱?transform锛岄浂閲嶇粯闆惰惤鐩橈紙璺熸墜锛?*/
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

  /* ---------------- 鍥惧眰鎿嶄綔 ---------------- */
  App.commit = function () { App.pushHist(); saveLocal(); };
  App.addLayerAt = function (l, quiet, index) {
    App.doc.layers.splice(index == null ? App.doc.layers.length : index, 0, l);
    App.sel = l.id;
    App.apply();
    App.commit();
    if (!quiet) App.toast('宸叉坊鍔犲浘鐗囧浘灞?);
    return l;
  };
  App.addLayer = function (l, quiet) {
    App.doc.layers.push(l);
    App.sel = l.id;
    App.apply();
    App.commit();
    if (!quiet) App.toast('宸叉坊鍔? + ({ text: '鏂囧瓧', icon: '鍥炬爣', shape: '褰㈢姸', raw: '鍥惧舰' }[l.type] || '鍥惧眰'));
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
      if (mode === 'icon') return l.type !== 'icon';
      if (mode === 'text') return l.type !== 'text';
      return false;
    });
    var removed = before - App.doc.layers.length;
    if (!removed) { App.toast(mode === 'icon' ? '娌℃湁鍥炬爣鍙竻绌? : '鐢诲竷宸茬粡鏄┖鐨?, 'err'); return; }
    App.sel = null;
    App.multi = [];
    App.apply();
    App.commit();
    var what = mode === 'icon' ? '鍥炬爣' : (mode === 'text' ? '鏂囧瓧锛堣儗鏅簳绾逛繚鐣欙級' : '鍏ㄩ儴');
    App.toast('宸叉竻绌?' + removed + ' 涓? + what + '鍥惧眰 路 Ctrl+Z 鍙挙閿€', 'ok');
  };

  App.removeSel = function () {
    var set = App.selSet(); if (!set.length) return;
    var kill = {};
    set.forEach(function (l) { kill[l.id] = 1; });
    App.doc.layers = App.doc.layers.filter(function (x) { return !kill[x.id]; });
    App.sel = null; App.multi = [];
    App.apply(); App.commit();
    App.toast('宸插垹闄?' + set.length + ' 涓浘灞?);
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
    App.toast('宸插垱寤哄壇鏈?脳' + made.length);
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

  /* ---------------- 瀵煎嚭 ---------------- */
  App.slug = function () {
    var d = (App.doc.content && App.doc.content.date) || '';
    var k = d.replace(/[^\d]/g, '');
    if (k.length >= 8) k = k.slice(0, 4) + '-' + k.slice(4, 6) + '-' + k.slice(6, 8);
    return (k || 'cover') + '_' + App.doc.style + '_' + App.doc.layout;
  };
  /* 鍙鍑恒€屼俊鎭簳绾广€嶈繖涓€灞傦紝寰楀埌绾儗鏅?PNG */
  App.exportBgPattern = function (scale) {
    scale = scale || 2;
    var id = App.doc.bgPattern;
    if (!id) { App.toast('鍏堝湪銆岀敾甯?鈫?鑳屾櫙銆嶉噷閫変竴涓俊鎭簳绾?, 'err'); return; }
    if (!CV.bgPatternById(id)) { App.toast('搴曠汗鏍囪瘑鏃犳晥锛? + id, 'err'); return; }
    if (App.locked) return;
    App.locked = true;
    App.toast('姝ｅ湪瀵煎嚭搴曠汗鈥?, 'wait');
    var doc = {
      w: App.doc.w, h: App.doc.h, master: App.doc.master, ratio: App.doc.ratio,
      bg: '#ffffff', fx: [], layers: [], dark: false, tokens: {}, content: {},
      bgPattern: id
    };
    fetch('api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc: doc, name: 'bg-' + id, scale: scale })
    }).then(function (r) {
      if (r.status === 404 || (r.headers.get('content-type') || '').indexOf('json') < 0) throw new Error('no-render-api');
      return r.json();
    }).then(function (j) {
      App.locked = false;
      if (j.ok) { App.toast('搴曠汗宸插鍑?' + j.name, 'ok', j.size); if (window.Panels && Panels.showShot) Panels.showShot(j.url + '?t=' + Date.now(), j); }
      else App.toast('瀵煎嚭澶辫触锛? + (j.error || '鏈煡'), 'err');
    }).catch(function (err) {
      App.locked = false;
      App.toast(err.message === 'no-render-api' ? '闈欐€佹墭绠℃ā寮忎笉鏀寔鏈嶅姟绔嚭鍥撅紝璇锋湰鍦拌繍琛? : ('瀵煎嚭澶辫触锛? + err.message), 'err');
    });
  };

  App.exportPng = function (scale) {
    scale = scale || 2;
    if (App.locked) return;
    App.locked = true;
    App.toast('姝ｅ湪鍑哄浘鈥?, 'wait');
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
        App.toast('宸插嚭鍥?' + j.name, 'ok', j.size);
        if (window.Panels) Panels.showShot(j.url + '?t=' + Date.now(), j);
      } else {
        App.toast('鍑哄浘澶辫触锛? + (j.error || '鏈煡'), 'err');
      }
    }).catch(function (err) {
      App.locked = false;
      if (err.message === 'no-render-api') {
        App.toast('闈欐€佹墭绠℃ā寮忥細宸叉敼涓哄鍑?JSON锛堟湰鍦拌窇宸ュ叿鍙嚭鍥撅級', 'ok');
        App.exportJson();
      } else {
        App.toast('鍑哄浘澶辫触锛? + err.message, 'err');
      }
    });
  };
  /* 璇诲浘 -> 鍘嬪埌 1600px 瀹?-> dataURL锛岄伩鍏?JSON 杩囧ぇ */
  App.pickImage = function (file, asBg) {
    if (!file || !/^image\//.test(file.type)) { App.toast('璇锋嫋鍏ュ浘鐗囨枃浠?, 'err'); return; }
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
        App.toast(asBg ? '宸茶涓鸿儗鏅浘' : '宸叉彃鍏ュ浘鐗?, 'ok');
      };
      img.onerror = function () { App.toast('鍥剧墖璇诲彇澶辫触', 'err'); };
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
    App.toast('宸茶涓鸿儗鏅浘', 'ok');
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
    App.toast('姝ｅ湪鎵撳寘 HTML鈥?, 'wait');
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
      App.toast('宸插鍑?HTML锛堝惈鍐呰仈鍥剧墖/绾圭悊锛屽弻鍑诲嵆寮€锛?, 'ok');
    }).catch(function (e) { App.toast('瀵煎嚭澶辫触锛? + e.message, 'err'); });
  };
  App.exportJson = function () {
    var blob = new Blob([JSON.stringify(App.doc, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = App.slug() + '.cover.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    App.toast('宸插鍑?JSON');
  };
  App.importJson = function (file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var d = JSON.parse(fr.result);
        if (!d.layers) throw new Error('涓嶆槸鏈夋晥鐨勫皝闈?JSON');
        App.sel = null; App.setDoc(d);
        App.toast('宸茶浇鍏?' + (file.name || 'JSON'), 'ok');
      } catch (err) { App.toast('杞藉叆澶辫触锛? + err.message, 'err'); }
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

  /* ---------------- 蹇嵎閿?---------------- */
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
    if (e.code === 'Backquote') { e.preventDefault(); App.recompose(); App.toast('宸叉寜褰撳墠棰勮閲嶆帓'); }
  });

  /* ---------------- 鍚姩 ---------------- */
  App.BUILD = '20261029-f57';
  function stampBuild() {
    document.documentElement.dataset.build = App.BUILD;
    var bar = document.querySelector('.stage-bar');
    if (!bar || document.getElementById('buildTag')) return;
    var tag = document.createElement('span');
    tag.id = 'buildTag';
    tag.className = 'pill';
    tag.title = '褰撳墠杩愯鐨勫墠绔瀯寤哄彿锛岀敤浜庣‘璁ゆ槸鍚﹀凡鏇存柊';
    tag.textContent = 'build ' + App.BUILD;
    tag.style.opacity = '.62';
    bar.appendChild(tag);
  }

  App.boot = function () {
    stampBuild();
    var doc = App.loadLocal();
    if (!doc || !doc.layers) doc = CV.compose('swiss', 'hero', CV.defaultContent(), 'land');
    if (!doc.ratio) doc.ratio = 'land';
    /* 鐗堝紡鍗囩骇锛氳€佸瓨妗ｆ寜褰撳墠棰勮鑷姩閲嶆帓锛岄伩鍏嶇湅鍒拌繃鏈熷竷灞€ */
    var prevPv = doc.pv;
    if (doc.style && prevPv && prevPv !== CV.PRESET_VERSION && CV.styleById(doc.style)) {
      var cc = doc.content || CV.defaultContent();
      var fresh = CV.compose(doc.style, doc.layout || 'hero', cc, doc.ratio || 'land');
      fresh.brand = doc.brand;
      fresh.id = doc.id;
      doc = fresh;
      setTimeout(function () { App.toast('鐗堝紡宸插崌绾у埌 ' + CV.PRESET_VERSION + '锛坱ext 鍐呭淇濈暀锛?, 'ok'); }, 600);
    }
    doc.paper = Object.assign({ on: false, opacity: 80, noise: 60, scale: 260 }, doc.paper || {});
    if (doc.paper.on !== true) doc.paper.on = false;
    App.doc = doc;
    App.hist = [JSON.stringify(doc)];
    App.hi = 0;
    App.apply();
    window.addEventListener('resize', function () { App.fitZoom(); drawSel(); });
    App.toast('灏辩华 路 宸︿晶鎷栧浘鏍囪繘鐢诲竷锛屽弻鍑绘枃瀛楃洿鎺ユ敼', 'ok');
  };
  window.addEventListener('DOMContentLoaded', function () {
    if (window.Panels) Panels.init(App);
    App.boot();
    if (window.Panels) Panels.afterBoot();
  });

})();