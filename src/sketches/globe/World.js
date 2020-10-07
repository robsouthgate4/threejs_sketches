
import { 
    HemisphereLight, 
    Color,
    PointLight, 
    Mesh, 
    MeshStandardMaterial, 
    Object3D, 
    CubeGeometry,
    Math } 
    from "three";

import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls'
import Globe                from "./components/globe/Globe";
import Camera               from "Globals/Camera";
import Scene                from "Globals/Scene";;
import Renderer             from "Globals/Renderer";
import Utils                from "Common/Utils";
import Base                 from "./Base";

import PostProcess          from "./postprocessing";

export default class World extends Base {

    constructor() {

        super();

        this.renderer   =   Renderer;
        this.scene      =   Scene;

        this.globeContainer = new Object3D();

        this.globe;

        this.createScene();
        this.addLights();

        this.createGlobePins();
        

    }

    createGlobePins() {

        const cities = [
            {
                lat: 51.5074,
                lon: 0.1278,
                name: "London",
                polution: 0.5
            },
            {
                lat: 45.4642,
                lon: 9.1900,
                name: "Milan",
                polution: 0.2
            },

        ];

        cities.forEach( city => {

            const pinGeo    = new CubeGeometry( 0.0025, 0.0025, city.polution );
            const pinMesh   = new Mesh( pinGeo, new MeshStandardMaterial(  ) );
            const pos       = Utils.CalcPosFromLatLonRad( city.lat, city.lon, 1 );

            pinMesh.position.set( pos.x, pos.y, pos.z );
            pinMesh.position.z += 0.0;

            pinMesh.lookAt( this.globe.position );

            this.globeContainer.add( pinMesh );   

        } )

           

    }

    createScene() {

        this.globe = new Globe( );

        this.globeContainer.add( this.globe );

        this.scene.add( this.globeContainer );

        this.globeContainer.rotation.y = Math.degToRad( 240 );
        this.globeContainer.rotation.x = Math.degToRad( 45 );

    }

    addLights() {

        this.scene.add( new HemisphereLight() )
        
        const pl1 = new PointLight( new Color( "rgb( 180, 140, 50 )" ), 0.5 );
        pl1.position.set( 0, 0, 0 );

        // const pl2 = new PointLight( new Color( "rgb( 180, 140, 50 )" ), 0.5 );
        // pl2.position.set( 0.5, 0, 0 );

        this.scene.add( pl1 );

    }

    async loadModels() {

    }

    async loadTextures() {

    }

    resize() {

        const canvas = this.renderer.domElement;
        Camera.aspect = canvas.clientWidth / canvas.clientHeight;
        Camera.updateProjectionMatrix();

        const pixelRatio = window.devicePixelRatio;

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    onMouseMove( ev ) {

        super.onMouseMove( ev );

    }

    onTouchEnd( ev ) {

        super.onTouchEnd( ev );

    }

    earlyUpdate( elapsedTime, delta ) {

        super.earlyUpdate();

    }

    update( elapsedTime, delta ) {

        super.update( elapsedTime, delta );

        this.globeContainer.rotation.y += 0.1 * delta;

        this.resize();

        PostProcess.render( Scene, Camera );

    }

    lateUpdate( elapsedTime, delta ) {

        super.lateUpdate( elapsedTime, delta );

    }

}