import { RawShaderMaterial } from "three";

import vertexShader     from './shaders/sim.vert';
import fragmentShader   from './shaders/sim.frag';


export default class SimMaterial extends RawShaderMaterial {

    constructor( ) {

        const uniforms = {

        };

        super( { vertexShader, fragmentShader, uniforms } );

    }

}