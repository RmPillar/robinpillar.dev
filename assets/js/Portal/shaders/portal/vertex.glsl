uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uSpeed;
uniform float uShift;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  float shift = uShift;

  // Base position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Shifted positions
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
  vec3 modelPositionB = modelPosition.xyz + vec3(0.0, shift, 0.0);

  // Shifted UVs 
  vec2 uvA = uv + vec2(shift, 0.0);
  vec2 uvB = uv + vec2(0.0, shift);

  // Compute distances
  float dist = distance(uv, vec2(0.5));
  float distA = distance(uvA, vec2(0.5));
  float distB = distance(uvB, vec2(0.5));

  // Displace Z
  float waveZ = sin(dist * uFrequency - uTime * uSpeed) * uAmplitude;
  float waveZA = sin(distA * uFrequency - uTime * uSpeed) * uAmplitude;
  float waveZB = sin(distB * uFrequency - uTime * uSpeed) * uAmplitude;

  modelPosition.z += waveZ;
  modelPositionA.z += waveZA;
  modelPositionB.z += waveZB;

  // Compute normal
  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computedNormal = cross(toA, toB);

  // Position
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Varyings
  vUv = uv;
  vNormal = computedNormal;
  vPosition = modelPosition.xyz;
}