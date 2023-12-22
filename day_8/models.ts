
export class Instruction {
    private readonly instructions: ("L" | "R")[] = [];
    count: number = 0;

    constructor(instructions: string) {
        this.instructions.push(...instructions.split("").map(s => s === "R" ? "R" : "L"));
    }

    next(): "L" | "R" {
        const index = this.count++ % this.instructions.length;
        return this.instructions[index];
    }
}

export interface NetworkNode {
    ref: string;
    left: string;
    right: string;
}

export function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

export function findLCM(numbers: number[]): number {
    let result = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }

    return result;
}