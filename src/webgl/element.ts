import { Vector3 } from "@webgl/vector";
import { Matrix, Matrix4, SquareMatrix } from "@webgl/matrix";
import { SharedRef } from "../shared";

export class WebGLElement extends SharedRef {
    position = new Vector3();
    rotation = new Matrix4();

    transform = Matrix.identity(4) as Matrix4;

    /** HOOKS */

    beforeDraw() { }

    afterDraw() { }

    /** HOOKS END */

    lookAt(vector: Vector3): void {
        vector.from(this.position);
        const v = this.position.cross(vector);
        const c = this.position.dot(vector);

        if (c === 1) {
            this.rotation = Matrix4.identity(4).multiply(-1);
            this.rotation.set(3, 3, 1);
            return;
        }

        const vx = SquareMatrix.fromArray([
            0, -v.z, v.y,
            v.z, 0, -v.x,
            -v.y, v.x, 0,
        ]);

        const rot  = SquareMatrix.add(Matrix.identity(3), vx, vx.multiply(vx).multiply(1 / (1 + c)));
        const mat4 = new Matrix4();
        rot.forEach((value, i, j) => mat4.set(i, j, value));
        this.rotation = mat4;
    }

    updateTransformMatrix(): void {
        this.transform = Matrix.identity(4);
        this.transform = this.transform.translate(this.position.coordinates);
        this.transform = this.transform.multiply(this.rotation);
    }

    rotate(theta: number, axis: Vector3): void {
        this.rotation = this.rotation.rotate(theta * Math.PI / 180, axis);
    }

    rotateX(theta: number): void { this.rotate(theta, new Vector3(1, 0, 0)); }

    rotateY(theta: number): void { this.rotate(theta, new Vector3(0, 1, 0)); }

    rotateZ(theta: number): void { this.rotate(theta, new Vector3(0, 0, 1)); }
}
