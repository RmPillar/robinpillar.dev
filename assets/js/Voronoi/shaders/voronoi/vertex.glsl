

uniform float uTime;
uniform float uBorderThickness;
uniform float uBorderSoftness;
uniform float uGrainSize;
uniform float uHeight;
uniform float uSpeed;
uniform float uShift;

varying vec2 vUv;
varying vec3 vNormal;

#include ../includes/voronoi.glsl;

void main() {
  float speed = uSpeed;

  // Base position
  float shift = uShift;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // Shifted positions
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
  vec3 modelPositionB = modelPosition.xyz + vec3(0.0, shift, 0.0);

  // Shifted UVs 
  vec2 uvA = uv + vec2(shift, 0.0);
  vec2 uvB = uv + vec2(0.0, shift);

  // Voronoi
  vec3 voronoiPosition = voronoi(uGrainSize * uv, uTime, speed);
  vec3 voronoiPositionA = voronoi(uGrainSize * uvA, uTime, speed);
  vec3 voronoiPositionB = voronoi(uGrainSize * uvB, uTime, speed);

  // Cell Color
  vec3 cellColor = vec3(0.0, 0.0, 0.0);
  vec3 borderColor = vec3(1.0, 1.0, 1.0);
  // borders	

  vec3 color = mix(borderColor, cellColor, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, voronoiPosition.x)) * uHeight;
  vec3 colorA = mix(borderColor, cellColor, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, voronoiPositionA.x)) * uHeight;
  vec3 colorB = mix(borderColor, cellColor, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, voronoiPositionB.x)) * uHeight;

   // Displace Z
  modelPosition.z -= color.x;
  modelPositionA.z -= colorA.x;
  modelPositionB.z -= colorB.x;

  // Compute normal
  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computedNormal = cross(toA, toB);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;

  // Vertex Normal
  vNormal = computedNormal;
}