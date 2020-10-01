
import { Scene, HemisphereLight, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, Clock, PointLight } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import Globe                from "./mesh/globe/Globe";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.clock = new Clock( true );
        

        this.camera                 = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
        this.camera.position.set( 0, 1, -5 );

        this.orbitControls                  = new OrbitControls( this.camera, this.renderer.domElement );
        this.orbitControls.enableDamping    = true;
        this.orbitControls.rotateSpeed      = 0.2;
        this.orbitControls.dampingFactor    = 0.05;
        this.orbitControls.maxDistance      = 750;
        this.orbitControls.minZoom          = 300;
        this.orbitControls.panSpeed         = 0.2;
        this.orbitControls.autoRotate       = true;
        this.orbitControls.autoRotateSpeed  = 0.6;
        this.orbitControls.maxPolarAngle = Math.PI / 2.3;
        
   

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
        this.scene.add( new PointLight( new Color( "rgb( 160, 100, 50 )" ), 0 ) )

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

        const time = this.clock.getElapsedTime();

        this.orbitControls.update();
        this.globe.update( time );

        this.renderer.render( this.scene, this.camera );

    }

}