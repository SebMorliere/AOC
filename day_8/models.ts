
export class Instruction {
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

export interface NetworkNode {
    ref: string;
    left: string;
    right: string;
}