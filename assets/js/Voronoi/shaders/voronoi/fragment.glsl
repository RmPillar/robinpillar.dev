uniform float uTime;
uniform float uBorderThickness;
uniform float uBorderSoftness;
uniform float uGrainSize;
uniform float uSpeed;
uniform float uIor;
uniform bool uShowNormals;

uniform vec2 uResolution;
uniform vec2 uTextureAspect;

uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vCameraVector;
varying vec3 vPosition;

#include ../includes/object-cover.glsl;
#include ../includes/voronoi.glsl;

void main()
{
    vec3 normal = normalize(vNormal);
    float iorRatio = 1.0 / uIor;
    float speed = uSpeed;

    // Texture
    // vec2 textureUv = objectCover(vUv, uTextureAspect, uResolution);
    // vec4 texture = texture2D(uTexture, textureUv);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 refractVec = refract(viewDirection, normal, iorRatio);

    vec4 texture = texture2D(uTexture, vUv + refractVec.xy);

    vec3 c = voronoi(uGrainSize * vUv, uTime, speed);

	  // Cell Color
    vec4 cellColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 borderColor = vec4(0.0, 0.0, 0.0, 0.0);

    // borders	
    vec4 color = mix(borderColor, texture, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, c.x));

    // gl_FragColor = color;
    gl_FragColor = mix(texture, cellColor, 0.1);
    // gl_FragColor = vec4(refractVec, 1.0);

    if(uShowNormals) {
        gl_FragColor = vec4(normal, 1.0);
    }
}