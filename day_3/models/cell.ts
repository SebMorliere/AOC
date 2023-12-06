import { Coords } from "./coords";
import { BgColor, CharColor, FgColor } from "../../shared/colored-logger";

export class Cell {
    readonly coords: Coords;
    readonly type: CellType;
    readonly value: string;
    charColor: CharColor = {};

    constructor(x: number, y: number, value: string) {
        this.coords = new Coords(x, y);
        this.value = value;
        if (isSymbol(this.value)) {
            this.type = CellType.SYMBOL;
            this.charColor = { fgColor: FgColor.BLACK, bgColor: BgColor.BRIGHT_YELLOW };
        } else if (isNumber(this.value)) {
            this.type = CellType.NUMBER;
        } else {
            this.type = CellType.EMPTY;
            this.charColor = {fgColor: FgColor.GRAY};
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