/* ==========================================================================
   渲染内核：doc(JSON) → DOM。编辑器与出图页共用同一份，保证像素一致
   ========================================================================== */
(function () {
  var CV = window.CV;

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

  function applyText(el, l) {
    el.className = 'cv-el cv-text ff-' + (l.font || 'heavy') + (l.upper ? ' upper' : '') + (l.italic ? ' italic' : '');
    el.style.left = l.x + 'px';
    el.style.top = l.y + 'px';
    el.style.width = l.w + 'px';
    el.style.fontSize = l.size + 'px';
    el.style.fontWeight = l.weight || 400;
    el.style.color = l.color || '#0e1115';
    el.style.lineHeight = l.lh || 1.1;
    el.style.letterSpacing = (l.ls || 0) + 'em';
    el.style.textAlign = l.align || 'left';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.maxHeight = l.maxH ? l.maxH + 'px' : '';
    var sh = [];
    if (l.stroke > 0) {
      var rr = l.stroke, sc = l.strokeColor || '#ffffff';
      for (var ai = 0; ai < 16; ai++) {
        var ths = (ai * Math.PI) / 8;
        sh.push((Math.cos(ths) * rr).toFixed(1) + 'px ' + (Math.sin(ths) * rr).toFixed(1) + 'px 0 ' + sc);
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
    el.className = 'cv-el cv-icon';
    el.style.left = l.x + 'px';
    el.style.top = l.y + 'px';
    el.style.width = l.w + 'px';
    el.style.height = l.h + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.borderRadius = l.radius ? l.radius + 'px' : '';
    el.style.filter = l.tint === 'mono' ? 'brightness(0)' : l.tint === 'invert' ? 'brightness(0) invert(1)' : '';
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

  function applyShape(el, l) {
    el.className = 'cv-el cv-shape sh-' + (l.shape || 'rect');
    el.style.left = l.x + 'px';
    el.style.top = l.y + 'px';
    el.style.width = l.w + 'px';
    el.style.height = l.h + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.background = l.color;
    el.style.borderRadius = l.radius ? l.radius + 'px' : '';
    el.style.boxShadow = CV.shadowCss(l.shadow);
    if (l.bw > 0) { el.style.border = l.bw + 'px solid ' + (l.bc || '#000'); }
    if (l.shape === 'line') { el.style.height = (l.h || 1) + 'px'; el.style.background = l.color; }
  }

  function applyRaw(el, l) {
    el.className = 'cv-el';
    el.style.left = l.x + 'px'; el.style.top = l.y + 'px';
    el.style.width = l.w + 'px'; el.style.height = l.h + 'px';
    el.style.opacity = l.opacity == null ? 1 : l.opacity;
    el.style.transform = l.rot ? 'rotate(' + l.rot + 'deg)' : '';
    el.style.pointerEvents = 'none';
  }

  CV.applyLayer = function (el, l, doc) {
    if (l.type === 'text') applyText(el, l);
    else if (l.type === 'icon') applyIcon(el, l, doc);
    else if (l.type === 'shape') applyShape(el, l);
    else applyRaw(el, l);
    el.style.display = l.hidden ? 'none' : '';
  };

  CV.makeEl = function (l, doc, edit) {
    var el;
    if (l.type === 'text') {
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
  function fitLayer(el, l) {
    if (!l.fit) return;
    var maxW = l.w, maxH = l.maxH || 0, base = l.size;
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

    fx.forEach(function (n) {
      if (FX_BACK[n]) return;
      var d = document.createElement('div');
      d.className = 'cv-fx ' + n;
      if (n === 'dotgrid') d.style.color = (doc.tokens && doc.tokens.ink) || '#000';
      root.appendChild(d);
    });

    host.appendChild(root);

    (doc.layers || []).forEach(function (l) {
      if (l && l.type === 'text' && l.fit) fitLayer(map[l.id], l);
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
