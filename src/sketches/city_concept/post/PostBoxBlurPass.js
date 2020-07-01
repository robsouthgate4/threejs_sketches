import blurVertexShader from '../shaders/blur/blur.vert';
import blurFragmentShader from '../shaders/blur/blur.frag';

import { Mesh, PlaneBufferGeometry, RawShaderMaterial, Vector2 } from "three";

export default class PostBoxBlurPass {

	constructor( texture ) {

		this.uniforms = {
			uResolution: {
				type: 'v2',
				value: new Vector2(),
			},
			uRadius: {
				type: 'f',
				value: 1.0
			},
			uTexture: {
				type: 't',
				value: texture
			}
		};
        
        this.vertexShader   = blurVertexShader;
		this.fragmentShader = blurFragmentShader;
		
		this.material 		= new RawShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
		} );

		this.quad            = this.createQuad();
		this.quad.visible    = false;

		

	}

	createQuad() {

		return new Mesh(
			new PlaneBufferGeometry( 2, 2 ),
			this.material
		);

	}

	resize( width, height ) {

		this.uniforms.uResolution.value.set( width, height );

    }
    
	render( renderer, scene, camera, renderTarget = null ) {

		this.quad.visible = true;

		renderer.setRenderTarget( renderTarget );
		renderer.render( scene, camera );

		this.quad.visible = false;

	}

}
