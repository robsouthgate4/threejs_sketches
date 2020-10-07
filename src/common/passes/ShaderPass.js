
import { Mesh, Scene as PostScene } from "three";

import Renderer from "Globals/Renderer";
import Scene 	from "Globals/Scene";
import Camera   from "Globals/Camera";

import Utils    from "Common/Utils";
import Triangle from "Common/Triangle";


export default class ShaderPass {

	constructor( shader, params = {} ) {

		
        this.renderer   = Renderer;
		this.scene      = Scene;
		this.camera 	= Camera;
        
        this.target     = Utils.CreateFBO( false );

        this.shader   = shader;

        this.screen = new Mesh( Triangle, this.shader );

        this.screen.frustumCulled = false;

		this.postScene = new PostScene();

		this.postScene.autoUpdate = false;

		this.postScene.add( this.screen );

		this.addEvents();

	}

	addEvents() {

	}

	render( readBuffer, output ) {

		this.shader.uniforms.tDiffuse.value = readBuffer.texture;

		if ( ! output ) {

			this.renderer.setRenderTarget( this.target );

		}
		
		this.renderer.render( this.postScene, Camera );	
		this.renderer.setRenderTarget( null );		

	}

	resize( width, height ) {

		this.target.setSize( width, height );

	}
}