// Includes
#include ../includes/object-cover.glsl;
#include ../includes/voronoi.glsl;
#include ../includes/saturate.glsl;
#include ../includes/specular.glsl;
#include ../includes/fresnel.glsl;

// Voronoi Uniforms
uniform sampler2D uTexture;
uniform float uBorderThickness;
uniform float uBorderSoftness;
uniform float uGrainSize;
uniform float uSpeed;

// Refraction Uniforms
uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;
uniform float uChromaticAberration;
uniform float uRefractPower;
uniform float uSaturation;
uniform int uSamples;

// Light Uniforms
uniform vec3 uLight;
uniform float uShininess;
uniform float uDiffuseness;
uniform float uFresnelPower;

// Other Uniforms
uniform float uTime;
uniform bool uShowSpecular;
uniform bool uShowNormals;
uniform bool uShowDisplacement;

// Varyings
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vCameraVector;
varying vec3 vPosition;

void main()
{
    vec3 normal = normalize(vNormal) * 0.5;
    vec3 viewDirection = (normalize(vPosition - cameraPosition));
    float speed = uSpeed;

    float iorRRatio = 1.0 / uIorR; // Red Refractive Index
    float iorYRatio = 1.0 / uIorY; // Yellow Refractive Index
    float iorGRatio = 1.0 / uIorG; // Green Refractive Index
    float iorCRatio = 1.0 / uIorC; // Cyan Refractive Index
    float iorBRatio = 1.0 / uIorB; // Blue Refractive Index
    float iorPRatio = 1.0 / uIorP; // Violet Refractive Index

    // Starting color
    vec3 color = vec3(0.0);

    // Take many samples to get a better chromatic abberation effect
    // More samples = smoother chromatic abberation, but slower performance
    for ( int i = 0; i < uSamples; i ++ ) {
      float slide = float(i) / float(uSamples) * 0.1;

      // Refract each color channel separately (Red, Yellow, Green, Cyan, Blue, and Violet)
      vec3 refractVecR = refract(viewDirection, normal, iorRRatio);
      vec3 refractVecY = refract(viewDirection, normal, iorYRatio);
      vec3 refractVecG = refract(viewDirection, normal, iorGRatio);
      vec3 refractVecC = refract(viewDirection, normal, iorCRatio);
      vec3 refractVecB = refract(viewDirection, normal, iorBRatio);
      vec3 refractVecP = refract(viewDirection, normal, iorPRatio);

      float r = texture2D(uTexture, vUv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;

      float y = (texture2D(uTexture, vUv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                texture2D(uTexture, vUv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                texture2D(uTexture, vUv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

      float g = texture2D(uTexture, vUv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;

      float c = (texture2D(uTexture, vUv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                texture2D(uTexture, vUv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                texture2D(uTexture, vUv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
          
      float b = texture2D(uTexture, vUv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;

      float p = (texture2D(uTexture, vUv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                texture2D(uTexture, vUv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                texture2D(uTexture, vUv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

      // Combine the refracted color channels 
      float R = r + (2.0 * p + 2.0 * y - c) / 3.0;
      float G = g + (2.0 * y + 2.0 * c - p) / 3.0;
      float B = b + (2.0 * c + 2.0 * p - y) / 3.0;

      // Add the color from this sample to the total color
      color.r += R;
      color.g += G;
      color.b += B;

      // Adjust the saturation of the color
      color = saturate(color, uSaturation);
    };

    // Average the color
    color /= float(uSamples);

    // Specular
    float specularLight = specular(normal, viewDirection, uLight, uShininess, uDiffuseness);
    color += specularLight;

    // Fresnel
    float f = fresnel(viewDirection, normal, uFresnelPower);
    color.rgb += f * vec3(1.0);

    // Noise
    // color += vec3(noise(vUv).x * 0.2);

    gl_FragColor = vec4(color, 1.0);

    if (uShowDisplacement) {
      vec4 cellColor = vec4(0.0, 0.0, 0.0, 1.0);
      vec4 borderColor = vec4(1.0, 1.0, 1.0, 1.0);

      // Voronoi
      vec3 c = voronoi(uGrainSize * vUv, uTime, speed);
      
      vec4 displacementColor = mix(borderColor, cellColor, smoothstep(uBorderThickness, uBorderThickness + uBorderSoftness, c.x));

      gl_FragColor = displacementColor;
    }

    if (uShowSpecular) {
      gl_FragColor = vec4(specularLight, specularLight, specularLight, 1.0);
    }

    if (uShowNormals) {
      gl_FragColor = vec4(normal, 1.0);
    }
}