import { Scene, Mesh, OrthographicCamera, ShaderMaterial, PlaneBufferGeometry, MeshNormalMaterial, Vector2, RGBADepthPacking, NoBlending, WebGLRenderTarget, NearestFilter } from "three";
import MeshUVsMaterial  from '../../../common/materials/MeshUvsMaterial';
import Utils       from '../../../common/Utils'
import postVert         from "../shaders/post/post.vert";
import postFrag         from "../shaders/post/post.frag";
import PostBoxBlurPass  from "./PostBoxBlurPass";
import DOFPass          from "./DOFPass";
import FBOHelper        from '../../../libs/THREE.FBOHelper'
import MeshPositionMaterial from "../../../common/materials/MeshPositionMaterial";
import { Color, MeshDepthMaterial } from "three/build/three.module";


export default class PostProcess {

    constructor( scene, camera, renderer ) {

        
        this.postScene = new Scene();

        this.fboHelper = new FBOHelper( renderer );
        this.fboHelper.setSize( window.innerWidth, window.innerHeight );
        

        this.oldClearColor =  new Color();

        // Create frame buffers

        this.sceneFBO       = Utils.CreateFBO( false );
        this.blurFBO        = Utils.CreateFBO( false );
        this.normalFBO      = Utils.CreateFBO( false );
        this.uvFBO          = Utils.CreateFBO( false );
        this.positionFBO    = Utils.CreateFBO( false );
        this.dofFBO         = Utils.CreateFBO( false );
        
    
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

        // Blit depth texture

        scene.overrideMaterial = this.materialDepth;

		this.oldClearColor.copy( renderer.getClearColor() );
		var oldClearAlpha   = renderer.getClearAlpha();
		var oldAutoClear    = renderer.autoClear;
		renderer.autoClear  = false;

		renderer.setClearColor( 0xffffff );
		renderer.setClearAlpha( 1.0 );
		renderer.setRenderTarget( this.depthFBO );
		renderer.clear();
        renderer.render( scene, camera );        
        renderer.setRenderTarget( null );
        
        scene.overrideMaterial = null;

        
        this.dofPass.material.uniforms.tColor.value              = this.sceneFBO.texture;
        this.dofPass.material.uniforms.uNearClip.value           = camera.near;
		this.dofPass.material.uniforms.uFarClip.value            = camera.far;
        this.dofPass.material.uniforms.uResolution.value         = new Vector2( window.innerWidth, window.innerHeight);
        this.dofPass.material.uniforms.tDepth.value              = this.depthFBO.texture;

        
        this.dofPass.render( renderer, scene, camera, this.dofFBO );

        
        renderer.setClearColor( this.oldClearColor );
        renderer.setClearAlpha( oldClearAlpha );
        renderer.autoClear = oldAutoClear;

        // Final composition

        this.postMaterial.uniforms.tDiffuse.value   = this.dofFBO.texture;
        this.postMaterial.uniforms.tDepth.value     = this.sceneFBO.depthTexture;
        this.postMaterial.uniforms.tNormal.value    = this.normalFBO.texture;
        this.postMaterial.uniforms.tUV.value        = this.uvFBO.texture;


        renderer.render( this.postScene, this.postCamera );

        this.fboHelper.update();

        

    }
    

}