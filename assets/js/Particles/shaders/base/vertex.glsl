
  varying vec2 vUv;

  uniform float uTime;
uniform sampler2D uTexture;


  void main() {
    vec3 newPosition = position;
    vec4 color = texture2D(uTexture, uv);

    newPosition.xy = color.rg;
    // newPosition.z += sin(position.y * 50.0 + uTime) * 0.05;
    // newPosition.z += sin(position.x * 50.0 + uTime) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );

    gl_PointSize = ( 2.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;

  }