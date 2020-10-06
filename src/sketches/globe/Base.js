import Constants from "Common/Constants"
import Emitter 	 from "Common/Emitter";

export default class Base {

	constructor() {

		this.isRunning 		= false;
		this.requestFrame 	= null;
		this.elapsed		= null;

		this.mouse			= {};

		this.width 			= window.innerWidth;
		this.height 		= window.innerHeight;

		this.createEvents();

	}

	start() {

		this.now 		= Date.now();
		this.isRunning 	= true;

		this.run();

	}	

	createEvents() {

		if( Constants.IsTouchDevice() ){

            window.addEventListener( "touchstart", this.onTouch.bind( this ) );
            window.addEventListener( "touchend",   this.onTouchEnd.bind( this ) );
            window.addEventListener( "touchmove",  this.onMouseMove.bind( this ) );
        }

        else{

            window.addEventListener( "mousedown", 	this.onTouch.bind( this ) );
            window.addEventListener( "mouseup",  	this.onTouchEnd.bind( this ) );
            window.addEventListener( "mousemove", 	this.onMouseMove.bind( this ) );

		}
		

	}

	onTouch( ev ) {
		
		this.mouse = this.getMouse( ev );
		
	}

	onTouchEnd( ev ) {

		this.mouse = this.getMouse( ev );

	}

	onMouseMove( ev ) {

		if ( ev.touches ){

            if( ev.touches.length > 1){

                return;
            }
          
        }

        ev.preventDefault();
        ev.stopPropagation();

        this.mouse = this.getMouse( ev );

	}

	getMouse( ev ) {

		if( ev.changedTouches ){

            ev = ev.changedTouches[ 0 ]
        }

        return {

            normalized: {

                x: ( ev.clientX / this.width ) * 2 - 1,
				y: ( ev.clientY / this.height ) * 2 - 1
				
            },
            raw: {

                x: ev.clientX,
				y: ev.clientY
				
            },
            rawNormalized: {

                x: ( ev.clientX - ( this.width * 0.5 ) ) * 2,
				y: ( ev.clientY - ( this.height * 0.5 ) ) * 2,
				
            }
        }

	}

	pause() {

		if( this.requestFrame ) {

			cancelAnimationFrame( this.requestFrame );

			this.requestFrame = null;

		}

		this.isRunning = false;

	}

	earlyUpdate( elapsed, delta ) {
		
		Emitter.emit( "earlyUpdate", { elapsed, delta } );

	}

	update( elapsed, delta ) {

		console.log( elapsed )

		Emitter.emit( "update", { elapsed, delta } );

	}

	lateUpdate( elapsed, delta ){

		Emitter.emit( "lateUpdate", { elapsed, delta } );
		
	}

	run() {

		if ( ! this.isRunning ) {

			this.now = Date.now();

		}

		let tempnow = Date.now();

        let delta = ( tempnow - this.now ) / 1000;

        this.now = tempnow;

		this.elapsed += delta;

		this.earlyUpdate( this.elapsed, delta );

		this.update( this.elapsed, delta );

		this.lateUpdate( this.elapsed, delta );
		
		if ( this.isRunning ) {

			this.requestFrame = requestAnimationFrame( this.run.bind( this ) );

		}

	}

}