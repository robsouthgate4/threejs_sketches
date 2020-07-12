import WebGLUtils from "../../WebGLUtils";
import { WebGLRenderTarget, NearestFilter, ClampToEdgeWrapping, HalfFloatType, Scene, OrthographicCamera, Mesh, PlaneGeometry, FloatType, LinearFilter } from "three";
import SimMaterial from "./SimMaterial";
import { Camera } from "three/build/three.module";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";


export default class {

    constructor( { renderer, fboHelper } ) {

        this.renderer       = renderer;
        this.fboHelper      = fboHelper;
        this.width          = 512;
        this.height         = 512;
        this.simMaterial    = new SimMaterial();

        this.gpuCompute     = new GPUComputationRenderer( this.width, this.height, this.renderer );
        this.position       = this.gpuCompute.createTexture();

        this.posVar         = this.gpuCompute.addVariable( "tPositions", this.simMaterial.fragmentShader, this.position );

        this.gpuCompute.setVariableDependencies( this.posVar, [ this.posVar ] );

        

        const error         = this.gpuCompute.init();
        if ( error != null ) {

            console.error( error );

        }

        this.fboHelper.attach( this.gpuCompute.getCurrentRenderTarget( this.posVar ).texture, 'position' );

    }

    compute() {

        this.gpuCompute.compute();
        
        this.fboHelper.update();

    }

}