import { Coords } from "./coords";

export class Matrix<T> {
    private readonly cells: T[][] = [[]];
    private height: number = 0;
    private width: number = 0;

    append(cell: T) {
        this.cells[this.cells.length - 1].push(cell);
        this.width = Math.max(this.width, this.cells[this.cells.length - 1].length);
    }

    newLine() {
        this.cells.push([]);
        this.height++;
    }

    getHeight(): number {
        return this.height;
    }

    getWidth(): number {
        return this.width;
    }

    getCell(x: number, y: number): T {
        return this.cells[y][x];
    }

    getCellFromCoord(coords: Coords): T {
        return this.cells[coords.y][coords.x];
    }

    getSurroundingCells(coords: Coords) {
        const res: T[] = [];
        for (let x = Math.max(coords.x - 1, 0); x <= Math.min(coords.x + 1, this.width - 1); x++) {
            for (let y = Math.max(coords.y - 1, 0); y <= Math.min(coords.y + 1, this.height - 1); y++) {
                const newCoords = new Coords(x, y);
                if (!newCoords.equals(coords)) {
                    res.push(this.getCellFromCoord(newCoords));
                }
            }
        }
        return res;
    }
}