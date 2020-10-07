import { ShaderMaterial, Vector2 } from "three";

import fxaaVert from "Common/shaders/fxaa/fxaa.vert";
import fxaaFrag from "Common/shaders/fxaa/fxaa.frag";

export default class FXAAShader extends ShaderMaterial {

	constructor() {

		const uniforms = {

			tDiffuse:       { value: null },
			uResolution:    { value: new Vector2( window.innerWidth, window.innerHeight ) }

		};

		super( { 

			vertexShader: 	fxaaVert, 
			fragmentShader: fxaaFrag,
			uniforms, 
			depthTest:  	false, 
			depthWrite:		false  
			
		} );

	}

}