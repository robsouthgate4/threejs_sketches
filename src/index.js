

import "./style.css";

import Scene from "./sketches/globe";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();