import { GenericSolver } from "../utils/generic-solver";
import { findLCM } from "./models";

const DAY = 8;
const PUZZLE = 2;
const DATA = 1;
const TEST3 = 3;
const testFile1 = `./day_${DAY}/test${TEST3}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    private directions: string = "";
    private nodeId: string[] = [];
    private idL: string[] = [];
    private idR: string[] = [];

    protected lineProcessor(line: string): void {
        if (this.directions === "") {
            this.directions = line;
        } else {
            const [ref, rawLeftRight] = line.split(" = ");
            const res = rawLeftRight.match(/[\w]{3}/g);
            if (res !== null) {
                const left = res[0];
                const right = res[1];
                this.nodeId.push(ref);
                this.idL.push(left);
                this.idR.push(right);
            }
        }
    }

    protected resultProcessor(): void {
        this.res = 0;
        const currentIds: string[] = this.nodeId.filter(ref => ref.endsWith("A"));
        const counterList: number[] = [];

        currentIds.forEach(id => {
            let count: number = 0;
            let isLoop = false;

            while (!isLoop) {
                const indexOfDir = count++ % this.directions.length;
                const dir = this.directions[indexOfDir];
                const indexOfId = this.nodeId.indexOf(id);
                id =  dir === "L" ? this.idL[indexOfId] : this.idR[indexOfId];

                if (id.endsWith("Z")) {
                    isLoop = true;
                    counterList.push(count);
                }
            }
        });

        this.res = findLCM(counterList);
    }
}

new Solver(DAY, PUZZLE, testFile1).solve(); // expecting 6
new Solver(DAY, PUZZLE, inputFile).solve();
//            1670080 TOO LOW
//           10383048 TOO LOW
//           21787325 TOO LOW
//          359351454 NOT GOOD
//          102292980 NOT GOOD (Execution time: 563.018s) => 181686,873 res/s
//    968 597 258 238
//  4 365 589 076 037
// 11 795 205 644 011 GOOOOOOOOOOOOOOOOOOOOOOOOOO[...]OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD

