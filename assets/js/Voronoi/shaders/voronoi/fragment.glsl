uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 N22 (vec2 p) {
  vec3 a = fract(vec3(p.xyx) * vec3(123.34, 234.34, 345.65));
  a += dot(a, a + 34.45);
  return fract(vec2(a.x * a.y, a.z * a.y));
}

vec2 rand(vec2 co){
    return vec2(
        fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453),
        fract(cos(dot(co.yx ,vec2(8.64947,45.097))) * 43758.5453)
    )*2.0-1.0;
}

void main () {
  float m = 0.0;
  float minDist = 100.0;

  for (float i = 0.0; i < 50.0; i++) {
    vec2 n = N22(vec2(i)) - 0.5;
    vec2 p = sin(n * uTime * 0.5) * 0.5 + 0.5;
    float d = length(vUv - p);
    m += smoothstep(0.005, 0.0025, d);

    if(d < minDist) {
      minDist = d;
    }
  }

  vec3 color = vec3(minDist);
  gl_FragColor = vec4(color, 1.0);
}