import { SolverHandler } from '../utils/solverHandler';
import { sum } from '../utils/utils';

const solverHandler = new SolverHandler(11, 1, 'input1.data', lineProcessor, solver);

const input: string[] = [];
const indexedRes: Map<string, number> = new Map();

function lineProcessor(data: string): void {
    input.push(...data.split(' '));
}

function solver(): number {
    return input.slice().map(nextInput => applyRule(nextInput, 75)).reduce(sum);
}

function applyRule(rockNumber: string, blink: number): number {
    const calculationKey = `${rockNumber},${blink}`;
    if (indexedRes.has(calculationKey)) {
        return indexedRes.get(calculationKey) || 0;
    }
    let res;
    if (blink === 0) {
        res = 1;
    } else if (rockNumber === '0') {
        res = applyRule('1', blink - 1);
    } else if (rockNumber.length % 2 ===0) {
        const left: number = applyRule(rockNumber.slice(0, rockNumber.length / 2), blink - 1);
        const right: number = applyRule(+rockNumber.slice(rockNumber.length / 2, rockNumber.length) + '', blink - 1);
        res = left + right;
    } else {
        res = applyRule(+rockNumber * 2024 + '', blink - 1);
    }
    indexedRes.set(calculationKey, res);
    return res;
}

solverHandler.solve();
