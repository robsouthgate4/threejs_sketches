import dofVertexShader from '../shaders/dof/dof.vert';
import dofFragmentShader from '../shaders/dof/dof.frag';

import { Mesh, PlaneBufferGeometry, RawShaderMaterial, Vector2, RGBADepthPacking, NoBlending } from "three";
import { MeshDepthMaterial, Color } from 'three/build/three.module';
import WebGLUtils from '../../../WebGLUtils';

export default class DOFPass {

	constructor( camera ) {

		this.focus =  10.0;
		this.aspect = camera.aspect;
		this.aperture = 0.000004;
		this.maxblur =  0.01;		
		
		this.uniforms = {
			uResolution: {
				type: 'v2',
				value: new Vector2(),
			},
			tColor: {
				type: 't',
				value: null
			},
			tDepth: {
				type: 't',
				value: null
			},
			uFocus: {
				value: this.focus
			},
			uAspect: {
				value: this.aspect
			},
			uAperture: {
				value: this.aperture
			},
			uMaxBlur: {
				value: this.maxblur
			},
			uNearClip: {
				value: null
			},
			uFarClip: {
				value: null
			}
		};
        
        this.vertexShader   = dofVertexShader;
		this.fragmentShader = dofFragmentShader;
		
		this.material 		= new RawShaderMaterial( {
			uniforms: 		this.uniforms,
			vertexShader: 	this.vertexShader,
			fragmentShader: this.fragmentShader,
		} );

		this.quad            = this.createQuad();
		this.quad.visible    = false;

		this.oldClearColor = new Color();
		

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

		this.quad.position.set( camera.position );

		renderer.setRenderTarget( renderTarget );
		renderer.clear();
		renderer.render( scene, camera );
		renderer.setRenderTarget( null );

		this.quad.visible = false;

	}

}
