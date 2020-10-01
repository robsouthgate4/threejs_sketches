

#define STANDARD


#ifdef PHYSICAL
	#define REFLECTIVITY
	#define CLEARCOAT
	#define TRANSPARENCY
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

uniform float time;
uniform sampler2D specMap;

#ifdef TRANSPARENCY
	uniform float transparency;
#endif

#ifdef REFLECTIVITY
	uniform float reflectivity;
#endif

#ifdef CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif

#ifdef USE_SHEEN
	uniform vec3 sheen;
#endif

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif


#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {

	#include <clipping_planes_fragment>

	float fbmMask 	= texture2D( specMap, vUv ).r;

	vec2 screenUvs = gl_FragCoord.xy / vec2( 1000., 1000. );

	vec2 tempuv = vUv * 0.9999 + 0.00005;

    float theta = (1.0-tempuv[1]) * PI;
    float phi = PI * 2.0 * tempuv[0];

    // convert polar to cartesian. Theta is polar, phi is azimuth.
    float x = sin(theta)*cos(phi);
    float y = sin(theta)*sin(phi);
    float z = cos(theta);

    // and convert back again to demonstrate problem.
    // problem: the phi above is [0,2*PI]. this phi is [0,2*PI)
    phi = atan(y, x);
    if (phi < 0.0) {
        phi = phi + PI * 2.0; 
    }
    if (phi > (2.0 * PI)) { // allow 2PI since we gen uv over [0,1]
        phi = phi - 2.0 * PI;
    }

    theta = acos(z);

    // now get uv in new chart.
    float newv = 1.0 - theta/PI;

    float newu = phi / (2.0 * PI);
	
    vec2 newuv = vec2(newu, newv);

	vec2 st = newuv;

	st *= 30.;

	vec3 color = vec3(0.0);

	float oceanPanTime = time * 3.0;

	vec2 q = vec2(0.);
    q.x = fbm( st + 0.00 * oceanPanTime);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2( 1.7,9.2 )+ 0.15 * oceanPanTime );
    r.y = fbm( st + 1.0*q + vec2( 8.3,2.8 )+ 0.726 * oceanPanTime );

    float f = fbm(st+r);

    color = mix(color,
                vec3( 0.3, 0.2, 0.1 ),
                clamp(length(r.x),0.0,1.0));

	color *= fbmMask;
	color *= 1.0;

	//color = mix( color, diffuse, 1.0 - fbmMask );

	vec4 diffuseColor = vec4( diffuse + ( color * fbmMask), opacity );

	

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>

	roughnessFactor *= ( 1.0 - fbmMask * 0.8 );

	normal.xy += clamp( (color.r * 2.0 - 1.0) * 0.6 * fbmMask, -1.0, 1.0 );

	// accumulation
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>



	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	// this is a stub for the transparency model
	#ifdef TRANSPARENCY
		diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );
	#endif

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}