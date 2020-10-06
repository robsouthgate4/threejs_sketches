import {

	WebGLRenderTarget,
	DepthTexture,
	RGBAFormat,
	UnsignedShortType,
	DepthFormat,
	TextureLoader,
	FloatType,
	NearestFilter,
	RepeatWrapping,
	Vector3

} from "three";

import { FBXLoader } 	from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } 	from 'three/examples/jsm/loaders/GLTFLoader';

const fbxLoader 	= new FBXLoader();
const gltfLoader 	= new GLTFLoader();
const tl 			= new TextureLoader();

export default class Utils {


	static CreateFBO( useDepth ) {

		let fbo = new WebGLRenderTarget( window.innerWidth, window.innerHeight );
		fbo.texture.format = RGBAFormat;
		fbo.texture.minFilter = NearestFilter;
		fbo.texture.magFilter = NearestFilter;
		fbo.texture.generateMipmaps = false;
		fbo.depthBuffer = true;

		if ( useDepth ) {

			fbo.depthTexture = new DepthTexture();
			fbo.depthTexture.format = DepthFormat;
			fbo.depthTexture.type = UnsignedShortType;

		}

		return fbo;

	}

	static CreateDoubleFBO( w, h, filtering ) {

		let rt1 = new WebGLRenderTarget( w, h, {

			type: FloatType,
			minFilter: filtering || NearestFilter,
			magFilter: filtering || NearestFilter,
			wrapS: RepeatWrapping,
			wrapT: RepeatWrapping,
			format: RGBAFormat,
			depthBuffer: false,
			stencilBuffer: false,
			anisotropy: 1,
			generateMipmaps: false

		} );

		let rt2 = new WebGLRenderTarget( w, h, {

			type: FloatType,
			minFilter: filtering || NearestFilter,
			magFilter: filtering || NearestFilter,
			wrapS: RepeatWrapping,
			wrapT: RepeatWrapping,
			format: RGBAFormat,
			depthBuffer: false,
			stencilBuffer: false,
			anisotropy: 1,
			generateMipmaps: false

		} );

		return {

			read: rt1,
			write: rt2,

			swap: function () {

				let temp = this.read;
				this.read = this.write;
				this.write = temp;

			}

		};

	}

	static LoadModelFBX( url ) {

		return new Promise( ( resolve, reject ) => {

			fbxLoader.load( url, fbx => {

				const result = fbx;
				resolve( result );

			} );

		} );

	}

	static LoadModelGLTF( url ) {

		return new Promise( ( resolve, reject ) => {

			gltfLoader.load( url, gltf => {

				const result = gltf.scene;
				resolve( result );

			} );

		} );

	}

	static LoadTexture( url ) {

		return new Promise( resolve => {

			tl.load( url, data => {

				if (

					! Math.isPowerOfTwo( data.image.width ) ||
					! Math.isPowerOfTwo( data.image.height )

				) {

					console.warn( `>>> "${url}" image size is not power of 2 <<<` );

				}

				data.needsUpdate = true;

				resolve( data );

			} );

		} );

	}

	static CalcPosFromLatLonRad( lat, lon, radius ) {

		var phi = ( 90 - lat ) * ( Math.PI / 180 );

		var theta = ( lon + 180 ) * ( Math.PI / 180 );

		const x = - ( ( radius ) * Math.sin( phi ) * Math.cos( theta ) );
		const z = ( ( radius ) * Math.sin( phi ) * Math.sin( theta ) );
		const y = ( ( radius ) * Math.cos( phi ) );

		return new Vector3( x, y, z );

	}


}
