import { WebGLRenderTarget, DepthTexture, RGBAFormat, NearestFilter, UnsignedShortType, DepthFormat } from "three";

export default class WebGLUtils {
    

    static CreateFBO( useDepth ) {
    
        let fbo                     = new WebGLRenderTarget( window.innerWidth, window.innerHeight );
        fbo.texture.format          = RGBAFormat;
        fbo.texture.minFilter       = NearestFilter;
        fbo.texture.magFilter       = NearestFilter;
        fbo.texture.generateMipmaps = false;
        fbo.depthBuffer             = true;
    
        if ( useDepth ) {
    
            fbo.depthTexture            = new DepthTexture();
            fbo.depthTexture.format     = DepthFormat;
            fbo.depthTexture.type       = UnsignedShortType;
    
        }    
    
        return fbo;
    
    }

    
}