import { Material, ShaderMaterial } from "three";
import vertexShader                 from './meshUvs.vert';
import fragmentShader               from './meshUvs.frag';

export default class MeshUVsMaterial extends ShaderMaterial {

    constructor() {

        const uniforms = {
			
		};

        super( { uniforms, vertexShader, fragmentShader } );

    }

}