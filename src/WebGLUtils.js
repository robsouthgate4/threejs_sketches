import { WebGLRenderTarget, DepthTexture, RGBAFormat, NearestFilter, UnsignedShortType, DepthFormat, TextureLoader, Math } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxLoader     = new FBXLoader();
const tl            = new TextureLoader();

export default class WebGLUtils {
    

    static CreateFBO( useDepth ) {
    
        let fbo                     = new WebGLRenderTarget( window.innerWidth, window.innerHeight );
        fbo.texture.format          = RGBAFormat;
        fbo.texture.minFilter       = NearestFilter;
        fbo.texture.magFilter       = NearestFilter;
        fbo.texture.generateMipmaps = false;
        
    
        if ( useDepth ) {

            fbo.depthBuffer             = true;
            fbo.depthTexture            = new DepthTexture();
            fbo.depthTexture.format     = DepthFormat;
            fbo.depthTexture.type       = UnsignedShortType;
    
        }    
    
        return fbo;
    
    }

    static LoadModelFBX( url ) {

        return new Promise( ( resolve, reject ) => {

            fbxLoader.load( url, fbx => {

                const result = fbx;
                resolve( result );

            } );

          } );

    }

    static LoadTexture( url ) {

        return new Promise(resolve => {

          tl.load( url, data => {

            if (

              !Math.isPowerOfTwo( data.image.width ) ||
              !Math.isPowerOfTwo( data.image.height )

            ) {

              console.warn(`>>> "${url}" image size is not power of 2 <<<`);

            }
      
            data.needsUpdate = true;

            resolve( data );

          });

        });

    }

    
}