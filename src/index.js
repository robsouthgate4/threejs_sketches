

import "./style.css";

import Scene from "./sketches/compute_lab/compute/game_of_life/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();