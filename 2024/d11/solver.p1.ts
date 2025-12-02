import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(11, 1, 'input1.data', lineProcessor, solver);

const input: string[] = [];

function lineProcessor(data: string): void {
    input.push(...data.split(' '));
}

function solver(): number {
    const blinkingLimit = 25;
    let blinkCount = 0;
    let output = input.slice();
    while (blinkCount < blinkingLimit) {
        output = output.flatMap(applyRule);
        blinkCount++;
    }
    return output.length;
}

function applyRule(rockNumber: string): string[] {
    const res: string[] = [];
    if (rockNumber === '0') {
        res.push('1');
    } else if (rockNumber.length % 2 ===0) {
        const left: string = rockNumber.slice(0, rockNumber.length / 2);
        const right: string = +rockNumber.slice(rockNumber.length / 2, rockNumber.length) + '';
        res.push(left);
        res.push(right);
    } else {
        res.push(+rockNumber * 2024 + '');
    }

    return res;
}

solverHandler.solve();
