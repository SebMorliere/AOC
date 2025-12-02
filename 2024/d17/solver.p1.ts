import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(17, 1, 'input1.data', lineProcessor, solver);

let a: number = 0,
    b: number = 0,
    c: number = 0;
const instructions: number[] = [];
let out: string = '';

function lineProcessor(data: string): void {
    if (data.startsWith('Register A')) {
        a = +data.split(': ')[1];
    } else if (data.startsWith('Register B')) {
        b = +data.split(': ')[1];
    } else if (data.startsWith('Register C')) {
        c = +data.split(': ')[1];
    } else if (data.startsWith('Program')) {
        instructions.push(...data.split(': ')[1].split(',').map(v => +v));
    }
}

function solver(): number | string {
    let index: number = 0;
    while (index < instructions.length) {
        const opcodeIndex = instructions[index];
        const operand = instructions[index + 1];
        index = opcode[opcodeIndex](operand, index);
    }
    return out;
}

const opcode: ((operand: number, index: number) => number)[] = [
// 0 -> adv -> division :
// floor(A / 2^co) => A
    (operand, index) => {
        a = Math.trunc(a / (2 ** getComboOperand(operand)));
        return index + 2;
    },

// 1 -> bxl ->      XOR :
// B ^ lo => B
    (operand, index) => {
        b = b ^ getLiteralOperand(operand);
        return index + 2;
    },

// 2 -> bst ->   modulo :
// co % 8 => B  (thereby keeping only its lowest 3 bits)
    (operand, index) => {
        b = (getComboOperand(operand) % 8) & 7;
        return index + 2;
    },

// 3 -> jnz ->     jump :
// goto index lo if A !== 0
    (operand, index) => {
        return (a !== 0) ? getLiteralOperand(operand) : index + 2;
    },

// 4 -> bxc ->      XOR :
// B ^ C => B (lo/co ignored)
    (operand, index) => {
        b = b ^ c;
        return index + 2;
    },

// 5 -> out ->   OUTPUT :
// co % 8 => output (joined(','))
    (operand, index) => {
        if (out.length > 0) {
            out += ',' + getComboOperand(operand) % 8;
        } else {
            out += getComboOperand(operand) % 8;
        }
        return index + 2;
    },

// 6 -> bdv -> division :
// floor(A / 2^co) => B (similar to adv)
    (operand, index) => {
        b = Math.floor(a / (2 ** getComboOperand(operand)));
        return index + 2;
    },

// 7 -> cdv -> division :
// floor(A / 2^co) => C (similar to adv)
    (operand, index) => {
        c = Math.floor(a / (2 ** getComboOperand(operand)));
        return index + 2;
    },
];

function getComboOperand(operand: number): number {
// 4 -> A
    if (operand === 4) {
        return a;
// 5 -> B
    } else if (operand === 5) {
        return b;
// 6 -> C
    } else if (operand === 6) {
        return c;
// 7 -> _
    } else if (operand === 7) {
        throw new Error('reserved combo operand');
// 0 -> 0
// 1 -> 1
// 2 -> 2
// 3 -> 3
    } else if (operand < 4 && operand > -1) {
        return operand;
    } else {
        throw new Error('out of range');
    }
}

function getLiteralOperand(operand: number): number {
    return operand;
}

solverHandler.solve();
