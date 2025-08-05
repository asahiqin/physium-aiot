import os
from io import BytesIO
from PIL import Image
import numpy as np
import matplotlib.font_manager as mfm
from matplotlib import mathtext
import json

def latex2img(text, size=32, out=None, **kwds):
    color = [1,1,1]
    dpi = kwds.get('dpi', 72)
    
    bfo = BytesIO()
    prop = mfm.FontProperties(family='DejaVu Sans', size=32, weight='normal')
    mathtext.math_to_image(text, bfo, dpi=dpi,prop=prop)
    im = Image.open(bfo)
    r, g, b, a = im.split()
    r, g, b = 255-np.array(r), 255-np.array(g), 255-np.array(b)
    a = r/3 + g/3 + b/3
    r, g, b = r*color[0], g*color[1], b*color[2]
    
    im = np.dstack((r,g,b,a)).astype(np.uint8)
    im = Image.fromarray(im)
    
    im = np.dstack((r,g,b,a)).astype(np.uint8)
    im = Image.fromarray(im)
    im.save(out)
    print('生成的图片已保存为%s'%out)
def generate(latex: str, describe, value, calc, unit: str, _type = "adopted"):
    symbol = latex.replace("\\", "")
    print("./assests/"+_type + "/" + symbol + ".png")
    latex2img("${}$".format(latex), out="./assests/"+_type + "/" + symbol + ".png")
    calc_out = "./assests/"+"{}/{}.png".format(_type, path(calc))
    if calc != "":
        latex2img("${}$".format(calc), out=calc_out)
    if unit != "":
        latex2img("${}$".format(unit), out="./assests/"+ "{}/{}.png".format(_type, path(unit)))
    data={
        "symbol":symbol,
        "latex":_type + "/" + symbol + ".png",
        "describe": describe,
        "value": value,
        "unit": unit,
        "unit_latex": "{}/{}.png".format(_type, path(unit)),
        "calc": calc,
        "calc_latex": "{}/{}.png".format(_type, path(calc))
    }
    print(data)
    write(data, _type)
def path(s: str):
    s=s.replace("\\", "").replace("*", "").replace("/", "")
    print(s)
    return s
def write(dict_data, _type):
    with open("./constant.json", "r") as f:
        data = json.load(f)
    with open("./constant.json", "w", encoding="utf-8") as f:
        data[_type].append(dict_data)
        json.dump(data, f, ensure_ascii=False, indent=4)
def main():
    while True:
        print("Add to constant.json")
        latex = input("symbol:")
        calc = input("calc:")
        describe = input("describe:")
        value = input("value:")
        unit = input("unit:")
        generate(latex, describe, value, calc, unit)
main()
#print( "assests/"+path("l_p/c=(\\hbar*G/c^5)^{1/2}")+".png")
#latex2img("$\\hbar/m_pc=(\\hbar*G/c^3)^{1/2}$", out="assests/universal/"+path(r"\hbar/m_pc=(\hbar*G/c^3)^{1/2}")+".png")