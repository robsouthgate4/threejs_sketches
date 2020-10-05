
import { Scene, HemisphereLight, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, Clock, PointLight } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import Globe                from "./mesh/globe/Globe";
import Camera               from "./Camera";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.clock = new Clock( true );
        
        this.camera = new Camera( { renderer: this.renderer } );   

        this.scene                  = new Scene();
        this.renderer.setClearColor( new Color( 'rgb( 30, 20, 10 )' ) );

        this.postProcess            = new PostProcess( this.scene, this.camera, this.renderer );

        const supportsExtension = true;

        document.body.appendChild( this.renderer.domElement );

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if ( this.renderer.capabilities.isWebGL2 === false && ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) {

            supportsExtension = false;
            console.log( "No depth data available" );

        }

        this.globe;
        this.createScene();
        this.addLights();
        

    }

    createScene() {

        this.globe =  new Globe( { renderer: this.renderer, scene: this.scene } );
        this.scene.add( this.globe );

    }

    addLights() {

        this.scene.add( new HemisphereLight() )
        this.scene.add( new PointLight( new Color( "rgb( 160, 140, 50 )" ), 0 ) )

    }

    async loadModels() {

    }

    async loadTextures() {

    }

    resize() {

        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();

        const pixelRatio = window.devicePixelRatio;

        if ( canvas.width != window.innerWidth || canvas.height != window.innerHeight ) {

            this.renderer.setSize( window.innerWidth, window.innerHeight );

        }

        //this.postProcess.resize( window.innerWidth, window.innerHeight );

    }

    render() {

        requestAnimationFrame( () => this.render() );

        const time = this.clock.getElapsedTime();

        this.globe.update( time );

        this.camera.update( time );

        this.resize();

        this.renderer.render( this.scene, this.camera );

    }

}