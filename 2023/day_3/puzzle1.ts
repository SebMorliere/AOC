import { Cell, CellType } from "./models/cell";
import { GenericSolver } from "../utils/generic-solver";
import { ColoredLogger, FgColor, tint } from "../utils/colored-logger";
import { sum } from "../utils/utils";
import { Matrix, MatrixCell } from "../utils/matrix";
import { Coords } from "../utils/coords";

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
                const newCell: MatrixCell<Cell> = new MatrixCell<Cell>(new Coords(index, this.matrix.getHeight()), new Cell(char));
                this.matrix.append(newCell);
            });
        this.matrix.newLine();
    }

    protected resultProcessor(): void {
        const listOfValidPartNumber: number[] = [];
        for (let y = 0; y < this.matrix.getHeight(); y++) {
            let matrixCellBuffer: MatrixCell<Cell>[] = [];
            for (let x = 0; x < this.matrix.getWidth(); x++) {
                const mCell = this.matrix.getCell(x, y);
                if (mCell.content.type === CellType.NUMBER) {
                    matrixCellBuffer.push(mCell);
                }
                if (matrixCellBuffer.length > 0 && (mCell.content.type !== CellType.NUMBER || x + 1 === this.matrix.getWidth())) {
                    const isValidPartNumber = matrixCellBuffer.flatMap(cell => this.matrix.getSurroundingCells(cell.coords))
                        .some(mCell => mCell.content.type === CellType.SYMBOL || mCell.content.type === CellType.GEAR);
                    if (isValidPartNumber) {
                        matrixCellBuffer.forEach(mCell => mCell.content.charColor = { fgColor: FgColor.GREEN });
                        listOfValidPartNumber.push(+matrixCellBuffer.map(mCell => mCell.content.value).join(""));
                    } else {
                        matrixCellBuffer.forEach(mCell => mCell.content.charColor = { fgColor: FgColor.RED });
                    }
                    matrixCellBuffer = [];
                }
            }
        }
        // this.displayMatrix();
        this.res = listOfValidPartNumber.reduce(sum);
    }

    private displayMatrix() {
        this.matrix.cells
            .map(mCells => mCells.map(mCell => tint(mCell.content.value, mCell.content.charColor)).join(""))
            .forEach(line => this.coloredLogger.logTinted(line));
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 4361
new Solver(DAY, PART, inputFile).solve(); // accepted res 540131
