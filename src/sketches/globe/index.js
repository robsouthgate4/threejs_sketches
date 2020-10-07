

import "./style.css";

import World from "./World";

const world = new World();

world.start();

window.addEventListener( "resize", () => {

    world.resize( window.innerWidth, window.innerHeight );

} );