
precision highp int;
precision highp float;

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

    vec2 id             = gl_FragCoord.xy / resolution;

    float s             = texture2D( tDiffuse, id ).r;
    float count         = texture2D( tDiffuse, id ).g;
    
    s = s / float( uNStates );

    vec3 hsb            = vec3( 0., .2, 1. ); 

    vec3 state = vec3( s );

    // if ( false ) {

    //     hsb.x   = s;
    //     state   = hsb2rgb( hsb );

    // }

    // if ( false ) {

	// 	hsb.x = hsb.y = hsb.z = s;
	// 	hsb.x = mix(.3, .0, hsb.x);
	// 	hsb.y += .7;
	// 	hsb.z += .6;
	// 	state = hsb2rgb( hsb );

	// }

    // if ( false ) {
	// 	hsb.x = hsb.y = hsb.z = s;
	// 	hsb.x = mix(.3, .0, hsb.x);
	// 	hsb.y += .7;
	// 	hsb.z -= .5;
	// 	hsb.z *= 5.;
	// 	hsb.z = clamp(hsb.z, 0., 1.);
	// 	state += hsb2rgb(hsb);
	// 	state *= .7;
	// }

    // if ( false ) {

	// 	hsb.x = hsb.y = hsb.z = count;
	// 	hsb.x = mix(.7, .3, hsb.x);
	// 	hsb.y += .7;
	// 	hsb.z = clamp(hsb.z, 0., 1.);
	// 	state = hsb2rgb( hsb );

	// }

    if ( true ) {

		hsb.x = hsb.y = hsb.z = count;
		//hsb.x = lerp(.4, 1, hsb.x);  	// 1/3/4 M
		hsb.x = mix(0., .1, hsb.x);  	// 8/14/2/N
		hsb.y += .7;
		state += hsb2rgb(hsb);
		//state *= .90; // 1/3/4/M
		state *= .70;
	}

    // if ( false ) {

    //     hsb.x = hsb.y = hsb.z = state;

    // }

    id -= 0.5;
    id.x *= resolution.x / resolution.y;
    float d = length( id );

    gl_FragColor.rgb    = state;
    gl_FragColor.rgb    *= smoothstep( .5, .4, d );

}