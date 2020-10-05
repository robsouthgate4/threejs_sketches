import { Color, DoubleSide, LinearFilter, Material, PMREMGenerator, RepeatWrapping, ShaderLib, sRGBEncoding, TextureLoader, UnsignedByteType, Vector3} from "three";
import vert 			from "./globe.vert";
import frag 			from "./globe.frag";
import { 
	ShaderMaterial, 
	UniformsUtils } 	from "three/build/three.module";

import lights 			from '../../../../../assets/globe_assets/globe_maps/lights.jpg';
import bump 			from '../../../../../assets/globe_assets/globe_maps/bump.jpg';
import spec 			from '../../../../../assets/globe_assets/globe_maps/spec.jpg';

import { HDRCubeTextureLoader } 	from "three/examples/jsm/loaders/HDRCubeTextureLoader";

function importAll( r ) {

	return r.keys().map( r );

}
  
const hdrImages = importAll( 
						require.context('../../../../../assets/globe_assets/globe_maps/hdr', false, /\.(hdr)$/)
					).map( ( module ) => module.default );


export default class GlobeMaterial extends ShaderMaterial {

	constructor( { renderer, scene } ) {		

		const lightsMap = new TextureLoader().load( lights );
		const bumpMap   = new TextureLoader().load( bump );
		const specMap	= new TextureLoader().load( spec );

		const physicalUniforms 	= ShaderLib.physical.uniforms;

		const customUniforms 	= {

			diffuse: 	{ value: new Color( "rgb( 60, 60, 60 )" ) },
			roughness: 	{ value: 0.6 },
			metalness: 	{ value: 0.9 },
			specMap: 	{ type: "t", value: specMap },
			displacementScale: { value: 0.1 },
			thicknessScale: { value: 10.0 },
			thicknessPower: { value: 20. },
			thicknessAmbient: { value: 0.5 },
			thicknessDistortion: { value: 0.01 },
			time:       { value: 0 }

		}

		const mergedUniforms = UniformsUtils.merge( [ physicalUniforms, customUniforms ] )

		super( 
			{ 
				uniforms: mergedUniforms,
				vertexShader: vert, 
				fragmentShader: frag,
				lights: true,
				transparent: false,
				side: DoubleSide,
				extensions: {
					derivatives: true
				}
			} 
		);

		this.renderer 	= renderer;
		this.scene 		= scene;

		this.bumpMap					= bumpMap;
		this.uniforms.bumpMap.value		= bumpMap;

		this.bumpScale					= 0.05;
		this.uniforms.bumpScale.value	= 0.05;

		this.uniforms.specMap.value		= specMap;

		this.displacementMap					= bumpMap;
		this.uniforms.displacementMap.value		= bumpMap;

		let hdrCubeRenderTarget;
		
		const pmremGenerator = new PMREMGenerator( this.renderer );

		const hdrCubeMap = new HDRCubeTextureLoader ()
			.setDataType( UnsignedByteType )
			.load( hdrImages , (  ) => {

				hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );

				this.envMap					= hdrCubeRenderTarget.texture;
				this.uniforms.envMap.value	= hdrCubeRenderTarget.texture;

				this.needsUpdate = true;

				pmremGenerator.dispose();

			});

	}

	update( time ) {

		this.uniforms.time.value = time;

	}
	
}