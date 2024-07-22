
#include ../includes/object-cover.glsl;
#include ../includes/fresnel.glsl;
#include ../includes/specular.glsl;

uniform sampler2D uTexture;

uniform vec2 uResolution;

uniform float uTime;
uniform float uIor;
uniform float uRefractPower;

// Light Uniforms
uniform vec3 uLight;
uniform float uShininess;
uniform float uDiffuseness;
uniform float uFresnelPower;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main () {
  vec2 uv = vUv;
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = (normalize(vPosition - cameraPosition));

   float iorRatio = 1.0 / uIor;

  vec3 refractVec = refract(viewDirection, normal, iorRatio);

  // Create circle
  float strength = 1.0 - step(0.49, abs(distance(vUv, vec2(0.5))));

  // Apply texture
  vec2 textureUv = objectCover(vUv, uResolution, vec2(1.0, 1.0));
  vec4 color = texture2D(uTexture, textureUv + refractVec.xy * uRefractPower);

    // Specular
  float specularLight = specular(normal, viewDirection, uLight, uShininess, uDiffuseness);
  color += specularLight;

  // Fresnel
  float f = fresnel(viewDirection, normal, uFresnelPower);  
  color.rgb += f * vec3(1.0);

  gl_FragColor = vec4(color.rgb, strength);
  // gl_FragColor = vec4(normal, strength);
}