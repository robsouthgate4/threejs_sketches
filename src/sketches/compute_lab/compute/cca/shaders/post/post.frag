#pragma glslify: aces = require(glsl-tone-map/aces)
#pragma glslify: uncharted2 = require(glsl-tone-map/uncharted2)
#pragma glslify: lottes = require(glsl-tone-map/lottes)
#pragma glslify: reinhard = require(glsl-tone-map/reinhard)
#pragma glslify: reinhard2 = require(glsl-tone-map/reinhard2)
#pragma glslify: uchimura = require(glsl-tone-map/uchimura)
#pragma glslify: filmic = require(glsl-tone-map/filmic)
#pragma glslify: unreal = require(glsl-tone-map/unreal)

#pragma glslify: fxaa = require(glsl-fxaa)

#include <packing>

varying vec2        vUv;
uniform sampler2D   tDiffuse;
uniform sampler2D   tUV;
uniform sampler2D   tDepth;
uniform sampler2D   tNormal;
uniform sampler2D   tRainbow;
uniform float       cameraNear;
uniform float       cameraFar;
uniform int         uNStates;
uniform int         uCount;
uniform int         uThreshold;
uniform vec2        resolution;

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

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


void main() {

    vec2 st             = vUv;

    //vec3 diffuse        = texture2D( tDiffuse, st ).rgb;

    vec2 fragCoord      = st * resolution;
    vec3 diffuse        = fxaa( tDiffuse, fragCoord, resolution ).rgb;

    float mask          = 1.0 - length( st - vec2( 0.5 ) );

    mask                = step( 1.0 - mask, 0.5 );

    float state         = diffuse.r;
    //state               = state / float( uNStates );

    float count         = diffuse.b;
    count               = count / float( uThreshold );

    vec3 hsb            = vec3( 0., .9, 1. ); 

    if ( false ) {

        hsb.x = state;

    }

    if ( false ) {

        hsb.x = hsb.y = hsb.z = state;

    }

    gl_FragColor.rgb    = vec3( state );
 
    gl_FragColor.a      = 1.0;

}