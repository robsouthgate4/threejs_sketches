

import "./style.css";

import Scene from "./sketches/compute_mesh/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();