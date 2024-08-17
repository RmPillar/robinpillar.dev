
varying vec2 vUv;
varying vec4 vNormal;
varying vec3 vPosition;

void main() {
  // Base position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Model normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  // Position
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Varyings
  vUv = uv;
  vNormal = modelNormal;
  vPosition = modelPosition.xyz;
}