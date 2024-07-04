#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uBorderThickness;
uniform float uBorderSoftness;
uniform float uGrainSize;
uniform float uSpeed;

uniform vec2 uResolution;
uniform vec2 uTextureAspect;

uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;

#include ../includes/object-cover.glsl;
#include ../includes/voronoi.glsl;

void main()
{
    vec3 normal = normalize(vNormal);
    float speed = uSpeed;

    // Texture
    vec2 textureUv = objectCover(vUv, uTextureAspect, uResolution);
    vec4 texture = texture2D(uTexture, textureUv);

    vec3 c = voronoi(uGrainSize * vUv, uTime, speed);

	  // Cell Color
    vec4 cellColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 borderColor = vec4(0.0, 0.0, 0.0, 0.0);

    // borders	
    vec4 color = mix(borderColor, texture, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, c.x));

    gl_FragColor = color;

    // gl_FragColor = vec4(normal, 1.0);
}