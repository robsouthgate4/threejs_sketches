import { ShaderMaterial, Vector2 } from "three";

import blurVert from "Common/shaders/blur/blur.vert";
import blurFrag from "Common/shaders/blur/blur.frag";

export default class BlurShader extends ShaderMaterial {

	constructor( { direction } ) {

		const uniforms = {

			uStrength:      { value: direction },
			tDiffuse:       { value: null },
			uResolution:    { value: new Vector2( window.innerWidth, window.innerHeight ) }

		};

		super( { 

			vertexShader: 	blurVert, 
			fragmentShader: blurFrag,
			uniforms, 
			depthTest:  	false, 
			depthWrite:		false  
			
		} );

	}

}