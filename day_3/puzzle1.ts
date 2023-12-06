import { Matrix } from "./models/matrix";
import { Cell, CellType } from "./models/cell";
import { GenericSolver } from "../shared/generic-solver";
import { ColoredLogger, FgColor, Tinter } from "../shared/colored-logger";

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
        const listOfValidPartNumber: number[] = [];
        for (let y = 0; y < this.matrix.getHeight(); y++) {
            let cellBuffer: Cell[] = [];
            for (let x = 0; x < this.matrix.getWidth(); x++) {
                const cell = this.matrix.getCell(x, y);
                if (cell.type === CellType.NUMBER) {
                    cellBuffer.push(cell);
                }
                if (cellBuffer.length > 0 && (cell.type !== CellType.NUMBER || x + 1 === this.matrix.getWidth())) {
                    const isValidPartNumber = cellBuffer.flatMap(cell => this.matrix.getSurroundingCells(cell.coords))
                        .some(cell => cell.type === CellType.SYMBOL.valueOf());
                    if (isValidPartNumber) {
                        cellBuffer.forEach(cell => cell.charColor = { fgColor: FgColor.GREEN });
                        listOfValidPartNumber.push(+cellBuffer.map(cell => cell.value).join(""));
                    } else {
                        cellBuffer.forEach(cell => cell.charColor = { fgColor: FgColor.RED });
                    }
                    cellBuffer = [];
                }
            }
        }
        // this.displayMatrix();
        this.res = listOfValidPartNumber.reduce((previousValue, currentValue) => previousValue + currentValue);
    }

    private displayMatrix() {
        this.matrix.cells
            .map(cells => cells.map(cell => Tinter.tint(cell.value, cell.charColor)).join(""))
            .forEach(line => this.coloredLogger.logTinted(line));
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 4361
new Solver(DAY, PART, inputFile).solve();
// tested 538293 but too low
// new test 540131
