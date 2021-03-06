
import { Scene, Mesh,  MeshBasicMaterial, TextureLoader, WebGLRenderer, PerspectiveCamera, Color, DirectionalLight, DoubleSide, FrontSide, LinearEncoding, LinearMipMapLinearFilter, NearestFilter, LinearMipMapNearestFilter, NeverDepth, GreaterDepth, LessEqualDepth, MeshStandardMaterial, PlaneBufferGeometry, LinearFilter, BoxGeometry } from "three";
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls';
import PostProcess          from './post/PostProcess';
import ccaVert              from './cca.vert';
import ccaFrag              from './cca.frag';
import resetFrag            from './reset.frag';
import { ShaderMaterial, Vector2, Clock, RawShaderMaterial, PlaneGeometry } from "three/build/three.module";
import WebGLUtils from "../../../../WebGLUtils";
import * as dat from 'dat.gui';
import FBOHelper from "../../../../libs/THREE.FBOHelper";
import CCAMould from "./materials/heightMap/ccaMould";

export default class {

    constructor() {

        this.renderer               = new WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.fboHelper = new FBOHelper( this.renderer );
        this.fboHelper.setSize( window.innerWidth, window.innerHeight );
        
        this.clock = new Clock( true );

        this.camera                 = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.001, 2000 );
        this.camera.position.set( 0, 0, 3 );

        this.bufferCamera                 = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.001, 2000 );
        this.bufferCamera.position.set( 0, 0, 2 );

        this.orbitControls                  = new OrbitControls( this.bufferCamera, this.renderer.domElement );
        this.orbitControls.enableDamping    = true;
        this.orbitControls.rotateSpeed      = 0.2;
        this.orbitControls.dampingFactor    = 0.05;
        this.orbitControls.maxDistance      = 750;
        this.orbitControls.minZoom          = 300;
        this.orbitControls.panSpeed         = 0.2;
        this.orbitControls.autoRotate       = false;
        this.orbitControls.autoRotateSpeed  = 0.6;
        //this.orbitControls.maxPolarAngle = Math.PI / 2.3;

        this.computeSettings = {

            maxRange:       10,
            range:          1,
            maxStates:      20,
            nStates:        4,
            moore:          true,
            threshold:      8,
            maxThreshold:   25,
            width:          1024,
            height:         1024,
            stepMod:        1,
            stepsPerFrame:  1

        }

        this.dt;
        this.resetting;
        this.quadGeo;
        this.quadMesh;
        this.ccaPass;
        this.resetPass;
        this.scene                  = new Scene();

        this.bufferScene            = new Scene();
        //this.bufferScene.background = new Color( "white" );

        this.renderer.setClearColor( new Color( 'rgb( 255,	213,	211			 )' ) );

        //this.postProcess            = new PostProcess( this.scene, this.camera, this.renderer );

        const supportsExtension = true;

        document.body.appendChild( this.renderer.domElement );

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if ( this.renderer.capabilities.isWebGL2 === false && ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) {

            supportsExtension = false;
            console.log( "No depth data available" );

        }

        this.initFBOS();
        this.createPasses();
        this.createGUI();
        this.resetCompute();
        
        window.addEventListener( 'keydown', ( e ) => {

            if ( e.code === 'KeyE' ) {

                this.resetCompute();

            }   

            if ( e.code === 'KeyR' ) {

                this.randomiseParams();

            } 

            if ( e.code === 'KeyT' ) {

                this.randomiseParams();
                this.resetCompute();

            }   


        } );

        window.addEventListener( 'keydown', ( e ) => {

            if ( e.code === 'Space' ) {

                this.render();

            }   

        } );


        this.planeGeo       = new PlaneGeometry( 1, 1, 256, 256 );
        this.planeMaterial  = new CCAMould();
        
        this.planeMaterial.uniforms.ccaMap.value = this.ccaCompute.read.texture;

        this.planeMesh      = new Mesh( this.planeGeo, this.planeMaterial );

        this.bufferScene.add( this.planeMesh );


    }

    randomiseParams() {

        this.computeSettings.range      = Math.floor( Math.random() * this.computeSettings.maxRange );
        this.computeSettings.threshold  = Math.floor(  Math.random() * this.computeSettings.maxThreshold );
        this.computeSettings.nStates    = 4;
        this.computeSettings.moore      = Math.random() <= 0.5;

        this.ccaPass.uniforms.uRange.value       =  this.computeSettings.range;
        this.ccaPass.uniforms.uThreshold.value   =  this.computeSettings.threshold;
        this.ccaPass.uniforms.uNStates.value     =  this.computeSettings.nStates;
        this.ccaPass.uniforms.uMoore.value       =  this.computeSettings.moore;

    }

    createGUI() {

        this.gui = new dat.GUI();

        this.gui.add( this.computeSettings, 'maxRange', 0, 10 ).listen();
        this.gui.add( this.computeSettings, 'range', 1, 10 ).listen();
        this.gui.add( this.computeSettings, 'maxStates', 0, 20 ).listen();
        this.gui.add( this.computeSettings, 'nStates', 0, 6 ).listen();
        this.gui.add( this.computeSettings, 'moore' ).listen();
        this.gui.add( this.computeSettings, 'threshold', 0, 25 ).listen();
        this.gui.add( this.computeSettings, 'maxThreshold', 0, 25 ).listen();

    }

    initFBOS() {

        this.sceneFBO   = WebGLUtils.CreateFBO( window.innerWidth, window.innerHeight );
        this.ccaCompute = WebGLUtils.CreateDoubleFBO( this.computeSettings.width, this.computeSettings.height, LinearFilter );

        this.fboHelper.attach( this.sceneFBO.texture, 'scene' );
        this.fboHelper.attach( this.ccaCompute.read.texture, 'cca read' );
  

    }

    createPasses() {

        this.ccaPass    = new RawShaderMaterial( {

            uniforms: {

                uTexelSize:       { value: 1 / this.computeSettings.width },
                uResolution:      { value: new Vector2( this.computeSettings.width, this.computeSettings.height ) },
                uReadTexture:     { value: this.ccaCompute.read.texture },
                uWriteTexture:    { value: this.ccaCompute.write.texture },
                uMaxRange:        { value: this.computeSettings.maxRange },
                uRange:           { value: this.computeSettings.range },
                uMaxStates:       { value: this.computeSettings.maxStates },
                uNStates:         { value: this.computeSettings.nStates },
                uMoore:           { value: this.computeSettings.moore },
                uThreshold:       { value: this.computeSettings.threshold },
                uMaxThreshold:    { value: this.computeSettings.maxThreshold },
                uDeltaTime:       { value: 0 },
    
            },
            vertexShader:   ccaVert,
            fragmentShader: ccaFrag

        } );

        this.resetPass    = new RawShaderMaterial( {

            uniforms: {

                uTexelSize:       { value: 1 / this.computeSettings.width },
                uResolution:      { value: new Vector2( this.computeSettings.width, this.computeSettings.height ) },
                uReadTexture:     { value: this.ccaCompute.read.texture },
                uWriteTexture:    { value: this.ccaCompute.write.texture },
                uMaxRange:        { value: this.computeSettings.maxRange },
                uRange:           { value: this.computeSettings.range },
                uMaxStates:       { value: this.computeSettings.maxStates },
                uNStates:         { value: this.computeSettings.nStates },
                uMoore:           { value: this.computeSettings.moore },
                uThreshold:       { value: this.computeSettings.threshold },
                uMaxThreshold:    { value: this.computeSettings.maxThreshold },
                uDeltaTime:       { value: 0 },
                uSeed:            { value: 0 }
    
            },
            vertexShader:   ccaVert,
            fragmentShader: resetFrag

        } );


        this.quadGeo    = new PlaneBufferGeometry( 2, 2 );
        this.quadMesh   = new Mesh( this.quadGeo, this.ccaPass );
        this.scene.add( this.quadMesh );

    }



    async loadTextures() {


    }

    resize() {

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        // this.postProcess.resize( this.computeSettings.width, this.computeSettings.height );

    }

    resetCompute() {

        this.quadMesh.material                      = this.resetPass;
        this.resetPass.uniforms.uSeed.value         = Math.random() * this.computeSettings.nStates;

        this.renderer.setRenderTarget( this.ccaCompute.read );
        this.renderer.render( this.scene, this.camera );

    }
    

    render() {

        this.dt = this.clock.getDelta();

        // e

        this.quadMesh.material                      = this.ccaPass;
        this.ccaPass.uniforms.uDeltaTime.value      = this.dt;
        this.ccaPass.uniforms.uReadTexture.value    = this.ccaCompute.read.texture;
        this.ccaPass.uniforms.uWriteTexture.value   = this.ccaCompute.write.texture;

        this.ccaPass.uniforms.uRange.value       =  this.computeSettings.range;
        this.ccaPass.uniforms.uThreshold.value   =  this.computeSettings.threshold;
        this.ccaPass.uniforms.uNStates.value     =  this.computeSettings.nStates;
        this.ccaPass.uniforms.uMoore.value       =  this.computeSettings.moore;

        this.renderer.setRenderTarget( this.ccaCompute.write );
        this.renderer.render( this.scene, this.camera );
        this.renderer.setRenderTarget( null );

        this.ccaCompute.swap();

        this.renderer.render( this.bufferScene, this.bufferCamera );

        // Render using our custom postprocess class

        // this.postProcess.postMaterial.uniforms.uNStates.value   = this.computeSettings.nStates;
        // this.postProcess.postMaterial.uniforms.uThreshold.value = this.computeSettings.threshold;

        // this.postProcess.render( this.renderer, this.scene, this.camera, this.ccaCompute.read.texture );

        //this.renderer.render( this.scene, this.camera );

        setTimeout( () => {

            requestAnimationFrame( () => this.render() );

        }, 1000 / 30 );

        
        this.fboHelper.update();
        //this.orbitControls.update();

        // this.planeMesh.rotation.x = Math.sin( this.clock.elapsedTime * 0.5 ) * 0.3;
        // this.planeMesh.rotation.y = Math.cos( this.clock.elapsedTime * 0.5 ) * 0.3;

    }

}