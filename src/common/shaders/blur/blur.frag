

precision highp float;

uniform sampler2D   uTexture;
uniform vec2        uResolution;
varying vec2        vUv;

void main() {


	vec2 texSize        = uResolution;
    vec2 fragCoord      = gl_FragCoord.xy;

	gl_FragColor        = texture2D( uTexture, vUv );

	const float size    = 4.0;

	if (size <= 0.0) { return; }

	float separation    = 1.0;
	separation          = max(  separation, 1.0 );

	gl_FragColor.rgb     = vec3(0.0);

	for ( float i = -size; i <= size; ++i ) {

	 	for ( float j = -size; j <= size; ++j ) {

	 	    gl_FragColor.rgb += texture2D( uTexture, ( fragCoord + ( vec2( i, j ) * separation ) ) / uResolution ).rgb;

	 	}
	}

	gl_FragColor.rgb    /= pow( float( size ) * 2.0 + 1.0, 2.0 );

	gl_FragColor.a	    = 1.0;

}