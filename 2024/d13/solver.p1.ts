import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(13, 1, 'input1.data', lineProcessor, solver);

type Point = [x: number, y: number];
type ClawMachineConfig = { a: Point, b: Point, p: Point };

const clawMachineList: ClawMachineConfig[] = [];

let buffer: number[] = [];

function lineProcessor(data: string): void {
    const getNext: () => number = () => buffer.shift() || -1;
    if (data.length !== 0) {
        const xRegex = /(?<=X[+=])\d+/;
        const yRegex = /(?<=Y[+=])\d+/;
        const x = +(xRegex.exec(data) || [0])[0];
        const y = +(yRegex.exec(data) || [0])[0];
        buffer.push(x, y);
        if (data.startsWith('Prize')) {
            clawMachineList.push({ a: [getNext(), getNext()], b: [getNext(), getNext()], p: [getNext(), getNext()] });
            buffer = [];
        }
    }
}

function solver(): number | string {
    buffer = [];
    let prizeCount = 0;
    let tokenCount = 0;
    const X = 0, Y = 1;
    clawMachineList.forEach(clawMachine => {
        const na = Math.max(0, Math.round(
            (clawMachine.b[X] * clawMachine.p[Y] - clawMachine.b[Y] * clawMachine.p[X])
            / (clawMachine.a[Y] * clawMachine.b[X] - clawMachine.a[X] * clawMachine.b[Y])
        ));
        const nb = Math.max(0, Math.round(
            (clawMachine.p[X] - clawMachine.a[X] * na) / clawMachine.b[X]
        ));
        const isGoodX = na * clawMachine.a[X] + nb * clawMachine.b[X] === clawMachine.p[X];
        const isGoodY = na * clawMachine.a[Y] + nb * clawMachine.b[Y] === clawMachine.p[Y];
        if (isGoodX && isGoodY) {
            tokenCount += na*3 + nb;
            prizeCount++;
        }
    });
    return `prizes: ${prizeCount} - tokens: ${tokenCount}`;
}

solverHandler.solve();
