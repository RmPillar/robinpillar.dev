uniform sampler2D uTexture;

varying vec3 vWorldNormal;
varying vec3 vEyeVector;
varying vec2 vUv;

void main () {
  float iorRatio = 1.0 / 1.31;

vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
  vec3 normal = vWorldNormal;
  vec3 refractVec = refract(vEyeVector, normal, iorRatio);

  vec4 color = texture2D(uTexture, vUv + refractVec.xy);

  gl_FragColor = color;
}