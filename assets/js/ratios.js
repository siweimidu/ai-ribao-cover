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
