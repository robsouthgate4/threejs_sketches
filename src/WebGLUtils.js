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
	UnsignedByteType,
	RGBM16Encoding,
	LinearMipMapNearestFilter,
	LinearEncoding,
	LuminanceFormat,
	ClampToEdgeWrapping
} from "three";

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxLoader = new FBXLoader();
const tl 		= new TextureLoader();

export default class WebGLUtils {


	static CreateFBO(useDepth) {

		let fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
		fbo.texture.format = RGBAFormat;
		fbo.texture.minFilter = LinearMipMapNearestFilter;
		fbo.texture.magFilter = LinearMipMapNearestFilter;


		if (useDepth) {

			fbo.depthBuffer = true;
			fbo.depthTexture = new DepthTexture();
			fbo.depthTexture.format = DepthFormat;
			fbo.depthTexture.type = UnsignedShortType;

		}

		return fbo;

	}

	static CreateDoubleFBO(w, h, filtering) {

		let rt1 = new WebGLRenderTarget(w, h, {

			type: FloatType,
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
			format: RGBAFormat,
			encoding: LinearEncoding

		});


		let rt2 = new WebGLRenderTarget(w, h, {

			type: FloatType,
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
			format: RGBAFormat,
			encoding: LinearEncoding

		});

		return {

			read: rt1,
			write: rt2,

			swap: function () {

				let temp = this.read;
				this.read = this.write;
				this.write = temp;

			}

		}
	}

	static LoadModelFBX(url) {

		return new Promise((resolve, reject) => {

			fbxLoader.load(url, fbx => {

				const result = fbx;
				resolve(result);

			});

		});

	}

	static LoadTexture(url) {

		return new Promise(resolve => {

			tl.load(url, data => {

				if (

					!Math.isPowerOfTwo(data.image.width) ||
					!Math.isPowerOfTwo(data.image.height)

				) {

					console.warn(`>>> "${url}" image size is not power of 2 <<<`);

				}

				data.needsUpdate = true;

				resolve(data);

			});

		});

	}


}