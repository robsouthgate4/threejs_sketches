

import "./style.css";

import Scene from "./sketches/compute_lab/compute/cca_mn/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();