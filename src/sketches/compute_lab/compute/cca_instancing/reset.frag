
precision lowp int;
precision lowp float;

uniform vec2 		uResolution;
uniform float		uSeed;
uniform int			uNStates;

varying vec2 vUv;

vec2 Random( vec2 p ) {

	vec3 a = fract( p.xyx * vec3( 123.34, 234.34, 345.65 ) );
	a += dot( a, a + 34.45 );
	return fract( vec2( a.x * a.y, a.y * a.z  ) );

}

void main() {

	vec2 id 		= vUv;

	int rand 		= int( Random( id * 1. ).x * float( uNStates ) );

	vec3 write      = vec3( rand, rand, rand ); 	

    gl_FragColor 	= vec4( write, 1.0 );

}