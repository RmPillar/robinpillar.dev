
uniform float uTime;
uniform float uBorderThickness;
uniform float uBorderSoftness;
uniform float uGrainSize;
uniform float uZMultiplier;
uniform float uMaxZ;
uniform float uSpeed;

varying vec2 vUv;

#include ../includes/voronoi.glsl;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float speed = uSpeed;

  vec3 c = voronoi(uGrainSize * uv, uTime, speed);

  // Cell Color
  vec3 cellColor = vec3(0.0, 0.0, 0.0);
  vec3 borderColor = vec3(1.0, 1.0, 1.0);
  // borders	
  vec3 color = mix(borderColor, cellColor, smoothstep( uBorderThickness, uBorderThickness + uBorderSoftness, c.x));

  modelPosition.z = min(c.x * uZMultiplier, uMaxZ);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
}