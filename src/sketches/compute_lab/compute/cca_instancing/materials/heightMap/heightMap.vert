varying vec2 vUv;

uniform sampler2D ccaMap;

void main() {

    vUv = uv;

    vec4 color  = texture2D( ccaMap, vUv );

    vec3 pos    = position; 

    pos.z += color.r * 0.01;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}