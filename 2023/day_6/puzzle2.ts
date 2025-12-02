import { GenericSolver } from "../utils/generic-solver";

const DAY = 6,
    PART = 2,
    DATA = 1;
const testFile = `./day_${DAY}/test${DATA}.data`,
    inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    timeArr: number[] = [];
    distanceArr: number[] = [];

    protected lineProcessor(line: string): void {
        const TIME: string = "Time:";
        const DISTANCE: string = "Distance:";

        if (line.startsWith(TIME)) {
            this.timeArr.push(+line.replace(TIME, "")
                .replaceAll(" ", ""));

        } else if (line.startsWith(DISTANCE)) {
            this.distanceArr.push(+line.replace(DISTANCE, "")
                .replaceAll(" ", ""));
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

new Solver(DAY, PART, testFile).solve(); // expecting 71503
new Solver(DAY, PART, inputFile).solve(); // good 23501589
