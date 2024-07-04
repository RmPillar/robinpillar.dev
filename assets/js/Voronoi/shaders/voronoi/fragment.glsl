#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uBorderThickness;
uniform float uBorderSoftness;
uniform float uGrainSize;
uniform float uSpeed;

uniform vec2 uResolution;
uniform vec2 uTextureAspect;

uniform sampler2D uTextureOne;

varying vec2 vUv;
varying vec3 vNormal;

#include ../includes/object-cover.glsl;
#include ../includes/voronoi.glsl;

void main()
{
    vec3 normal = normalize(vNormal);

    float speed = uSpeed;

    vec3 c = voronoi(uGrainSize * vUv, uTime, speed);

	  // Cell Color
    vec3 cellColor = vec3(0.0, 0.0, 0.0);
    vec3 borderColor = vec3(1.0, 1.0, 1.0);

    // borders	
    vec3 color = mix(borderColor, cellColor, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, c.x));

    vec2 textureUv = objectCover(vUv, uTextureAspect, uResolution);

    vec4 textureOne = texture2D(uTextureOne, textureUv);

    gl_FragColor = mix(textureOne, vec4(borderColor, 1.0), color.x);

    // gl_FragColor = vec4(normal, 1.0);
}