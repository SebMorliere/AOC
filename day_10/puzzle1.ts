import { GenericSolver } from "../shared/generic-solver";
import { Tile } from "./models";
import { Matrix, MatrixCell } from "../shared/matrix";
import { Coords } from "../shared/coords";

const DAY = 10;
const PUZZLE = 1;
const TEST1 = 1;
const TEST1b = "1b";
const TEST2 = 2;
const TEST2b = "2b";
const DATA = 1;
const testFile1 = `./day_${DAY}/test${TEST1}.data`;
const testFile1b = `./day_${DAY}/test${TEST1b}.data`;
const testFile2 = `./day_${DAY}/test${TEST2}.data`;
const testFile2b = `./day_${DAY}/test${TEST2b}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    private matrix: Matrix<Tile> = new Matrix();
    private startingPoint: MatrixCell<Tile> = new MatrixCell<Tile>(new Coords(0, 0), new Tile("S"));

    protected lineProcessor(line: string): void {
        line.split("").forEach((tile, index) => {
            const matrixCell = new MatrixCell<Tile>(new Coords(index, this.matrix.getHeight()), new Tile(tile));
            if (matrixCell.content.isStartingPoint()) {
                this.startingPoint = matrixCell;
            }
            return this.matrix.append(matrixCell);
        });
        this.matrix.newLine();
    }

    protected resultProcessor(): void {
        const following = this.matrix.getSurroundingCells(this.startingPoint.coords)
            .filter(tile => tile.content.acceptConnectionFrom(this.startingPoint.content))
            .map(tile => {
                tile.content.distance = 1;
                return tile;
            })
            .flatMap(tile => {
                return this.matrix.getSurroundingCells(tile.coords)
                    .filter(surroundingTiles => surroundingTiles.content.acceptConnectionFrom(tile.content))
                    .map(validSurroundingTile => {
                        validSurroundingTile.content.distance = (tile.content.distance || 0) + 1;
                        return validSurroundingTile;
                    });
            });

        this.res = 0;
    }
}

new Solver(DAY, PUZZLE, testFile1).solve(); // expecting 4
new Solver(DAY, PUZZLE, testFile1b).solve(); // expecting 4
new Solver(DAY, PUZZLE, testFile2).solve(); // expecting 8
new Solver(DAY, PUZZLE, testFile2b).solve(); // expecting 8
// new Solver(DAY, PUZZLE, inputFile).solve(); //
