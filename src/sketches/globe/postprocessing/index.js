import {
    Mesh,
    ShaderMaterial,
    Vector2,
    Scene as PostScene } from "three";


import Utils        from "Common/Utils";

import copyVert     from "Common/shaders/copy/copy.vert";
import copyFrag     from "Common/shaders/copy/copy.frag";

import Renderer     from "Globals/Renderer";
import Scene        from "Globals/Scene";
import Camera       from "Globals/Camera";

import ShaderPass   from "Common/passes/ShaderPass";
import RenderPass   from "Common/passes/RenderPass";

import BlurShader   from "Common/shaders/blur/BlurShader";
import FXAAShader   from "Common/shaders/fxaa/FXAAShader";

class PostProcess {

    constructor( ) {

        this.renderer   = Renderer;
        this.scene      = Scene;
        this.camera     = Camera;
        
        this.read       = Utils.CreateFBO( false );
        this.write      = Utils.CreateFBO( false );
        this.blurXOut   = Utils.CreateFBO( false );
        this.blurYOut   = Utils.CreateFBO( false );
        
        this.copyShader   = new ShaderMaterial( {

            vertexShader:   copyVert,
            fragmentShader: copyFrag,

            uniforms: {

                tDiffuse:       { value: null }

            },

            depthTest:  false,
            depthWrite: false

        } );

        this.blurXShader    = new BlurShader( { direction: new Vector2( 0, 0 ) } );
        this.blurYShader    = new BlurShader( { direction: new Vector2( 0, 0 ) } );

        this.fxaaShader     = new FXAAShader();
        
        this.renderPass     = new RenderPass();

        this.copyPass       = new ShaderPass( this.copyShader );
        this.blurXPass      = new ShaderPass( this.blurXShader );
        this.blurYPass      = new ShaderPass( this.blurYShader );
        this.fxaaPass       = new ShaderPass( this.fxaaShader );

		this.addEvents();
      

    }

    addEvents( ) {


    }

    resize( ) {

        this.blurXPass.resize( window.innerWidth, window.innerHeight );

    }

    render( ) {

        this.renderPass.render( false );

        this.blurXPass.render( this.renderPass.target, false );

        this.blurYPass.render( this.blurXPass.target, false );

        this.fxaaPass.render( this.blurYPass.target, true );

        //Renderer.render( Scene, Camera );

    }
    

}

export default new PostProcess();