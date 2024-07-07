varying vec2 vUv;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec3 transformedNormal = normalMatrix * normal;

  // Varyings
  vUv = uv;
  vEyeVector = normalize(modelPosition.xyz - cameraPosition);
  vWorldNormal = normalize(transformedNormal);
}