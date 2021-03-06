precision highp int;
precision highp float;
  
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

	vec2 id = vUv;

	float state = texture2D( uReadTexture, id ).r;
	
	float count = 0.;
	
	float next1  = state + 1. == float( uNStates ) ? 0. : state + 1.;
	// float next2  = 0.; 

	// if ( next1 >= 0. && next1 <= 17. )
	// {
	// 	next1 = 0.;
	// }
	// if ( next1 >= 40. && next1 <= 42. )
	// {
	// 	next1 = 1.;
	// }

	// if ( next2 >= 10. && next2 <= 13. )
	// {
	// 	next2 = 1.;
	// }
	// if ( next2 >= 9. && next2 <= 21. )
	// {
	// 	next2 = 0.;
	// }

	const float range = 1.0;

    for ( float x = -range; x <= range; x ++ ) {

        for ( float y = -range; y <= range; y ++ ) {

            if ( (x == 0.0 && y == 0.0 ) ) {

				continue;

			}

			if ( uMoore || ( x == 0.0 || y == 0.0 ) ) {

				vec2 offset = vec2( x, y ) / uResolution;

				float s = texture2D( uReadTexture, id + offset ).r;
	
				if ( s == next1 )
				{
					count++;
				}

			}

        }

    }

	if ( count >= float( uThreshold ) ) {

		state = mod( state + 1., float( uNStates ) );

	}

    gl_FragColor.rgb = vec3( state, count, 0. );

}