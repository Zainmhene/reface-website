import sys, json
import numpy as np
from PIL import Image, ImageFilter

def s2l(c):
    c = np.asarray(c, dtype=np.float32)
    return np.where(c <= 0.04045, c/12.92, ((c+0.055)/1.055)**2.4)
def l2s(c):
    c = np.clip(c, 0, None)
    return np.where(c <= 0.0031308, c*12.92, 1.055*np.power(c, 1/2.4)-0.055)
def hex2rgb(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16)/255 for i in (0,2,4)], dtype=np.float32)

def hsv(rgb):
    r,g,b = rgb[...,0],rgb[...,1],rgb[...,2]
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx-mn+1e-6
    h = np.where(mx==r, ((g-b)/d)%6, np.where(mx==g, (b-r)/d+2, (r-g)/d+4))*60
    s = np.where(mx>0, (mx-mn)/(mx+1e-6), 0)
    return h, s, mx

def make_mask(rgb, hue_c, hue_w, s_min, v_min, excl=(), incl_only=None, grow=1, blur=1.2):
    h,s,v = hsv(rgb)
    dh = np.abs(((h - hue_c + 180) % 360) - 180)
    m_h = np.clip(1 - (dh - hue_w)/12, 0, 1)
    m_s = np.clip((s - s_min)/0.06, 0, 1)
    m_v = np.clip((v - v_min)/0.05, 0, 1)
    m = m_h*m_s*m_v
    H,W = m.shape
    for (x0,y0,x1,y1) in excl:
        m[int(y0*H):int(y1*H), int(x0*W):int(x1*W)] = 0
    if incl_only:
        keep = np.zeros_like(m)
        for (x0,y0,x1,y1) in incl_only:
            keep[int(y0*H):int(y1*H), int(x0*W):int(x1*W)] = 1
        m *= keep
    im = Image.fromarray((m*255).astype(np.uint8))
    im = im.filter(ImageFilter.MedianFilter(3))
    for _ in range(grow): im = im.filter(ImageFilter.MaxFilter(3))
    im = im.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(im).astype(np.float32)/255

def recolour(rgb, mask, target_hex, ref_y=None, keep_chroma=0.0):
    lin = s2l(rgb)
    Y = lin @ np.array([0.2126,0.7152,0.0722], dtype=np.float32)
    if ref_y is None:
        ref_y = float(np.median(Y[mask>0.6]))
    T = s2l(hex2rgb(target_hex))
    ratio = (Y/ref_y)
    Yt = float(T @ np.array([0.2126,0.7152,0.0722], dtype=np.float32))
    if Yt > 0.25:
        from PIL import ImageFilter as F
        r = Image.fromarray(np.clip(ratio*60,0,255).astype(np.uint8)).filter(F.GaussianBlur(0.7))
        ratio = np.asarray(r).astype(np.float32)/60
        ratio = np.power(np.maximum(ratio,1e-4), 0.78)
    new = T*ratio[...,None]
    # soft shoulder
    k=0.82
    new = np.where(new>k, k + (1-k)*(1-np.exp(-(new-k)/(1-k))), new)
    out = l2s(new)
    m = mask[...,None]
    return np.clip(rgb*(1-m) + out*m, 0, 1), ref_y

if __name__ == "__main__":
    cfg = json.load(open(sys.argv[1]))
    for job in cfg["jobs"]:
        src = Image.open(job["src"]).convert("RGB")
        rgb = np.asarray(src).astype(np.float32)/255
        mask = make_mask(rgb, **job["mask"])
        Image.fromarray((mask*255).astype(np.uint8)).save(job["preview"])
        ref=None
        for c in job["colours"]:
            if c.get("original"):
                img = src
            else:
                out, ref = recolour(rgb, mask, c["hex"], ref)
                img = Image.fromarray((out*255+0.5).astype(np.uint8))
            for w in job["widths"]:
                h = round(img.height*w/img.width)
                img.resize((w,h), Image.LANCZOS).save(f'{job["out"]}-{c["id"]}-{w}.webp', quality=job.get("q",80), method=6)
        print(job["out"], "ref", ref)
