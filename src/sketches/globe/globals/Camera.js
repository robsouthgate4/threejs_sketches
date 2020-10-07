import { 

	PerspectiveCamera, 
	Vector2 
} 
from "three";

import { TweenLite } 	from "gsap/gsap-core";
import Renderer 		from "Globals/Renderer";
import Emitter			from "Common/Emitter";

class Camera extends PerspectiveCamera {

	constructor( ) {

		super( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );

		this.position.set( 0.0, 0.0, 3.0 );

		this.startPos 	= this.position;
		this.mouse 		= {};
		this.canvas 	= Renderer.domElement;

		this.addEvents();		

		this.newPos = new Vector2();

	}

	addEvents() {

		Emitter.on( "mousemove", this.onMouseMove.bind( this ) );
		Emitter.on( "update", 	 this.update.bind( this ) );

	}

	onMouseMove( evt ) {

		this.mouse = evt;
	
	}

	update ( data ) {

		if ( this.mouse.normalized ) {

			//TweenLite.to( this.position, 4, { x: this.mouse.normalized.x * 0.1, y: this.mouse.normalized.y * 0.1 } );

		}

	}

}

export default new Camera();