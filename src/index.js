

import "./style.css";

import Scene from "./sketches/city_concept/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();