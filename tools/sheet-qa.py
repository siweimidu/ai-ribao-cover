
import os, glob
from PIL import Image, ImageDraw
qa = r"D:\Code\封面\ai-ribao-cover\out\qa"
styles = ["swiss","broadsheet","matrix","paperdoodle","cardlight","beigeRed","zine","sticker","candy","data","pastel","constructivism","bauhaus"]
layouts = ["hero","poster","split","feature"]
W,H = 300,186
for group in (["hero","poster"],["split","feature"]):
    cols = len(styles); rows = len(group)
    sheet = Image.new("RGB",(cols*W, rows*(H+16)),(245,246,248))
    d = ImageDraw.Draw(sheet)
    for r,lay in enumerate(group):
        for c,s in enumerate(styles):
            p = os.path.join(qa, s+"-"+lay+".png")
            if not os.path.exists(p): continue
            im = Image.open(p).convert("RGB").resize((W-4,H-4))
            sheet.paste(im,(c*W+2, r*(H+16)+14))
            d.text((c*W+3, r*(H+16)+2), s+"/"+lay, fill=(30,30,30))
    out = os.path.join(qa, "sheet-"+group[0]+".png")
    sheet.save(out); print(out, sheet.size)
