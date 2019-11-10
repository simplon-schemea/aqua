export class Color {
    channels: [number, number, number, number];

    constructor(r?: number, g?: number, b?: number, a?: number);

    constructor(rgba: number[]);

    constructor(...rgba: number[] | [number[]]) {
        if (typeof rgba[0] != "number") {
            rgba = rgba[0];
        }
        this.channels = [
            rgba[0] as number || 0,
            rgba[1] as number || 0,
            rgba[2] as number || 0,
            rgba[3] as number || 1
        ];
    }

    get red() { return this.channels[0]; }

    set red(value: number) { this.channels[0] = value; }

    get blue() { return this.channels[1]; }

    set blue(value: number) { this.channels[1] = value; }

    get green() { return this.channels[2]; }

    set green(value: number) { this.channels[2] = value; }

    get alpha() { return this.channels[3]; }

    set alpha(value: number) { this.channels[3] = value; }
}

export namespace Color {
    export const BLACK = new Color(0, 0, 0, 1);
    export const WHITE = new Color(1, 1, 1, 1);
}