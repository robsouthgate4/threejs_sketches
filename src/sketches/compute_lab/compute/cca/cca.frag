
  
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

void main() {

	vec2 uv = vUv;

	int state = int( texture2D( uReadTexture, uv + vec2( 0, 0 ) / uResolution ).r );
	int count = 0;
	int next  = state + 1 == uNStates ? 0 : state + 1;

	const int range = 1;

    for ( int x = -range; x <= range; x += range ) {

        for ( int y = -range; y <= range; y += 1 ) {

            if ( x == 0 && y == 0 ) {

				continue;

			}

			if ( uMoore || ( x == 0 || y == 0 ) ) {

				int s = int( texture2D( uReadTexture, uv + vec2( x, y ) / uResolution ).r );
				count += int( s == next );

			}

        }

    }

	if ( count >= uThreshold ) {

		state = int( mod( float( state + 1 ), float( uNStates ) ) );

	}
 
    gl_FragColor = vec4( vec3( state ), 1.0 );

}