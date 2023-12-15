import { GenericSolver } from "../shared/generic-solver";

const DAY = 6;
const PART = 1;
const testFile = `./day_${DAY}/test${PART}.data`;
const inputFile = `./day_${DAY}/input${PART}.data`;

class Solver extends GenericSolver {
    readonly startingSpeed: number = 0; /** mm/ms */
    timeArr: number[] = [];
    distanceArr: number[] = [];

    protected lineProcessor(line: string): void {
        const TIME: string = "Time:";
        const DISTANCE: string = "Distance:";

        if (line.startsWith(TIME)) {
            this.timeArr.push(...line.replace(TIME, "")
                .split(" ")
                .filter(s => s !== "")
                .map(s => +s.trim()));

        } else if (line.startsWith(DISTANCE)) {
            this.distanceArr.push(...line.replace(DISTANCE, "")
                .split(" ")
                .filter(s => s !== "")
                .map(s => +s.trim()));
        }
    }

    protected resultProcessor(): void {
        this.res = 1;
        for (let index = 0; index < this.timeArr.length; index++) {
            const distMin = this.distanceArr[index];
            const timeMax = this.timeArr[index];
            let numberOfPossibilities = 0;

            for (let pushedTime = 1; pushedTime < timeMax - 1; pushedTime++) {
                const timeLeft = timeMax - pushedTime;
                const dist = timeLeft * pushedTime;
                if (dist > distMin) {
                    numberOfPossibilities++;
                }
            }
            if( numberOfPossibilities > 1) {
                this.res = this.res * numberOfPossibilities;
            }
        }
    }

}

new Solver(DAY, PART, testFile).solve(); // expecting 288
new Solver(DAY, PART, inputFile).solve(); // good 1083852
