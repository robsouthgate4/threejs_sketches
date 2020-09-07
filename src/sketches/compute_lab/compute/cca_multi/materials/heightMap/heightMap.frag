
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec3 vPosition;

uniform sampler2D ccaMap;

void main() {

    vec3 lightPos   =  vec3( 0., 0., 20. );

    vec3 lightColor = vec3( 0.9, 0.7, 0.4 );

    vec3 ambient        = vec3( 0.8, 0.7, 0.7 );
    
    vec3 objectColor    = vec3( 201. / 255., 134. / 255., 180. / 255. ) + vPosition.z;

    vec3 norm = normalize( vNormal ) ;

    vec3 lightDir = normalize( lightPos - vFragPos );

    float diff = max( dot ( norm, lightDir ), 0.0 );

    vec3 diffuse = lightColor * diff;  

    float specularStrength = 0.8;

    vec3 viewDir    = normalize( cameraPosition - vFragPos );

    vec3 reflectDir = reflect( -lightDir, norm );

    float spec = pow( max( dot( viewDir, reflectDir), 0.0), 1. );

    vec3 specular = specularStrength * spec * lightColor;  

    vec4 color = texture2D( ccaMap, vUv );

    vec3 result = ( ambient + diffuse + specular ) * objectColor + ( color.rgb * 0.04 );

    vec2 id = vUv;
    id -= 0.5;

    //id.x *= resolution.x / resolution.y;

    float d = 1.0 - length( id );

    gl_FragColor = vec4( color.rgb, 1.0);

    //gl_FragColor = vec4( result * d, smoothstep( 0.5, 0.6, d ) );

}