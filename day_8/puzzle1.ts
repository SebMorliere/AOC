import { GenericSolver } from "../shared/generic-solver";

const DAY = 8;
const PUZZLE = 1;
const TEST1 = 1;
const TEST2 = 2;
const testFile1 = `./day_${DAY}/test${TEST1}.data`;
const testFile2 = `./day_${DAY}/test${TEST2}.data`;
const inputFile = `./day_${DAY}/input${PUZZLE}.data`;

class Solver extends GenericSolver {
    private instructions: Instruction | null = null;
    private nodes: Node[] = [];

    protected lineProcessor(line: string): void {
        if (this.instructions === null) {
            this.instructions = new Instruction(line);
        } else {
            const [ref, rawLeftRight] = line.split(" = ");
            const res = rawLeftRight.match(/[A-Z]{3}/g);
            if (res !== null) {
                const left = res[0];
                const right = res[1];
                this.nodes.push({ref: ref, left: left, right: right});
            }
        }
    }

    protected resultProcessor(): void {
        this.res = 0;
        if (this.instructions === null) {
            return;
        }
        const startNodeRef = "AAA";
        const endNodeRef = "ZZZ";
        let currentNode = this.nodes.find(node => node.ref === startNodeRef) || this.nodes[0];
        while (currentNode.ref !== endNodeRef) {
            const next = this.instructions.next();
            if (next === "L") {
                currentNode = this.nodes.find(node => node.ref === currentNode.left) || currentNode;
            } else {
                currentNode = this.nodes.find(node => node.ref === currentNode.right) || currentNode;
            }

            this.res = this.res + 1;
        }
    }

}

new Solver(DAY, PUZZLE, testFile1).solve(); // expecting 2
new Solver(DAY, PUZZLE, testFile2).solve(); // expecting 6
new Solver(DAY, PUZZLE, inputFile).solve(); //   16409 GOOD

class Instruction {
    private readonly instructions: ("L" | "R")[] = [];

    constructor(instructions: string) {
        this.instructions.push(...instructions.split("").map(s => s === "R" ? "R" : "L"));
    }

    next(): "L" | "R" {
        const shift = this.instructions.shift();
        if (shift) {
            this.instructions.push(shift);
            return shift;
        } else {
            throw new Error("Invalid instructions data");
        }
    }
}

interface Node {
    ref: string;
    left: string;
    right: string;
}