import { GenericSolver } from "../shared/generic-solver";
import { extrapolate } from "./models";

const DAY = 9;
const PUZZLE = 1;
const TEST = 1;
const DATA = 1;
const testFile = `./day_${DAY}/test${TEST}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    private resBuffer = 0;

    protected lineProcessor(line: string): void {
        const history: number[] = line.split(" ").map(s => +s);
        this.resBuffer += extrapolate(history);

    }

    protected resultProcessor(): void {
        this.res = this.resBuffer;
    }
}

new Solver(DAY, PUZZLE, testFile).solve(); // expecting 114
new Solver(DAY, PUZZLE, inputFile).solve(); // 1834108701
