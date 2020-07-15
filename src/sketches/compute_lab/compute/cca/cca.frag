
  
uniform sampler2D 	uReadTexture;
uniform sampler2D 	uWriteTexture;
uniform float 		uTexelSize;
uniform vec2 		uResolution;
uniform float 		uDeltaTime;

uniform int 		uMaxRange;
uniform int 		uRange;
uniform int 		uMaxStates;
uniform int 		uNStates;
uniform bool 		uMoore;
uniform int 		uThreshold;
uniform int 		uMaxThreshold;

varying vec2 vUv;

vec3 hsb2rgb( in vec3 c ){

    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);

}

void main() {

	vec2 uv = vUv;

	float state = texture2D( uReadTexture, uv + vec2( 0, 0 ) / uResolution ).r;
	int count = 0;
	int next  = int( state ) + 1 == uNStates ? 0 : int( state ) + 1;

	const int range = 2;
	int s = 0;

    for ( int x = -range; x <= range; x += 1 ) {

        for ( int y = -range; y <= range; y += 1 ) {

            if ( x == 0 && y == 0 ) {

				continue;

			}

			if ( uMoore || ( x == 0 || y == 0 ) ) {

				s = int( texture2D( uReadTexture, uv + vec2( x, y ) / uResolution ).r );
				count += int( s == next );

			}

        }

    }

	if ( count >= uThreshold ) {

		state = mod( float( state + 1. ), float( uNStates ) );

	}

    gl_FragColor = vec4( state, s, count, 1.0 );

}