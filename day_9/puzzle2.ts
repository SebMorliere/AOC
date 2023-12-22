import { GenericSolver } from "../shared/generic-solver";
import { extrapolateLast } from "./models";

const DAY = 9;
const PUZZLE = 2;
const TEST = 1;
const DATA = 1;
const testFile = `./day_${DAY}/test${TEST}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    private resBuffer = 0;

    protected lineProcessor(line: string): void {
        const history: number[] = line.split(" ").map(s => +s).reverse();
        this.resBuffer += extrapolateLast(history);

    }

    protected resultProcessor(): void {
        this.res = this.resBuffer;
    }
}

new Solver(DAY, PUZZLE, testFile).solve(); // expecting 2
new Solver(DAY, PUZZLE, inputFile).solve(); //
