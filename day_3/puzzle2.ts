import { Matrix, MatrixCell } from "../shared/matrix";
import { Cell, CellType } from "./models/cell";
import { GenericSolver } from "../shared/generic-solver";
import { ColoredLogger, FgColor, tint } from "../shared/colored-logger";
import { sum } from "../shared/utils";
import { Coords } from "../shared/coords";

const DAY = 3;
const PART = 2;
const DATA = 1;
const testFile = `./day_${DAY}/test${DATA}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

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
        for (let y = 0; y < this.matrix.getHeight(); y++) {
            let matrixCellBuffer: MatrixCell<Cell>[] = [];
            for (let x = 0; x < this.matrix.getWidth(); x++) {
                const mCell = this.matrix.getCell(x, y);
                if (mCell.content.type === CellType.NUMBER) {
                    matrixCellBuffer.push(mCell);
                }
                if (matrixCellBuffer.length > 0 && (mCell.content.type !== CellType.NUMBER || x + 1 === this.matrix.getWidth())) {
                    const gearList = matrixCellBuffer.flatMap(cell => this.matrix.getSurroundingCells(cell.coords))
                        .filter(cell => cell.content.type === CellType.GEAR)
                        .filter((n, i, arr) => arr.indexOf(n) === i);
                    gearList.forEach(cell => {
                        cell.content.charColor = { fgColor: FgColor.YELLOW };
                    });
                    const isValidPartNumber = gearList.length > 0;

                    if (isValidPartNumber) {
                        matrixCellBuffer.forEach(cell => cell.content.charColor = { fgColor: FgColor.YELLOW });
                        const partNumber = +matrixCellBuffer.map(cell => cell.content.value).join("");
                        gearList.forEach(cell => {
                            cell.content.adjacentPartNumberList.push(partNumber);
                            cell.content.adjacentPartNumberList.push(partNumber);
                            if (cell.content.adjacentPartNumberList.length > 1) {
                                matrixCellBuffer.forEach(cell => cell.content.charColor = { fgColor: FgColor.GREEN });
                            }
                        });
                    } else {
                        matrixCellBuffer.forEach(cell => cell.content.charColor = { fgColor: FgColor.RED });
                    }
                    matrixCellBuffer = [];
                }
            }
        }
        this.res = this.matrix.cells.flatMap(cells => cells)
            .map(cell => {
                if (cell.content.type === CellType.GEAR && cell.content.adjacentPartNumberList.length === 2) {
                    cell.content.charColor = { fgColor: FgColor.GREEN };
                    return cell.content.adjacentPartNumberList.reduce((previousValue, currentValue) => previousValue * currentValue);
                } else {
                    return 0;
                }
            })
            .reduce(sum);
        // this.displayMatrix();
    }

    private displayMatrix() {
        this.matrix.cells
            .map(cells => cells.map(cell => tint(cell.content.value, cell.content.charColor)).join(""))
            .forEach(line => this.coloredLogger.logTinted(line));
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 467835
new Solver(DAY, PART, inputFile).solve(); // test 86879020
