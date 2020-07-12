uniform sampler2D 	uReadTexture;
uniform sampler2D 	uWriteTexture;
uniform float 		uTexelSize;
uniform vec2 		uResolution;
uniform float 		uDeltaTime;

uniform int 		uMaxRange;
uniform int 		uRange;
uniform int 		uMaxStates;
uniform int 		uNStates;
uniform int 		uMoore;
uniform int 		uThreshold;
uniform int 		uMaxThreshold;

varying vec2 vUv;

void main() {

	vec3 read 		= texture2D( uReadTexture, vUv ).rgb;
	
	const int range		= 1;

	int state 		= int( read.r );
	int count		= 0;

	int next 		= state + 1 == uNStates ? 0 : state + 1; // preserve higher states

	for ( int x = -range; x <= range; x ++ ) {

		for ( int y = -range; y <= range; y ++ ) {

			if ( ( x == 0 && y == 0 ) ) {

				continue;
				
			}

			// if ( ( int( uMoore ) || ( x == 0 || y == 0 ) ) ) {

			// 	//count += int( texture2D( uReadTexture, vUv + vec2( float( x ), float( y ) ) ) );

			// }
			
		}

	}

	vec3 write      = read.rgb += 0.1; 	

	vec3 s 			= write / float( uNStates );

    gl_FragColor 	= vec4( s, 1.0 );

}