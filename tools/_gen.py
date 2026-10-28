
import os, json, math, random
import numpy as np
from PIL import Image, ImageFilter

PROJ = r"D:\Code\封面\ai-ribao-cover"
ICON = os.path.join(PROJ, "assets", "icons")

man = json.load(open(os.path.join(ICON, "manifest.json"), encoding="utf-8"))["byVendor"]
alias = {
 "字节跳动":"字节 抖音 豆包 即梦 coze 扣子 trae", "OpenAI":"openai gpt chatgpt 奥特曼",
 "Anthropic":"anthropic claude 克劳德", "Google":"谷歌 谷大 gemini 双子", "DeepSeek":"深度求索 深度",
 "月之暗面":"moonshot kimi 月暗", "阿里通义":"阿里 通义 千问 qwen 马云", "智谱 AI":"智谱 zhipu glm chatglm 清言",
 "MiniMax":"minimax 稀宇 海螺 hailuo", "百度":"百度 文心 ernie", "腾讯":"腾讯 混元 hunyuan 元宝",
 "xAI":"马斯克 musk grok", "Meta":"脸书 facebook 拉玛 llama", "Microsoft":"微软 copilot",
 "Mistral AI":"mstrl 米斯特拉尔", "Stability AI":"绘图 diffusion 稳定", "Midjourney":"mj 中途",
 "Runway":"跑道 视频生成", "Pika":"皮卡", "Suno":"音乐 suno", "Udio":"音乐 udio",
 "Cognition":"devin 认知", "Cursor":"光标 编辑器", "Manus":"马努斯", "Perplexity":"困惑 搜索",
 "Ollama":"本地 ollama", "vLLM":"推理引擎", "ComfyUI":"工作流", "Hugging":"抱抱脸",
 "上海AI实验室":"书生 浦语 internlm 上海", "商汤":"日日新 sensetime", "科大讯飞":"讯飞 星火 iflytek",
 "阶跃星辰":"阶跃 step", "零一万物":"零一 01.ai", "百川智能":"百川 baichuan", "面壁智能":"面壁 minicpm",
 "昆仑万维":"天工 skywork", "快手":"可灵 kling 快手", "美团":"龙猫 longcat", "小米":"mimo 小米",
 "秘塔":"metaso 秘塔 搜索", "华为":"盘古 pangu 鸿蒙", "生数科技":"vidu 生数", "智源 BAAI":"智源 baaai",
 "ElevenLabs":"语音 tts", "AssemblyAI":"语音识别 asr", "LangChain":"langchain 链",
}
out = []
for vendor, prods in man.items():
    for prod, variants in prods.items():
        out.append({
            "id": f"{vendor}/{prod}",
            "vendor": vendor, "product": prod,
            "variants": sorted(variants),
            "kw": (vendor + " " + prod + " " + alias.get(vendor, "")).lower(),
        })
out.sort(key=lambda x: (x["vendor"], x["product"]))
json.dump({"count": len(out), "items": out}, open(os.path.join(PROJ, "assets", "icons.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print("icons.json:", len(out))

# ---- seamless textures ----
def tileable(h, w, seed, blur, octaves=(1.0, 0.5, 0.25)):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    for i, amp in enumerate(octaves):
        n = rng.random((h, w)).astype(np.float32)
        img = Image.fromarray((n * 255).astype(np.uint8))
        img = img.filter(ImageFilter.GaussianBlur(blur / (2 ** i)))
        a = np.asarray(img, np.float32) / 255.0
        a = 0.5 * (a + np.roll(a, (h // 2, w // 2), (0, 1)))
        acc += a * amp
    acc = (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)
    return acc

TEX = os.path.join(PROJ, "assets", "tex")

# grain: pure fine noise, alpha modulated
rng = np.random.default_rng(7)
g = rng.random((256, 256)).astype(np.float32)
g = 0.5 * (g + np.roll(g, (128, 128), (0, 1)))
gray = (g * 255).astype(np.uint8)
alpha = np.clip((gray.astype(np.int16) - 128) * 1.2 + 128, 0, 255).astype(np.uint8)
img = Image.merge("LA", (Image.fromarray(gray), Image.fromarray(alpha)))
img.save(os.path.join(TEX, "grain.png"))

# paper fiber: vertical-ish soft mottling
p = tileable(256, 256, 11, 6, (1.0, 0.6, 0.35, 0.2))
p = (p * 255).astype(np.uint8)
Image.merge("LA", (Image.fromarray(p), Image.fromarray(np.full_like(p, 255)))).save(os.path.join(TEX, "paper.png"))

# wrinkle: large soft light-blotches
w = tileable(512, 512, 23, 20, (1.0, 0.55, 0.3))
w2 = np.asarray(Image.fromarray((w * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), np.float32) / 255.0
blur = (np.clip(np.abs(w2 - 0.5) * 2.4, 0, 1) * 255).astype(np.uint8)
Image.merge("LA", (Image.fromarray(blur), Image.fromarray(np.full_like(blur, 210)))).save(os.path.join(TEX, "wrinkle.png"))

# dots + stripes for bauhaus / constructivism (procedural, crisp)
d = np.zeros((64, 64), np.uint8)
yy, xx = np.mgrid[0:64, 0:64]
d[((xx - 32) ** 2 + (yy - 32) ** 2) < 150] = 255
Image.fromarray(d, "L").save(os.path.join(TEX, "dot.png"))

s = np.zeros((8, 8), np.uint8)
for i in range(8):
    s[i, :] = 255 if i < 4 else 0
Image.fromarray(s, "L").resize((16, 16), Image.NEAREST).save(os.path.join(TEX, "stripe.png"))
print("textures done", os.listdir(TEX))
