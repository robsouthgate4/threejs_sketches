import { Mesh, SphereGeometry } from "three";
import GlobeMaterial 			from "./GlobeMaterial";
import Emitter					from "Common/Emitter";

export default class Globe extends Mesh {

	constructor( { renderer, scene } ) {
		

		const globeGeo 		= new SphereGeometry( 1, 64, 64 );
		const globeMaterial = new GlobeMaterial( { renderer, scene } );

		super( globeGeo, globeMaterial );

		Emitter.on( "lateUpdate", 	this.lateUpdate.bind( this ) );
		Emitter.on( "update", 		this.update.bind( this ) );
 


	}

	update( data ) {

		//this.rotation.y -= 0.0005;

		console.log( data )

		this.material.update( data.elapsed );

	}

	lateUpdate() {


	}

}