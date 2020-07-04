import { Material, ShaderMaterial } from "three";
import vertexShader                 from './meshPosition.vert';
import fragmentShader               from './meshPosition.frag';

export default class MeshPositionMaterial extends ShaderMaterial {

    constructor() {

        const uniforms = {
			
		};

        super( { uniforms, vertexShader, fragmentShader } );

    }

}