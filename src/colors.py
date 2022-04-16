import colorsys

def rgb2hex(r, g, b):
    return "#{:02x}{:02x}{:02x}".format(r,g,b)

def hsv2rgb(h, s, v):
    return tuple(round(i * 255) for i in colorsys.hsv_to_rgb(h,s,v))

def hex2rgb(v):
    v = v.lstrip('#')
    lv = len(v)
    return tuple(int(v[i:i+lv/3], 16) for i in range(0, lv, lv/3))
    
def get_color(x):
    x %= 50
    r, g, b = hsv2rgb(x / 50, 0.3, 0.9)
    return rgb2hex(r, g, b)