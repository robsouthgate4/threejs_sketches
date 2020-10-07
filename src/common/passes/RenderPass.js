
import { Mesh, Scene as PostScene, ShaderMaterial } from "three";

import Renderer from "Globals/Renderer";
import Scene 	from "Globals/Scene";
import Camera   from "Globals/Camera";

import Utils    from "Common/Utils";
import Triangle from "Common/Triangle";

import copyVert from "Common/shaders/copy/copy.vert";
import copyFrag from "Common/shaders/copy/copy.frag";


export default class RenderPass {

	constructor( params = {} ) {

		
        this.renderer   = Renderer;
		this.scene      = Scene;
		this.camera 	= Camera;
        
        this.target     = Utils.CreateFBO( false );

        this.shader   = new ShaderMaterial( {

			vertexShader: 	copyVert,
			fragmentShader: copyFrag,

			uniforms: {

                tDiffuse:       { value: this.target }

            },

            depthTest:  false,
            depthWrite: false

		} );

        this.screen = new Mesh( Triangle, this.shader );

        this.screen.frustumCulled = false;

		this.postScene = new PostScene();

		this.postScene.autoUpdate = false;

		this.postScene.add( this.screen );

		this.addEvents();

	}

	addEvents() {

	}

	render( output ) {


		this.renderer.setRenderTarget( this.target );

		
		this.renderer.render( Scene, Camera );
		this.renderer.setRenderTarget( null ); 

		if ( output ) {

			this.renderer.render( this.postScene, Camera ); // To change

		}

	}

	resize( width, height ) {

		this.target.setSize( width, height );

	}
}