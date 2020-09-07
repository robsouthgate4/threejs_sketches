

varying vec2 vUv;

void main() {

    vec2 uv = gl_FragCoord.xy / vec2( 512., 512. );

    vec4 color  = texture2D( tPositions, uv );

    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );

}