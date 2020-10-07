
float random(vec2 coords) {

   return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);

}

#pragma glslify: export( random )