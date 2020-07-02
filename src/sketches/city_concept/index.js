
import { Scene, Mesh,  MeshBasicMaterial, TextureLoader, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, DoubleSide, FrontSide, LinearEncoding, LinearMipMapLinearFilter, NearestFilter, LinearMipMapNearestFilter } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import PostProcess          from './post/PostProcess';
import cityModel            from '../../../assets/city_assets/buildings.fbx';
import cityDiffuse          from '../../../assets/city_assets/combined.png';
import shadow               from '../../../assets/city_assets/shadow_plane.png';
import WebGLUtiles          from '../../WebGLUtils';
import { WebGLUtils } from "three/src/renderers/webgl/WebGLUtils";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        

        this.camera                 = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.set( 0, 300, 1000 );
        this.orbitControls          = new OrbitControls( this.camera, this.renderer.domElement );

    
        

        this.scene                  = new Scene();
        this.scene.background       = new Color( 'rgb( 221, 221, 221 )' );

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

        //this.scene.add( new DirectionalLight( ) );

    }

    async loadModels() {

        let geo             = await WebGLUtiles.LoadModelFBX( cityModel );
        geo.doubleSides     = false;
        geo.scale.set( 0.3, 0.3, 0.3 );

        const cityMesh      = geo.children[ 0 ];

        const floorMesh     = geo.children[ 1 ];

        let tex         = new TextureLoader().load( cityDiffuse );
        tex.minFilter   = LinearMipMapNearestFilter;
        //tex.magFilter   = NearestFilter;
        tex.encoding    = LinearEncoding;

        const materialCity          = new MeshBasicMaterial( { map: tex, color: 0xFFFFFF } );
        materialCity.side           = FrontSide; 

        const materialShadow    = new MeshBasicMaterial( { map: new TextureLoader().load( shadow ), color: 0x000000 } );

        
        
        // let material    = new MeshBasicMaterial();
        // let mesh        = new Mesh( fbx, material );

        cityMesh.material   = materialCity;
        //floorMesh.material  = materialShadow;

        this.scene.add( cityMesh );

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

        // Render using our custom postprocess class

        this.postProcess.render( this.renderer, this.scene, this.camera );

    }

}