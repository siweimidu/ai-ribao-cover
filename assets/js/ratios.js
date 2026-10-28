/* ==========================================================================
   画幅：所有版式仍按 1160x720 的母版坐标设计，渲染时按画幅换算
   ========================================================================== */
(function () {
  var CV = (window.CV = window.CV || {});
  CV.MASTER = { w: 1160, h: 720 };

  CV.RATIOS = [
    { id: 'bili', name: 'B站封面', w: 1146, h: 717, tag: '16:9' },
    { id: 'bili-space', name: 'B站空间头图', w: 1920, h: 1080, tag: '16:9' },
    { id: 'xhs', name: '小红书笔记', w: 1080, h: 1440, tag: '3:4' },
    { id: 'xhs-profile', name: '小红书主页', w: 1080, h: 864, tag: '5:4' },
    { id: 'douyin', name: '抖音封面', w: 1080, h: 1920, tag: '9:16' },
    { id: 'douyin-profile', name: '抖音主页背景', w: 1125, h: 633, tag: '16:9' },
    { id: 'kuaishou', name: '快手封面', w: 1080, h: 1440, tag: '3:4' },
    { id: 'wx-share', name: '视频号分享卡', w: 1080, h: 1440, tag: '3:4' },
    { id: 'wx-profile', name: '视频号主页卡', w: 1080, h: 1260, tag: '6:7' },
    { id: 'square', name: '通用方形', w: 1080, h: 1080, tag: '1:1' },
    { id: 'land', name: '宽屏横版', w: 1160, h: 720, tag: '16:9' }
  ];

  CV.ratioOf = function (id) {
    for (var i = 0; i < CV.RATIOS.length; i++) if (CV.RATIOS[i].id === id) return CV.RATIOS[i];
    return CV.RATIOS[10];
  };

  CV.metrics = function (doc) {
    var M = CV.MASTER;
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
