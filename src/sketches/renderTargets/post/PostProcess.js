import { Scene, Mesh, OrthographicCamera, ShaderMaterial, PlaneBufferGeometry, MeshNormalMaterial } from "three";
import MeshUVsMaterial from '../../../common/materials/MeshUvsMaterial';
import WebGLUtils from '../../../WebGLUtils'
import postVert from "../shaders/post/post.vert";
import postFrag from "../shaders/post/post.frag";
import PostBoxBlurPass from "./PostBoxBlurPass";


export default class PostProcess {

    constructor( scene, camera ) {

        
        this.postScene = new Scene();

        // Create frame buffers

        this.sceneFBO   = WebGLUtils.CreateFBO( true );
        this.blurFBO    = WebGLUtils.CreateFBO( false );
        this.normalFBO  = WebGLUtils.CreateFBO( false );
        this.uvFBO      = WebGLUtils.CreateFBO( false );

        // Setup passes

        this.postBlurPass = new PostBoxBlurPass( this.blurFBO.texture );
        scene.add( this.postBlurPass.quad );

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
                tRainbow:   { value: null }
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

    }

    render( renderer, scene, camera ) {

        // Blit original scene texture

        renderer.setRenderTarget( this.sceneFBO );
        renderer.render( scene, camera );
        renderer.setRenderTarget( null );

        // Blit normals to texture

        renderer.setRenderTarget( this.normalFBO );
        scene.overrideMaterial = new MeshNormalMaterial();
        renderer.render( scene, camera )
        scene.overrideMaterial = null;
        renderer.setRenderTarget( null );

        // Blit uvs to texture

        renderer.setRenderTarget( this.uvFBO );
        scene.overrideMaterial = new MeshUVsMaterial();
        renderer.render( scene, camera )
        scene.overrideMaterial = null;
        renderer.setRenderTarget( null );

        // Blit to box blur pass

        // this.postBlurPass.material.uniforms.uTexture.value     = this.sceneFBO.texture;
        // this.postBlurPass.material.uniforms.uResolution.value  = new Vector2( window.innerWidth, window.innerHeight );
        // this.postBlurPass.render( renderer, scene, camera, this.blurFBO );

        // // Final composition

        this.postMaterial.uniforms.tDiffuse.value   = this.sceneFBO.texture;
        this.postMaterial.uniforms.tDepth.value     = this.sceneFBO.depthTexture;
        this.postMaterial.uniforms.tNormal.value    = this.normalFBO.texture;
        this.postMaterial.uniforms.tUV.value        = this.uvFBO.texture;


        renderer.render( this.postScene, this.postCamera );

    }
    

}