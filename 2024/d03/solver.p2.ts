import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(3, 2, './d03/input1.data', lineProcessor, solver);

const mulRegex: RegExp = /(mul\(([0-9]{1,3}),([0-9]{1,3})\))|(do\(\)|(don't\(\)))/g;
let res = 0;
let enabled = true;

function lineProcessor(data: string) {
    let instruction;
    do {
        instruction = mulRegex.exec(data);
        if (instruction) {
            if (enabled && instruction[0].startsWith('mul')) {
                const mulResult = +instruction[2] * +instruction[3];
                res += mulResult;
            } else if (instruction[0] === 'don\'t()') {
                enabled = false;
            } else if (instruction[0] === 'do()') {
                enabled = true;
            }
        }
    } while (instruction);
}

function solver() {
    return res;
}

solverHandler.solve();

