import { GenericSolver } from "../utils/generic-solver";

const DAY = 10;
const PUZZLE = 2;
const TEST = 1;
const DATA = 1;
const testFile = `./day_${DAY}/test${TEST}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    private resBuffer = 0;

    protected lineProcessor(line: string): void {
    }

    protected resultProcessor(): void {
        this.res = this.resBuffer;
    }
}

new Solver(DAY, PUZZLE, testFile).solve(); // expecting
new Solver(DAY, PUZZLE, inputFile).solve(); //
