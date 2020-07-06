
import { Scene, Mesh,  MeshBasicMaterial, TextureLoader, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, DoubleSide, FrontSide, LinearEncoding, LinearMipMapLinearFilter, NearestFilter, LinearMipMapNearestFilter, NeverDepth, GreaterDepth, LessEqualDepth } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import cityModel            from '../../../assets/city_assets/gherkin.fbx';
import cityDiffuse          from '../../../assets/city_assets/overlay_blurred.png';
import shadow               from '../../../assets/city_assets/shadow_plane.png';
import WebGLUtiles          from '../../WebGLUtils';
import { WebGLUtils } from "three/src/renderers/webgl/WebGLUtils";
import { SphereGeometry } from "three/build/three.module";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        

        this.camera                 = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 2.0, 2000 );
        this.camera.position.set( -350.3, 269.4, 726.4 );

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
    
        this.cityMesh;        
   

        this.scene                  = new Scene();
        this.renderer.setClearColor( new Color( 'rgb( 20, 20, 20 )' ) );

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

     

    }

    async loadModels() {

        let geo             = await WebGLUtiles.LoadModelFBX( cityModel );

        this.cityMesh      = geo.children[ 0 ];

        this.cityMesh.scale.set( 1, 1, 1 );

        let tex         = new TextureLoader().load( cityDiffuse );

        const materialCity          = new MeshBasicMaterial( { map: tex, color: new Color( 'rgb( 255, 255, 255 )' ) } );
        materialCity.side           = DoubleSide;

        const materialShadow    = new MeshBasicMaterial( { map: new TextureLoader().load( shadow ), color: 0x000000 } );

        this.cityMesh.material   = materialCity;
        //floorMesh.material  = materialShadow;

        this.scene.add( this.cityMesh );

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

        console.log( this.camera.position )

        requestAnimationFrame( () => this.render() );

        this.orbitControls.update();

        // Render using our custom postprocess class

        if ( this.cityMesh && this.cityMesh.scale.y < 1 )
        {

            //this.cityMesh.scale.y += 0.001;

        }
        

        this.postProcess.render( this.renderer, this.scene, this.camera );

    }

}