
  
uniform sampler2D 	uReadTexture;
uniform sampler2D 	uWriteTexture;
uniform float 		uTexelSize;
uniform vec2 		uResolution;
uniform float 		uDeltaTime;

uniform int 		uMaxRange;
uniform int 		uRange;
uniform int 		uMaxStates;
uniform int 		uNStates;
uniform int 		uMoore;
uniform int 		uThreshold;
uniform int 		uMaxThreshold;

varying vec2 vUv;

void main() {

	vec2 uv = vUv;

        float dx = 1.0;
        float dy = 1.0;

        vec4 s = texture2D( uReadTexture, uv );
        vec4 r = s;

        float ns;
        float n;

        ns = mod(s.r * 255.0 + 1.0, float(3));

        n = 0.0;
        n += float(texture2D(uReadTexture, uv + vec2(dx,   0) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv - vec2(dx,   0) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv + vec2( 0,  dy) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv - vec2( 0,  dy) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv + vec2(dx,  dy) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv - vec2(dx,  dy) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv + vec2(dx, -dy) / uResolution, 1.0).r * 255.0 == ns);
        n += float(texture2D(uReadTexture, uv - vec2(dx, -dy) / uResolution, 1.0).r * 255.0 == ns);

        n += float(s.r * 255.0 == ns);

        if (n >= float(3)) {

                r.r = ns / 255.0;

        }

        gl_FragColor = r;


}