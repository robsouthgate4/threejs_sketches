
#pragma glslify: random = require(../random.glsl)

float dither ( float noiseGranularity, vec2 coordinates ) {

	// float NOISE_GRANULARITY = 0.5/255.0;
	
	return mix( -noiseGranularity, noiseGranularity, random( coordinates ) );

}