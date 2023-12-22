import { CharColor, FgColor } from "../../shared/colored-logger";

export class Cell {
    readonly type: CellType;
    readonly value: string;
    charColor: CharColor = {};
    adjacentPartNumberList: number[] = [];

    constructor(value: string) {
        this.value = value;
        this.type = getCellType(value);
        if (this.type === CellType.EMPTY) {
            this.charColor = {fgColor: FgColor.GRAY};
        }
    }
}

export enum CellType {
    GEAR = "GEAR",
    SYMBOL = "SYMBOL",
    NUMBER = "NUMBER",
    EMPTY = "EMPTY"
}

export function getCellType(cellValue: string): CellType {
    if (cellValue.length === 1 && isNaN(+cellValue) && cellValue === "*") {
        return CellType.GEAR;
    } else if(cellValue.length === 1 && isNaN(+cellValue) && cellValue !== ".") {
        return CellType.SYMBOL;
    } else if (cellValue.length === 1 && !isNaN(+cellValue)) {
        return CellType.NUMBER;
    } else {
        return CellType.EMPTY;
    }
}
