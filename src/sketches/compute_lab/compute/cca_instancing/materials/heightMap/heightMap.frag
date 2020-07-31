
varying vec2 vUv;
uniform sampler2D ccaMap;

void main() {

    vec4 color = texture2D( ccaMap, vUv );

    gl_FragColor = color;

}