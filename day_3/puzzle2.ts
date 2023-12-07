import { Matrix } from "./models/matrix";
import { Cell, CellType } from "./models/cell";
import { GenericSolver } from "../shared/generic-solver";
import { BgColor, ColoredLogger, FgColor, Tinter } from "../shared/colored-logger";

const DAY = 3;
const PART = 1;
const testFile = `./day_${DAY}/test${PART}.data`;
const inputFile = `./day_${DAY}/input${PART}.data`;

class Solver extends GenericSolver {
    private readonly matrix: Matrix<Cell> = new Matrix<Cell>();
    private readonly coloredLogger = new ColoredLogger();

    protected lineProcessor(line: string): void {
        line.split("")
            .forEach((char, index) => {
                const newCell: Cell = new Cell(index, this.matrix.getHeight(), char);
                this.matrix.append(newCell);
            });
        this.matrix.newLine();
    }

    protected resultProcessor(): void {
        for (let y = 0; y < this.matrix.getHeight(); y++) {
            let cellBuffer: Cell[] = [];
            for (let x = 0; x < this.matrix.getWidth(); x++) {
                const cell = this.matrix.getCell(x, y);
                if (cell.type === CellType.NUMBER) {
                    cellBuffer.push(cell);
                }
                if (cellBuffer.length > 0 && (cell.type !== CellType.NUMBER || x + 1 === this.matrix.getWidth())) {
                    const gearList = cellBuffer.flatMap(cell => this.matrix.getSurroundingCells(cell.coords))
                        .filter(cell => cell.type === CellType.GEAR)
                        .filter((n, i, arr) => arr.indexOf(n) === i);
                    gearList.forEach(cell => {
                        cell.charColor = { fgColor: FgColor.YELLOW };
                    });
                    const isValidPartNumber = gearList.length > 0;

                    if (isValidPartNumber) {
                        cellBuffer.forEach(cell => cell.charColor = { fgColor: FgColor.YELLOW });
                        const partNumber = +cellBuffer.map(cell => cell.value).join("");
                        gearList.forEach(cell => {
                            cell.adjacentPartNumberList.push(partNumber);
                            if (cell.adjacentPartNumberList.length > 1) {
                                cellBuffer.forEach(cell => cell.charColor = { fgColor: FgColor.GREEN });
                            }
                        });
                    } else {
                        cellBuffer.forEach(cell => cell.charColor = { fgColor: FgColor.RED });
                    }
                    cellBuffer = [];
                }
            }
        }
        this.res = this.matrix.cells.flatMap(cells => cells)
            .map(cell => {
                if (cell.type === CellType.GEAR && cell.adjacentPartNumberList.length === 2) {
                    cell.charColor = { fgColor: FgColor.GREEN };
                    return cell.adjacentPartNumberList.reduce((previousValue, currentValue) => previousValue * currentValue);
                } else {
                    return 0;
                }
            })
            .reduce((previousValue, currentValue) => previousValue + currentValue);
        // this.displayMatrix();
    }

    private displayMatrix() {
        this.matrix.cells
            .map(cells => cells.map(cell => Tinter.tint(cell.value, cell.charColor)).join(""))
            .forEach(line => this.coloredLogger.logTinted(line));
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 467835
new Solver(DAY, PART, inputFile).solve(); // test 86879020
