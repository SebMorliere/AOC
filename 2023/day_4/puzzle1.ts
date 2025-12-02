import { GenericSolver } from "../utils/generic-solver";
import { sum } from "../utils/utils";

const DAY = 4;
const PART = 1;
const testFile = `./day_${DAY}/test${PART}.data`;
const inputFile = `./day_${DAY}/input${PART}.data`;

class Solver extends GenericSolver {
    readonly points: number[] = [];
    protected lineProcessor(line: string): void {
        const [cardID, rawNumbers] = line.split(":");
        const [winningNumbers, possessedNumbers] = rawNumbers.split("|")
            .map(rawNums => rawNums.split(" ").map(num => +num.trim()));
        const winningNumbersFound = possessedNumbers
            .filter(pNum => winningNumbers.find(wNum => wNum === pNum))
            .length;
        this.points.push(winningNumbersFound > 0 ? 2**(winningNumbersFound - 1) : 0);
    }

    protected resultProcessor(): void {
        this.res = this.points.reduce(sum);
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 13
new Solver(DAY, PART, inputFile).solve(); // accepted 23028