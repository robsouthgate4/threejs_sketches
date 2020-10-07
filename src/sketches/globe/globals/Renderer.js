import { WebGLRenderer, Color } from "three";

class Renderer extends WebGLRenderer {

	constructor() {

		super( { canvas: document.getElementById( "c" ), antialias: true } );

		this.setPixelRatio( window.devicePixelRatio );
		this.setClearColor( new Color( "rgb(0, 0, 0)" ) );

		this.setSize( window.innerWidth, window.innerHeight );

		

	}

}

export default new Renderer();