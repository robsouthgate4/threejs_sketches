

import "./style.css";

import Scene from "./sketches/compute_lab/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();