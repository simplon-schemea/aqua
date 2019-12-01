import { CacheManager } from "@webgl/utils";
import { Material } from "@webgl/materials";


const shadersNB: { [k in string]: number } = {};

function getPrefix(type: GLenum) {
    switch (type) {
        case WebGLRenderingContext.VERTEX_SHADER:
            return "v";
        case  WebGLRenderingContext.FRAGMENT_SHADER:
            return "f";
        default:
            throw "invalid type";
    }
}

export class Shader {
    handle: WebGLShader;
    id: number;

    constructor(public context: WebGLRenderingContext, public type: GLenum) {
        this.handle = context.createShader(type);
        this.id     = shadersNB[type] = shadersNB[type] + 1 || 0;
    }

    get name(): string {
        return getPrefix(this.type) + this.id;
    }

    get source(): string { return this.context.getShaderSource(this.handle); }

    set source(value: string) { this.context.shaderSource(this.handle, value); }

    static load(context: WebGLRenderingContext, name: string, type: GLenum): Shader {
        const shader = new Shader(context, type);
        fetch(`/shaders/${ name }.glsl`).then(response => response.text()).then(source => {
            shader.source = source;
            shader.compile();
        }).catch(console.error);
        // import(`@shaders/${name}.glsl`).then(source => {
        //     shader.source = source;
        //     shader.compile();
        // }).catch(console.error);
        return shader;
    }

    getParameter<T>(name: GLenum): T { return this.context.getShaderParameter(this.handle, name);}

    getInfoLog(): string { return this.context.getShaderInfoLog(this.handle); }

    compile(): void {
        this.context.compileShader(this.handle);
        if (!this.getParameter(this.context.COMPILE_STATUS)) {
            console.error(this.getInfoLog());
        }
    }

    release(): void { this.context.deleteShader(this.handle); }
}

export class MaterialShaderCache extends CacheManager<Shader, (name: Material) => Shader> {
    constructor(public readonly context: WebGLRenderingContext) {
        super((material: Material) => {
            return material.createShader(context);
        });
    }

    extractKey(material: Material): string {
        return material.type;
    }
}

export interface MaterialShaderCache {
    get(material: Material);
}
