
import PostProcess from './post/PostProcess';
import { Scene, Mesh,  MeshBasicMaterial, TextureLoader, WebGLRenderer, PerspectiveCamera, Color } from "three";

export default class {

    constructor() {

        // Setup a Zappar camera instead of one of ThreeJS's cameras

        this.camera                 = new PerspectiveCamera( 45., window.innerWidth / window.innerHeight, 0.01, 1000 );

        // Values form Zappar source code ( not actually setting, just to use for ref in shaders )

        this.camera.near            = 0.01;
        this.camera.far             = 100;
        
        this.renderer               = new WebGLRenderer();

        this.scene                  = new Scene();
        this.scene.background       = new Color( 'rgb( 221, 221, 221 )' );

        this.postProcess            = new PostProcess( this.scene, this.camera );

        const supportsExtension = true;

        document.body.appendChild( this.renderer.domElement );

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if ( this.renderer.capabilities.isWebGL2 === false && ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) {

            supportsExtension = false;
            console.log( "No depth data available" );

        }
        

    }

    setupTextures() {

       

    }

    resize() {

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.postProcess.resize( window.innerWidth, window.innerHeight );

    }

    render() {

        requestAnimationFrame( () => this.render() );

        // Render using our custom postprocess class

        //this.postProcess.render( this.renderer, this.scene, this.camera );

        this.renderer.render( this.scene, this.camera );

    }

}