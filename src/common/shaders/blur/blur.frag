#define M_PI 3.1415926535897932384626433832795

uniform sampler2D 	tDiffuse;
uniform vec2 		uResolution;
uniform vec2 		uStrength;

varying vec2 		vUv;

#pragma glslify: blur9 = require(../partials/blur13.glsl)

void main()
{
    vec4 diffuseColor 	= texture2D( tDiffuse, vUv );

    vec4 blurColor 		= blur9( tDiffuse, vUv, uResolution, uStrength );

    //float blurStrength 	= 1.0 - sin( vUv.y * M_PI );

    float blurStrength = smoothstep( 0.2, 0.25, distance( vUv, vec2( 0.5 ) ) );

    gl_FragColor        = mix( diffuseColor, blurColor, blurStrength );

    //gl_FragColor = vec4( vec3( blurStrength ), 1.0 );
	
}