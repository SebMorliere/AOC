import { GenericSolver } from "../shared/utils";
import { Matrix } from "./models/matrix";
import { CellType, Cell } from "./models/cell";

const DAY = 3;
const PART = 1;
const testFile = `./day_${DAY}/test${PART}.data`;
const inputFile = `./day_${DAY}/input${PART}.data`;

class Solver extends GenericSolver {
    private matrix: Matrix<Cell> = new Matrix<Cell>();

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
                if (cell.type === CellType.NUMBER.valueOf()) {
                    cellBuffer.push(cell);
                } else {
                    if (cellBuffer.length > 0) {
                        const isValidPartNumber = cellBuffer.flatMap(cell => this.matrix.getSurroundingCells(cell.coords))
                            .some(cell => cell.type === CellType.SYMBOL.valueOf());
                        if (isValidPartNumber) {
                            listOfValidPartNumber.push(+cellBuffer.map(cell => cell.value).join(""));
                        }
                        cellBuffer = [];
                    }
                }
            }
        }
        this.res = listOfValidPartNumber.reduce((previousValue, currentValue) => previousValue + currentValue);
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 4361
new Solver(DAY, PART, inputFile).solve();
// tested 538293 but too low

