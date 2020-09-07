
import { Scene, Mesh,  MeshBasicMaterial, TextureLoader, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, DoubleSide, FrontSide, LinearEncoding, LinearMipMapLinearFilter, NearestFilter, LinearMipMapNearestFilter, NeverDepth, GreaterDepth, LessEqualDepth, MeshStandardMaterial, OrthographicCamera } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import planeModel           from '../../../assets/toy_plane_game_assets/models/toy_plane.glb';
import cityDiffuse          from '../../../assets/city_assets/overlay_blurred.png';
import shadow               from '../../../assets/city_assets/shadow_plane.png';
import WebGLUtiles          from '../../WebGLUtils';
import { WebGLUtils } from "three/src/renderers/webgl/WebGLUtils";
import { SphereGeometry, HemisphereLight, Group } from "three/build/three.module";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        

        this.camera                 = new OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000); 
        this.camera.position.set( -5.76, 6.81, -4.50 );

        this.orbitControls                  = new OrbitControls( this.camera, this.renderer.domElement );
        // this.orbitControls.enableDamping    = true;
        // this.orbitControls.rotateSpeed      = 0.2;
        // this.orbitControls.dampingFactor    = 0.05;
        // this.orbitControls.maxDistance      = 750;
        // this.orbitControls.minZoom          = 300;
        // this.orbitControls.panSpeed         = 0.2;
        // this.orbitControls.autoRotate       = false;
        // this.orbitControls.autoRotateSpeed  = 0.6;
        // this.orbitControls.maxPolarAngle = Math.PI / 2.3;
    
        this.planeMesh;
        this.object;
        this.rotor;
        this.modelsLoaded = false;

        this.scene                  = new Scene();
        this.renderer.setClearColor( new Color( 'rgb( 0,255,210 )' ) );

        this.postProcess            = new PostProcess( this.scene, this.camera, this.renderer );

        const supportsExtension = true;

        document.body.appendChild( this.renderer.domElement );

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if ( this.renderer.capabilities.isWebGL2 === false && ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) {

            supportsExtension = false;
            console.log( "No depth data available" );

        }

        this.cityDiffuse;

        this.loadModels();
        this.addLights();
        

    }

    addLights() {

        this.scene.add( new HemisphereLight(), new DirectionalLight() )

    }

    async loadModels() {

        this.object  = await WebGLUtiles.LoadModelGLTF( planeModel );
        this.rotor   = this.object.children[ 1 ];           

        const materialBase          = new MeshStandardMaterial();

        console.log( this.object )

        this.modelsLoaded = true;
        
        this.scene.add(  this.object );

    }

    async loadTextures() {

       let city = await WebGLUtiles.LoadTexture( cityDiffuse );
       return city;

    }

    resize() {

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.postProcess.resize( window.innerWidth, window.innerHeight );

    }

    render() {

        requestAnimationFrame( () => this.render() );

        //this.orbitControls.update();

        if ( this.modelsLoaded ) {

            this.rotor.rotation.y += 0.2;

        }

        this.renderer.render( this.scene, this.camera );

    }

}