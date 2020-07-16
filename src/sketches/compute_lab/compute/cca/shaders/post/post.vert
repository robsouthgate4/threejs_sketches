varying vec2 vUv;

attribute vec3  position;

uniform mat4    modelViewMatrix;
uniform mat4    projectionMatrix;

void main() {

    vUv = position.xy * 0.5 + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
}