varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec3 vPosition;

uniform sampler2D ccaMap;

void main() {

    vUv = uv;

    vec4 color  = texture2D( ccaMap, vUv );

    vec3 pos    = position; 

    //rrrrrpos.z += ( color.r * 1.0 ) * 0.01;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    vFragPos    = ( modelMatrix * vec4( pos, 1.0 ) ).xyz;

    vPosition   = pos;

    vNormal     = normal + vFragPos;

}