# AI 日报封面工作室 · ai-ribao-cover

把「每天做一张 AI 日报封面」从手工活变成**可编辑的画布 + 可复用的风格系统**。

- **14 套风格**：从 D:\Code\封面 里 10 位 UP 主的 300 张封面逐张归纳，另加 **构成主义** 与 **包豪斯**。
- **4 种版式**：主视觉 / 通栏大标 / 分栏头条 / 图标巨化。风格 × 版式 = 44 种组合，一键换，**文案不丢**。
- **指哪打哪**：点选、拖拽、拽角缩放、双击或 Enter 改字、属性面板调字号/字重/行高/描边/阴影/旋转/透明度/层级。
- **189 个 AI 品牌图标**（1460 个 PNG）：**按公司分组**列出全部变体，左键拖进画布、右键弹出变体面板。
- **一键出图**：本地 Playwright 渲染，PNG 直接落到 out/，2× / 3× 任选。
- **AI 生成**：离线智能解析 → 直连模型 → 粘贴 JSON，三条路任选。

---

## 快速开始

双击 **启动工作室.cmd**（或命令行 node tools/serve.mjs），浏览器打开 http://127.0.0.1:7788

> 需要 Node 18+。出图复用本机已有的 Chrome（通过 hyperframes 的 chrome 启动器），不额外下载 Chromium。

命令行出图：

    # 单张：把一个 .cover.json 渲染成 PNG
    node tools/render.mjs content/example-doc.json 我的封面 2

    # 批量：一份内容清单 × 统一风格
    node tools/render.mjs --batch content/example.json --style bauhaus --layout poster --scale 2

## 目录结构

    ai-ribao-cover/
    ├── index.html            编辑器（单页）
    ├── render.html           纯渲染页，出图专用
    ├── 启动工作室.cmd
    ├── assets/
    │   ├── css/app.css       应用外壳（Doubao 设计语言 token）
    │   ├── css/cover.css     画布渲染样式（编辑器与出图共用同一份）
    │   ├── js/model.js       文档模型：封面 = 一份 JSON
    │   ├── js/presets.js     11 套风格 × 4 种版式
    │   ├── js/render.js      渲染内核：JSON → DOM
    │   ├── js/panels.js      表单 / 风格库 / 图标库 / 检查器 / AI
    │   ├── js/studio.js      选择 / 拖拽 / 缩放 / 快捷键 / 出图
    │   ├── icons/            1460 个品牌 PNG（189 个品牌/产品）
    │   ├── icons.json        图标索引 + 中文搜索引擎
    │   └── tex/              烘焙纹理：颗粒 / 纸纤维 / 褶皱 / 圆点 / 斜纹
    ├── tools/
    │   ├── serve.mjs         本地服务（静态 + 字体代理 + 出图 + AI 代理）
    │   ├── render.mjs        命令行 / 批量出图
    │   ├── selftest.mjs      无头自检（模拟真实操作，抓 JS 错误）
    │   └── core.mjs          共享：文件 / 字体 / Playwright
    ├── content/              内容样例与批量清单
    └── out/                  出图产物（已 gitignore）

## 14 套风格

| id | 名称 | 来源 | 骨架特征 |
|---|---|---|---|
| swiss | 瑞士极简 | 白鸦 | 大留白 + 蓝色竖标 + 单色大 logo |
| broadsheet | 报刊头版 | 灵感港 | 双线边框 + 纸纹 + 红框日期 |
| matrix | 渐变圆格 | 橘鸦 | 圆角卡片 + 图标矩阵 + 柔和渐变 |
| paperdoodle | 纸质涂鸦 | 渐近自由 | 米纸 + 黄条 + 高饱和红标题 |
| cardlight | 白卡蓝字 | 白洛奇 | 悬浮白卡 + pill 标签 |
| beigeRed | 米底红字 | 绿鸭 / 黑鸦 | 超粗压缩红字 + 渐变四角星 |
| noir | 暗色杂志 | 新增 | 黑底 + 发光环 + 扫描线 |
| data | 高对比数据 | 小小小名 | 雷达图 + 硬边框 + 巨号数字 |
| pastel | 柔和渐变 | 小心鸦 | 粉紫渐变 + 柔光卡片 |
| constructivism | **构成主义** | 新增 | 红黑米三色 + 45° 斜切带 + 钢铁圆环 |
| bauhaus | **包豪斯** | 新增 | 三原色 + 圆/三角/方 + 网格与色带 |
| zine | **撕纸拼贴** | 荡殇永魔 | 竖向撕口 + 纸芯毛边 + 超粗无衬线 |
| sticker | **贴纸描边** | 黑鸦 | 巨号红字 + 白色外描边 + 大图标 |
| candy | **糖果立体字** | 渐近自由 | 渐变填充 + 黑描边 + 红色厚投影 |

## 快捷键

| 操作 | 键 |
|---|---|
| 撤销 / 重做 | Ctrl+Z / Ctrl+Shift+Z |
| 复制图层 | Ctrl+D |
| 出图 PNG | Ctrl+S |
| 微调位置 | 方向键（Shift = 10px） |
| 编辑文字 | 双击，或选中后按 Enter / F2 |
| 字号 ± | 左方括号 / 右方括号 |
| 按当前预设重排 | 键盘左上角的反引号键 |
| 取消选择 | Esc |
| 删除 | Delete |

## AI 一键生成

三种模式，都不强制联网：

1. **智能解析（离线）**：丢一句新闻标题进去 → 自动断行、按关键词匹配品牌图标（Kimi / Claude / 智谱 / 豆包 / DeepSeek …）、自动选版式。不消耗任何 token。
2. **模型直连**：在项目根目录新建 studio.ai.json（**已在 .gitignore，不会提交**）：

       { "apiKey": "sk-...", "baseURL": "https://api.deepseek.com", "model": "deepseek-chat" }

   或设置环境变量 DEEPSEEK_API_KEY。任何 OpenAI 兼容端点都能用。
3. **粘贴 JSON**：点「复制提示词」把整段提示词发给我（或任意对话模型），把返回的 JSON 粘回来即可应用。

> 设计即数据：一份封面 = 一个 JSON。所以除了点鼠标，也可以直接改 JSON 再出图——批量、脚本化、让 AI 改都行。

## 质量门禁

    node tools/qa.mjs

对 14 套风格 × 4 种版式 = **56 种组合**逐个渲染，自动检测：越界、文字溢出、文字/图标穿模、贴边，并把每张图存到 out/qa/。当前 **56/56 全部通过**。

## 自检

    node tools/selftest.mjs

无头加载编辑器，模拟切风格 / 切版式 / 点选 / 拖拽 / 改字 / 调参 / 搜图标 / 撤销重做 / 44 种组合重排 / AI 弹窗 / 出图 API，全程收集 JS 错误。

## 已知边界（Phase 2 · GitHub Pages）

当前是**纯本地版**：出图依赖本地 Node + Playwright，所以 PNG 直接写进 out/。

要上 GitHub Pages 需要三处改造（代码已为此预留）：
1. 中文字体子集化（现在是 @font-face 走 /font/ 代理本机字体）；
2. 实时 SVG 滤镜换成烘焙 noise 贴图（assets/tex/ 已经是这条路，剩 vignette / scan 两个）；
3. 出图从 fetch('/api/render') 降级为浏览器端 html-to-image。

## 备份

初始化前已把当时的 studio/ 整体备份到 D:\Code\封面\_backup\<时间戳>；此后每次提交都是一个可回滚版本。
