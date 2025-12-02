import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(3, 1, './d03/input1.data', lineProcessor, solver);

const mulRegex: RegExp = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;
let res = 0;

function lineProcessor(data: string) {
    let instruction;
    do {
        instruction = mulRegex.exec(data);
        if (instruction) {
            const mulResult = +instruction[1] * +instruction[2];
            res += mulResult;
        }
    } while (instruction);
}

function solver() {
    return res;
}

solverHandler.solve();

