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
    else applyRaw(el, l, doc);
    el.style.display = l.hidden ? 'none' : '';
  };

  CV.makeEl = function (l, doc, edit) {
    var el;
    if (l.type === 'image') {
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
    if (doc.tokens && doc.tokens.ink) root.style.color = doc.tokens.ink;
    if (doc.tokens && doc.tokens.accent) root.style.setProperty('--hl', doc.tokens.accent);

    var bg = document.createElement('div');
    bg.className = 'cv-bg';
    root.appendChild(bg);

    /* 自定义背景图：在底色之上、图层之下 */
    if (doc.bgImage && doc.bgImage.src) {
      var bi = document.createElement('div');
      bi.className = 'cv-bgimg';
      bi.style.backgroundImage = 'url("' + doc.bgImage.src + '")';
      bi.style.backgroundSize = doc.bgImage.fit === 'contain' ? 'contain' : 'cover';
      if (doc.bgImage.blur) bi.style.filter = 'blur(' + doc.bgImage.blur + 'px)';
      root.appendChild(bi);
      if (doc.bgImage.dim) {
        var dm = document.createElement('div');
        dm.className = 'cv-bgdim';
        dm.style.background = 'rgba(0,0,0,' + Math.min(0.85, doc.bgImage.dim / 100) + ')';
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
    var list = fx.slice();
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
