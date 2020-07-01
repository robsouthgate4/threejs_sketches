

import "./style.css";



import Scene from "./sketches/renderTargets/index";

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();