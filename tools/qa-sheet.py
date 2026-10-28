
import os, glob, math
from PIL import Image, ImageDraw
QA = r"D:\Code\封面\ai-ribao-cover\out\qa"
OUT = os.path.join(QA, "sheets")
os.makedirs(OUT, exist_ok=True)
styles = ["swiss","broadsheet","matrix","paperdoodle","cardlight","beigeRed",
          "zine","sticker","candy","noir","data","pastel","constructivism","bauhaus"]
layouts = ["hero","poster","split","feature"]
pairs = [(s,l) for l in layouts for s in styles]
CW, CH = 548, 340
COLS, ROWS = 3, 2
per = COLS*ROWS
for f in glob.glob(os.path.join(OUT, "*.png")): os.remove(f)
idx = 0
n = 0
while idx < len(pairs):
    batch = pairs[idx:idx+per]
    n += 1
    sheet = Image.new("RGB",(COLS*CW, ROWS*(CH+20)),(238,240,244))
    d = ImageDraw.Draw(sheet)
    for i,(s,l) in enumerate(batch):
        p = os.path.join(QA, s+"-"+l+".png")
        if not os.path.exists(p): continue
        im = Image.open(p).convert("RGB").resize((CW-6, CH-6))
        c, r = i%COLS, i//COLS
        x, y = c*CW+3, r*(CH+20)+17
        sheet.paste(im,(x,y))
        d.text((c*CW+4, r*(CH+20)+3), "%02d  %s / %s" % (idx+i+1, s, l), fill=(20,20,20))
    out = os.path.join(OUT, "S%02d.png" % n)
    sheet.save(out)
    print(out, len(batch))
    idx += per
print("total sheets", n)
