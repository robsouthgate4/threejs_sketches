import { WebGLRenderer, Color } from "three";

class Renderer extends WebGLRenderer {

	constructor() {

		super( { canvas: document.getElementById( "c" ) } );

		this.setPixelRatio( window.devicePixelRatio );
		this.setClearColor( new Color( 'rgb( 30, 20, 10 )' ) );

		this.setSize( window.innerWidth, window.innerHeight );

		

	}

}

export default new Renderer();