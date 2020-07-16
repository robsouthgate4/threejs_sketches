

import "./style.css";

<<<<<<< HEAD
import Scene from "./sketches/compute_mesh/index";
=======
import Scene from "./sketches/compute_lab/compute/cca/index";
>>>>>>> 7f460b0376d814945a39b73fa8c4768c24be9fd6

const activeScene = new Scene(); 

window.addEventListener( "resize", () => {

    activeScene.resize( );

} );

activeScene.render();