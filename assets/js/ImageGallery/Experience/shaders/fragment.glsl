#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisplacement;

uniform vec2 uTextureAspect1;
uniform vec2 uTextureAspect2;

uniform vec2 uMouse;

uniform vec2 uResolution;

uniform float uProgress;
uniform float uParallax;
uniform float uBorderThickness;

vec2 aspect(vec2 size) {
  return size / min(size.x, size.y);
}

vec2 objectCover(vec2 uv, vec2 imageBounds, vec2 resolution) {
  vec2 s = aspect(resolution);
  vec2 i = aspect(imageBounds);
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 newUv = vUv * s / new + offset;
  return (newUv - vec2(0.5, 0.5)) / 1.0 + vec2(0.5, 0.5);
}

float sdCircle(vec2 uv, float r, vec2 offset) {
  float x = uv.x - offset.x;
  float y = uv.y - offset.y;

  return length(vec2(x, y)) - r;
}

float sdSquare(vec2 uv, float size, vec2 offset) {
  float x = uv.x - offset.x;
  float y = uv.y - offset.y;

  return max(abs(x), abs(y)) - size;
}

vec2 calculateDisplacement(vec2 uv, vec4 displacement) {
  float theta = displacement.r * PI * 2.0;
  vec2 dir = vec2(sin(theta), cos(theta));
  vec2 dis = dir * displacement.r * 0.05;
  return dis;
}

float createHole(vec2 uv, float progress, vec2 offset, vec2 resolution) {
  float holeX = 0.5 * resolution.x/resolution.y + offset.x;
  float holeY = (progress - 0.05) + (offset.y) + 0.5;

  float squareHoleX = 0.5 * resolution.x/resolution.y + offset.x;
  float squareHoleY = 0.45 + offset.y;

  float hole = 1.0 - step(0.0, sdCircle(uv, progress, vec2(holeX, holeY)));
  float squareHole = 1.0 - step(0.0, sdSquare(uv, progress, vec2(squareHoleX, squareHoleY)));

  hole = max(hole, squareHole);

  return hole;
}

void main( void ) {
  vec4 displacement = texture2D(uDisplacement, vUv);
  // Calculate displacement from water texture
  vec2 dis = calculateDisplacement(vUv, displacement);

  vec2 uv = vUv;
  uv.x *= uResolution.x/uResolution.y;

  // Texture UVs
  vec2 uvDis = dis + uMouse * uParallax;
  // Scale and position textures to cover window
  // Displace textures based on water displacement
  vec2 uv1 = objectCover(uv, uTextureAspect1, uResolution) + uvDis;
  vec2 uv2 = objectCover(uv, uTextureAspect2, uResolution) + uvDis;

  // Textures
  vec4 t1 = texture2D(uTexture1, uv1);
  vec4 t2 = texture2D(uTexture2, uv2);

  // Create hole
  float hole = createHole(uv, uProgress, uMouse * uParallax, uResolution);
  float border = createHole(uv, uProgress + uBorderThickness, uMouse * uParallax, uResolution);

  // Subtract hole from border to create white border
  border -= hole;

  // Mix
  // Mix two textures based on hole - Texture one outside of hole, texture 2 inside hole
  vec4 color = mix(t1, t2, hole);
  // Darken images
  color = mix(color, vec4(0.0, 0.0, 0.0, 0.1), 0.25);
  // Add border
  color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), border);

  gl_FragColor = color;
}