# 交班说明（AI 自动收尾）

> 本项目的收尾由 AI 在夜间连续完成，最后按你的要求关机。以下是你醒来需要知道的全部。

## 一句话状态

21 套风格 × 6 种版式（4 横 + 2 原生竖版）× 17 种画幅，几何体检 **126/126 全绿**，已推送 GitHub，Pages 在线。

## 怎么用

1. 双击 `启动工作室.cmd`（或 `start.cmd`）→ 浏览器打开 http://127.0.0.1:7788
2. 左栏：内容 / 风格 / 图标；中间画布：点选、拖拽、双击改字；右栏：属性 / 图层 / 出图
3. 顶栏：插入图片 · 导入 JSON · 保存 JSON · 导出 HTML · 出图 PNG

## 关键能力清单

- **21 套风格**：swiss / broadsheet / newspaper / matrix / paperdoodle / cardlight / beigeRed / zine / sticker / candy / noir / data / pastel / editorial / constructivism / bauhaus / glitch / golden / ribbon / serifgrid / flat
- **6 种版式**：hero / poster / split / feature（横版 1160×720）+ stack / sheet（竖版 900×1200）
- **17 种画幅**：1:1 / 4:3 / 3:4 / 16:9 / 9:16 / 6:7 / 16:10 + B站/小红书/抖音/快手/视频号具体尺寸
- **方向自动换算**：换画幅时按方向自动替换等价版式，每种风格都有专属竖版装饰
- **图标库**：190 个模型一格、徽章标变体数、左键拖入画布、右键深色浮层看全部变体
- **图片图层**：拖图入画布、自动压 1600px、铺满/完整、压暗/模糊/黑白/圆角、一键设为背景
- **导出**：PNG（Playwright 2x/3x）、单文件 HTML（内联 CSS+纹理+图标）、JSON 工程文件

## 质检命令

    node tools/qa.mjs          # 126 组合几何体检（越界/溢出/穿模/贴边）
    node tools/qa.mjs --only zine
    node tools/dump.mjs glitch/hero   # 打印每层真实盒模型
    node tools/smoke.mjs       # 快速冒烟
    node tools/t-ratio.mjs     # 17 画幅 + 颜色选择器
    node tools/t-image.mjs     # 图片图层 + HTML 导出
    node tools/t-adapt.mjs     # 6 风格 × 7 比例适配截图
    node tools/t-icons.mjs     # 图标库 + 右键浮层 + 拖拽

## 已知不足（留给下一轮）

1. **像素级调校只做了一轮**：结构对齐了，但字号/字重/行距/留白与原图逐张比对还没做完。
2. **9:16 偏空**：竖版母版是 3:4（900×1200），9:16 靠内容带拉伸，底部留白偏多。
3. **glitch 重影**是整体偏移，不是按行切片。
4. **图片图层只支持居中裁切**，没有焦点位置。
5. **文字图层不支持逐字上色**，只有 [[高亮]] 整体一个强调色。

## 仓库

- 本地：`D:\Code\封面\ai-ribao-cover`
- 远程：https://github.com/siweimidu/ai-ribao-cover
- Pages：https://siweimidu.github.io/ai-ribao-cover/
- 备份：`D:\Code\封面\_backup\20261028-224333`

> `git push` 在本机 443 被拦，提交一律走 GitHub Contents API（内容一致，历史是多条 API commit）。
