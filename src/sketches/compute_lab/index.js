
import { Scene, Mesh,  MeshBasicMaterial, TextureLoader, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, DoubleSide, FrontSide, LinearEncoding, LinearMipMapLinearFilter, NearestFilter, LinearMipMapNearestFilter, NeverDepth, GreaterDepth, LessEqualDepth, SphereGeometry, MeshStandardMaterial } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import GPGPU                from '../../common/gpgpu';
import Controls             from "./Controls";
import FBOHelper            from '../../libs/THREE.FBOHelper'
import { PlaneGeometry }    from "three/build/three.module";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.fboHelper              = new FBOHelper( this.renderer );

        this.gpgpu                  = new GPGPU( { renderer: this.renderer, fboHelper: this.fboHelper } );        

        this.camera                 = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 2.0, 2000 );
        this.camera.position.set( -350.3, 269.4, 726.4 );

        this.controls  = new Controls( this.camera, this.renderer.domElement );   

        this.scene                  = new Scene();
        this.renderer.setClearColor( new Color( 'rgb( 20, 20, 20 )' ) );

        this.quad = new PlaneGeometry( 100, 100 );
        this.quadMaterial = new MeshBasicMaterial( { map: null, color: 0xffffff } );

        this.scene.add( new Mesh( this.quad, this.quadMaterial ) );

        this.postProcess            = new PostProcess( { 
            scene: this.scene, 
            camera: this.camera, 
            renderer: this.renderer, 
            fboHelper: this.fboHelper 
        } );

        const supportsExtension = true;

        document.body.appendChild( this.renderer.domElement );

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if ( this.renderer.capabilities.isWebGL2 === false && ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) {

            supportsExtension = false;
            console.log( "No depth data available" );

        }

        this.addLights();
        

    }

    addLights() {

        this.scene.add( new DirectionalLight() );

    }

    async loadModels() {


    }

    async loadTextures() {


    }

    resize() {

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.postProcess.resize( window.innerWidth, window.innerHeight );

    }

    render() {

        requestAnimationFrame( () => this.render() );

        this.controls.update();       
        
        //this.postProcess.render( this.renderer, this.scene, this.camera );

        this.gpgpu.compute();

        this.renderer.render( this.scene, this.camera );

       

    }

}