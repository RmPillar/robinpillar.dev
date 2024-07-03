
#include ./aspect.glsl

vec2 objectCover(vec2 uv, vec2 imageBounds, vec2 scale) {
    vec2 s = aspect(scale);
    vec2 i = aspect(imageBounds);
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    vec2 newUv = uv * s / new + offset;
    vec2 zUv = (newUv - vec2(0.5, 0.5)) + vec2(0.5, 0.5);
    
    return zUv;
}