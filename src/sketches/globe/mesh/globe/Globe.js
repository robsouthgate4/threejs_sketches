import { Mesh, SphereGeometry } from "three";
import GlobeMaterial 			from "./GlobeMaterial";

export default class Globe extends Mesh {

	constructor( { renderer, scene } ) {
		

		const globeGeo 		= new SphereGeometry( 1, 64, 64 );
		const globeMaterial = new GlobeMaterial( { renderer, scene } );

		super( globeGeo, globeMaterial );

	}

	update( time ) {

		//this.rotation.y -= 0.0005;

		this.material.update( time );

	} 

}