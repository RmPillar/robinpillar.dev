varying vec2 vUv;

uniform sampler2D uCurrentPosition;
uniform sampler2D uOriginalPosition;
uniform sampler2D uOriginalPositionOne;
uniform vec3 uMouse;
uniform float uProgress;
uniform float uFriction;
uniform float uBounceBack;
uniform float uMouseForce;
uniform float uTime;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main () {
  float offset = rand(vUv);

  vec2 position = texture2D(uCurrentPosition, vUv).xy;
  vec2 originalPosition = texture2D(uOriginalPosition, vUv).xy;
  vec2 originalPositionOne = texture2D(uOriginalPositionOne, vUv).xy;

  vec2 finalOriginalPosition = mix(originalPosition, originalPositionOne, uProgress);

  vec2 velocity = texture2D(uCurrentPosition, vUv).zw;
  velocity *= uFriction;

  // Attract to Original Position Force
  vec2 direction = normalize(finalOriginalPosition - position);
  float dist = length(finalOriginalPosition - position);
  if(dist > 0.01) {
    velocity += direction * uBounceBack;
  } 

  // Mouse Repel Force
  float mouseDistance = distance(position, uMouse.xy);
  float maxDistance = 0.1;
  if(mouseDistance < maxDistance) {
    vec2 direction = normalize(position - uMouse.xy);
    velocity += direction * (1.0 - mouseDistance / maxDistance) * uMouseForce;
  }
  // Lifespan of a particle
  float lifespan = 2.0;
  float age = mod(uTime + lifespan * offset, lifespan);

  if(age < 0.1) {
    velocity = vec2(0.0, 0.001);
    position.xy = finalOriginalPosition;
  }

  position.xy += velocity;

  gl_FragColor = vec4(position, velocity);
}