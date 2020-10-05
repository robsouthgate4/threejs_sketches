
import { Scene, HemisphereLight, WebGLRenderer, Color, Clock, PointLight, CylinderGeometry, Mesh, MeshStandardMaterial, Object3D, TubeGeometry, Math } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import Globe                from "./mesh/globe/Globe";
import Camera               from "./Camera";
import WebGLUtils           from "../../WebGLUtils";
import { CubeGeometry }     from "three/build/three.module";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.clock = new Clock( true );
        
        this.camera = new Camera( { renderer: this.renderer } );   

        this.scene                  = new Scene();
        this.renderer.setClearColor( new Color( 'rgb( 30, 20, 10 )' ) );

        this.postProcess            = new PostProcess( this.scene, this.camera, this.renderer );

        this.globeContainer = new Object3D();

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

        this.createGlobePins();
        

    }

    createGlobePins() {

        const cities = [
            {
                lat: 51.5074,
                lon: 0.1278,
                name: "London",
                polution: 0.5
            },
            {
                lat: 45.4642,
                lon: 9.1900,
                name: "Milan",
                polution: 0.2
            },

        ];

        cities.forEach( city => {

            const pinGeo    = new CubeGeometry( 0.0025, 0.0025, city.polution );
            const pinMesh   = new Mesh( pinGeo, new MeshStandardMaterial(  ) );
            const pos       = WebGLUtils.CalcPosFromLatLonRad( city.lat, city.lon, 1 );

            pinMesh.position.set( pos.x, pos.y, pos.z );
            pinMesh.position.z += 0.0;

            pinMesh.lookAt( this.globe.position );

            this.globeContainer.add( pinMesh );   

        } )

           

    }

    createScene() {

        this.globe = new Globe( { renderer: this.renderer, scene: this.scene } );

        this.globeContainer.add( this.globe );

        this.scene.add( this.globeContainer );

        this.globeContainer.rotation.y = Math.degToRad( 240 );
        this.globeContainer.rotation.x = Math.degToRad( 45 );

    }

    addLights() {

        this.scene.add( new HemisphereLight() )
        this.scene.add( new PointLight( new Color( "rgb( 180, 140, 50 )" ), 2 ) )

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

        this.globeContainer.rotation.y += 0.001;

        this.globe.update( time );

        this.camera.update( time );

        this.resize();

        this.renderer.render( this.scene, this.camera );

    }

}