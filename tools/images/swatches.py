import json, sys, re
import numpy as np
from PIL import Image
S = sys.argv[1]; OUT = sys.argv[2]
k = 220/110
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def med(img, box):
    a = np.asarray(img.crop(box).convert('RGB')).reshape(-1,3)
    return '#%02x%02x%02x' % tuple(int(v) for v in np.median(a,axis=0))
out = {"vinyl":[], "gloss":[], "supermatt":[], "doors":[]}
hv = Image.open(f"{S}/pdf/hv-13.png").convert('RGB')
names = [["Cashmere Oak","Dark Concrete","Dust Grey Oak","Graphite Oak","Indigo Oak","Ivory Oak"],
 ["Light Casella Oak","Light Concrete","Light Grey Oak","Mussel Oak","Parisian Blue Oak","Reed Green Oak"],
 ["Stone Grey Oak","Ultra Matt Black","Ultra Matt Cashmere","Ultra Matt Dust Grey","Ultra Matt Fir Green","Ultra Matt Graphite"],
 ["Ultra Matt Indigo","Ultra Matt Light Grey","Ultra Matt Mussel","Ultra Matt Pale Cream","Ultra Matt Parisian Blue","Ultra Matt Pebble"],
 ["Ultra Matt Reed Green","Ultra Matt Stone Grey","Ultra Matt White","Ultra Matt White Grey","White Oak"]]
xs=[74,201,328,456,584,712]; ys=[118,320,522,725,927]
for r,row in enumerate(names):
    for c,n in enumerate(row):
        x,y=xs[c]*k,ys[r]*k; w,h=90*k,150*k
        box=(int(x+8),int(y+8),int(x+w-8),int(y+h-8))
        hexv=med(hv,box)
        tile=hv.crop(box).resize((120,200), Image.LANCZOS)
        textured = ('Oak' in n) or ('Concrete' in n)
        fn=f"vinyl-{slug(n)}.webp"
        tile.save(f"{OUT}/swatches/{fn}", quality=82)
        out["vinyl"].append({"id":slug(n),"name":n,"hex":hexv,"tile":f"assets/img/swatches/{fn}","textured":textured})
doors=[["Alnwick","Amble","Arko","Ascot","Ashford"],["Geneva","Glendale","Kielder","Lincoln","Matfen"],["Melbury","Milo","Monaco","Portree","Premier"],["Scoop","Shaker","Sherwood","Turnberry","York"]]
dx=[1016,1169,1322,1476,1629]; dy=[186,420,655,890]
for r,row in enumerate(doors):
    for c,n in enumerate(row):
        x,y=dx[c]*k,dy[r]*k
        box=(int(x),int(y),int(x+113*k),int(y+203*k))
        im=hv.crop(box)
        im.save(f"{OUT}/doors/{slug(n)}.webp", quality=85)
        out["doors"].append({"id":slug(n),"name":n,"img":f"assets/img/doors/{slug(n)}.webp"})
hg = Image.open(f"{S}/pdf/hg-03.png").convert('RGB')
gl=[["Cashmere","Dust Grey","Graphite","Indigo"],["Light Grey","Metallic Anthracite","Metallic Blue","Metallic Champagne"],["Parisian Blue","Reed Green","White"]]
sm=[["Black","Cashmere","Dust Grey","Fir Green"],["Graphite","Indigo","Light Grey","Pale Cream"],["Parisian Blue","Reed Green","Stone Grey","White"]]
gy=[284,558,833]
for grid,xs2,key,label in [(gl,[66,224,384,543],"gloss","High Gloss"),(sm,[987,1147,1306,1465],"supermatt","Super Matt")]:
    for r,row in enumerate(grid):
        for c,n in enumerate(row):
            x,y=xs2[c]*k,gy[r]*k
            box=(int(x+60*k),int(y+120*k),int(x+120*k),int(y+225*k))
            out[key].append({"id":slug(n),"name":f"{label} {n}","hex":med(hg,box)})
json.dump(out, open(f"{S}/swatches.json","w"), indent=1)
for key in ["vinyl","gloss","supermatt"]:
    print(key, [(s["name"],s["hex"]) for s in out[key]])
