
import sys, os, glob
from PIL import Image, ImageDraw
outdir = r"D:\Code\封面\ai-ribao-cover\out"
files = sorted([f for f in glob.glob(os.path.join(outdir, "*.png")) if not os.path.basename(f).startswith("_") and not os.path.basename(f).startswith("selftest")])
W, H = 580, 360
cols = 3
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W + 20, rows * (H + 26) + 10), (245, 247, 250))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((W - 12, H - 12))
    x = (i % cols) * W + 10
    y = (i // cols) * (H + 26) + 8
    sheet.paste(im, (x, y))
    d.text((x, y + H - 8), os.path.basename(f)[:44], fill=(60, 66, 76))
sheet.save(os.path.join(outdir, "_sheet.png"))
print("ok", sheet.size, len(files))
