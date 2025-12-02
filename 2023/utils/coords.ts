export class Coords {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(coords: Coords): boolean {
        if (coords === null || coords === undefined) {
            return false;
        } else {
            return this.x === coords.x && this.y === coords.y;
        }
    }
}