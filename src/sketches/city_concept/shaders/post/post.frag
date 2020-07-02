#include <packing>

varying vec2        vUv;
uniform sampler2D   tDiffuse;
uniform sampler2D   tUV;
uniform sampler2D   tDepth;
uniform sampler2D   tNormal;
uniform sampler2D   tRainbow;
uniform float       cameraNear;
uniform float       cameraFar;

#define PI 3.14159265359
#define TWO_PI 6.28318530718


float readDepth( sampler2D depthSampler, vec2 coord ) {

    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
    
}

mat2 rotate2d( float angle ){

    return mat2( cos( angle ),-sin( angle ),
                sin( angle ), cos( angle ));
                
}

float circle( in vec2 _st, in float _radius ){

    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius * 0.01),
                         _radius+(_radius * 0.902),
                         dot(dist,dist)*4.0);

}

void main() {

    vec2 st             = vUv;

    vec3 diffuse        = texture2D( tDiffuse, st ).rgb;
      

    // Screen based textures

    vec3 normal         = texture2D( tNormal, st ).rgb;
    vec2 uvs            = texture2D( tUV, st ).rg;
    float depth         = readDepth( tDepth, st );

    gl_FragColor.rgb    = diffuse;

    gl_FragColor.a      = 1.0;

}