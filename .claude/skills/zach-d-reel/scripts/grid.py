# grid.py <dir> <frames comma> <x0> <y0> <x1> <y1> <out> [scale] [cols]  -> crops with a 20px grid + absolute coords, tiled
import sys
from PIL import Image, ImageDraw, ImageFont
d, fr, x0, y0, x1, y1, out = sys.argv[1], [int(v) for v in sys.argv[2].split(',')], *map(int, sys.argv[3:7]), sys.argv[7]
sc = float(sys.argv[8]) if len(sys.argv) > 8 else 2
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 11)
tiles = []
for n in fr:
    im = Image.open(f'{d}/f{n:04d}.png').convert('RGB').crop((x0, y0, x1, y1))
    im = im.resize((int((x1-x0)*sc), int((y1-y0)*sc)), Image.NEAREST); dr = ImageDraw.Draw(im)
    for gx in range((x0//20+1)*20, x1, 20):
        X = (gx-x0)*sc; dr.line([(X,0),(X,im.height)], fill=(255,0,255) if gx%100==0 else (0,255,255), width=1)
        if gx % 40 == 0: dr.text((X+1, 1), str(gx), fill=(255,255,0), font=f)
    for gy in range((y0//20+1)*20, y1, 20):
        Y = (gy-y0)*sc; dr.line([(0,Y),(im.width,Y)], fill=(255,0,255) if gy%100==0 else (0,255,255), width=1)
        dr.text((1, Y+1), str(gy), fill=(255,255,0), font=f)
    dr.text((4, im.height-14), f'f{n}', fill=(255,80,80), font=f)
    tiles.append(im)
cols = int(sys.argv[9]) if len(sys.argv) > 9 else 3
W, H = tiles[0].size; rows = (len(tiles)+cols-1)//cols
o = Image.new('RGB', (W*cols, H*rows))
for i, t in enumerate(tiles): o.paste(t, ((i%cols)*W, (i//cols)*H))
o.save(out)
