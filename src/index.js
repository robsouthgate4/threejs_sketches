

import "./style.css";

import Scene from "./sketches/toy_planes_game/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();