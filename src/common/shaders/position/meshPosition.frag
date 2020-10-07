precision highp float;

varying vec2 vUv;

varying vec4 vWorldPosition;

void main() {

    gl_FragColor = vec4( vWorldPosition.xyz, 1.0 );

}