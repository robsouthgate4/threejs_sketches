
  
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

	vec2 uv = vUv;

	//fetch each neighbor texel and current texel.
    //top row
    int r00 = int( texture2D( uReadTexture, uv + vec2(-1., 1. ) / uResolution ).r );
    int r01 = int( texture2D( uReadTexture, uv + vec2( 0., 1. ) / uResolution ).r );
    int r02 = int( texture2D( uReadTexture, uv + vec2( 1., 1. ) / uResolution ).r );
 
    //middle row
    int r10 = int( texture2D( uReadTexture, uv + vec2(-1., 0. ) / uResolution ).r );
    int r11 = int( texture2D( uReadTexture, uv ).r );
    int r12 = int( texture2D( uReadTexture, uv + vec2( 1., .0 ) / uResolution ).r );
   
    //bottom row
    int r20 = int( texture2D( uReadTexture, uv + vec2(-1.,-1. ) / uResolution ).r );
    int r21 = int( texture2D( uReadTexture, uv + vec2( 0.,-1. ) / uResolution ).r );
    int r22 = int( texture2D( uReadTexture, uv + vec2( 1.,-1. ) / uResolution ).r );
 
    //conways game of life rules:
    //if neighbor count including self is 3, the next generation cell is alive
    //if neighbor count including self is 4, and current cell is alive, the next generation cell is alive
    //otherwise, the next generation cell is dead.

    int finalSum = (r00 + r10 + r20) +
                   (r01 + r11 + r21) +
                   (r02 + r12 + r22);
 
    if(finalSum == 3)
            gl_FragColor = vec4( 1.,1.,1.,1. );
    else if(finalSum == 4 && r11 == 1)
            gl_FragColor = vec4( 1.,1.,1.,1. );
    else
            gl_FragColor = vec4( 0.,0.,0.,1. );


}