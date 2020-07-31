import { ShaderMaterial } from "three";
import vertexShader       from './heightMap.vert';
import fragmentShader       from './heightMap.frag';


export default class CCAMould extends ShaderMaterial {

    constructor(  ) {

        const uniforms = {

            ccaMap: { value: null }

        }

        super( { vertexShader, fragmentShader, uniforms } );

    }

}