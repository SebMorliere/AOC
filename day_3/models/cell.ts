import { Coords } from "./coords";

export class Cell {
    readonly coords: Coords;
    readonly type: CellType;
    readonly value: string;

    constructor(x: number, y: number, value: string) {
        this.coords = new Coords(x, y);
        this.value = value;
        if (isSymbol(this.value)) {
            this.type = CellType.SYMBOL;
        } else if (isNumber(this.value)) {
            this.type = CellType.NUMBER;
        } else {
            this.type = CellType.EMPTY;
        }
    }
}

export enum CellType {
    SYMBOL = "SYMBOL",
    NUMBER = "NUMBER",
    EMPTY = "EMPTY"
}

// regex: [^0-9.]
export function isSymbol(char: string): boolean {
    return char.length === 1 && isNaN(+char) && char !== ".";
}

export function isNumber(char: string): boolean {
    return char.length === 1 && !isNaN(+char);
}