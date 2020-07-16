import { Scene, Mesh, OrthographicCamera, ShaderMaterial, PlaneBufferGeometry, MeshNormalMaterial, Vector2, RGBADepthPacking, NoBlending, WebGLRenderTarget, NearestFilter } from "three";
import MeshUVsMaterial  from '../../../../../common/materials/MeshUvsMaterial';
import WebGLUtils       from '../../../../../WebGLUtils'
import postVert         from "../shaders/post/post.vert";
import postFrag         from "../shaders/post/post.frag";
import PostBoxBlurPass  from "./PostBoxBlurPass";
import DOFPass          from "./DOFPass";
import FBOHelper        from '../../../../../libs/THREE.FBOHelper'
import { Color, MeshDepthMaterial } from "three/build/three.module";


export default class PostProcess {

    constructor( scene, camera, renderer ) {

        
        this.postScene = new Scene();

        this.fboHelper = new FBOHelper( renderer );
        this.fboHelper.setSize( window.innerWidth, window.innerHeight );
        

        this.oldClearColor =  new Color();

        // Create frame buffers

        this.sceneFBO       = WebGLUtils.CreateFBO( false );
        this.blurFBO        = WebGLUtils.CreateFBO( false );
        this.normalFBO      = WebGLUtils.CreateFBO( false );
        this.uvFBO          = WebGLUtils.CreateFBO( false );
        this.positionFBO    = WebGLUtils.CreateFBO( false );
        this.dofFBO         = WebGLUtils.CreateFBO( false );
        
    
        // depth material
    
        this.materialDepth              = new MeshDepthMaterial();
        this.materialDepth.depthPacking = RGBADepthPacking;
        this.materialDepth.blending     = NoBlending;

        this.depthFBO = new WebGLRenderTarget( window.innerWidth, window.innerHeight, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            stencilBuffer: false
        } );

        // this.fboHelper.attach( this.sceneFBO.texture, 'scene' );
        // this.fboHelper.attach( this.blurFBO.texture, 'blur' );
        // this.fboHelper.attach( this.normalFBO.texture, 'normals' );
        // this.fboHelper.attach( this.uvFBO.texture, 'uvs' );
        // this.fboHelper.attach( this.positionFBO.texture, 'position' );
        // this.fboHelper.attach( this.depthFBO.texture, 'depth' );        
        // this.fboHelper.attach( this.dofFBO.texture, 'dof' );

        // Setup passes

        this.postBlurPass = new PostBoxBlurPass( this.blurFBO.texture );
        scene.add( this.postBlurPass.quad );

        this.dofPass      = new DOFPass( camera );
        scene.add( this.dofPass.quad );

        this.postCamera     = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.postMaterial   = new ShaderMaterial( {

            vertexShader:   postVert,
            fragmentShader: postFrag,
    
            uniforms: {
                cameraNear: { value: camera.near },
                cameraFar:  { value: camera.far },
                tDiffuse:   { value: null },
                tDepth:     { value: null },
                tNormal:    { value: null },
                tUV:        { value: null },
                tRainbow:   { value: null },
                uNStates:   { value: null },
                uThreshold: { value: null },
                resolution: { value: new Vector2( window.innerWidth, window.innerHeight ) } 
            }
    
        } );

        this.uvsMaterial    = new MeshUVsMaterial();

        const postPlane = new PlaneBufferGeometry( 2, 2 );
        const postQuad  = new Mesh( postPlane, this.postMaterial );

        this.postScene.add( postQuad );

    }

    resize( width, height ) {

        this.sceneFBO.setSize( width, height );
        this.blurFBO.setSize( width, height );
        this.normalFBO.setSize( width, height );
        this.postBlurPass.resize( width, height );
        this.dofPass.resize( width, height );
        this.depthFBO.setSize( width, height );
        this.fboHelper.setSize( width, height );

    }

    render( renderer, scene, camera ) {

        

        // Blit original scene texture

        renderer.setRenderTarget( this.sceneFBO );
        renderer.render( scene, camera );
        renderer.setRenderTarget( null );

        // Final composition

        this.postMaterial.uniforms.tDiffuse.value   = this.sceneFBO.texture;


        renderer.render( this.postScene, this.postCamera );

        this.fboHelper.update();

        

    }
    

}