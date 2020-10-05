import { PerspectiveCamera, Vector2 } from "three";

import { TweenLite } from "gsap/gsap-core";

export default class Camera extends PerspectiveCamera {

	constructor( { renderer } ) {

		super( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );

		this.renderer = renderer;

		this.position.set( 0, 0, 3.0 );

		this.startPos = this.position;

		this.mouse = new Vector2();

		this.canvas = this.renderer.domElement;

		document.addEventListener( "mousemove", this.onMouseMove.bind( this ) )

		this.newPos = new Vector2();

	}

	onMouseMove( mouseEvent ) {

		this.mouse.set( mouseEvent.clientX / this.canvas.clientWidth, mouseEvent.clientY / this.canvas.clientHeight, 0 );
		this.mouse.multiplyScalar( 2 ).subScalar( 1 );
	
	}

	update ( time ) {

		TweenLite.to( this.position, 4, { x: this.mouse.x * 0.1, y: this.mouse.y * 0.1 } );

	}

}