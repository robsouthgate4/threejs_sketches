import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Controls extends OrbitControls {

    constructor( camera, domElement ) {

        super( camera, domElement );

        this.enableDamping    = true;
        this.rotateSpeed      = 0.2;
        this.dampingFactor    = 0.05;
        this.maxDistance      = 750;
        this.minZoom          = 300;
        this.panSpeed         = 0.2;
        this.autoRotate       = false;
        this.autoRotateSpeed  = 0.6;
        this.maxPolarAngle = Math.PI / 2.3;

    }

}