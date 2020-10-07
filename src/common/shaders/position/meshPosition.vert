
varying vec2    vUv;

varying vec4    vWorldPosition;

void main() {

    vUv             = uv;

    vWorldPosition  = modelMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}