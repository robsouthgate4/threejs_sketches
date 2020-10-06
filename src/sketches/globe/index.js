

import "./style.css";

import Scene from "./Scene";

const activeScene = new Scene();

activeScene.start();

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );