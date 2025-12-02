import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(13, 2, 'input1.data', lineProcessor, solver);

type Point = [x: bigint, y: bigint];
type ClawMachineConfig = { a: Point, b: Point, p: Point };

const clawMachineList: ClawMachineConfig[] = [];

let buffer: bigint[] = [];

function lineProcessor(data: string): void {
    const getNext: () => bigint = () => buffer.shift() || BigInt(-1);
    if (data.length !== 0) {
        const xRegex = /(?<=X[+=])\d+/;
        const yRegex = /(?<=Y[+=])\d+/;
        const x: bigint = BigInt(+(xRegex.exec(data) || [0])[0]);
        const y: bigint = BigInt(+(yRegex.exec(data) || [0])[0]);
        if (data.startsWith('Prize')) {
            buffer.push(x + 10000000000000n, y + 10000000000000n);
            clawMachineList.push({ a: [getNext(), getNext()], b: [getNext(), getNext()], p: [getNext(), getNext()] });
            buffer = [];
        } else {
            buffer.push(x, y);
        }
    }
}

function solver(): number | string {
    buffer = [];
    let prizeCount = 0;
    let tokenCount = 0n;
    const X = 0, Y = 1;
    let i = 0;
    clawMachineList.forEach(clawMachine => {
        const na = (clawMachine.b[X] * clawMachine.p[Y] - clawMachine.b[Y] * clawMachine.p[X])
            / (clawMachine.a[Y] * clawMachine.b[X] - clawMachine.a[X] * clawMachine.b[Y]);
        const nb = (clawMachine.p[X] - clawMachine.a[X] * na) / clawMachine.b[X];
        const isPositive = na > -1 && nb > -1;
        const isGoodX = na * clawMachine.a[X] + nb * clawMachine.b[X] === clawMachine.p[X];
        const isGoodY = na * clawMachine.a[Y] + nb * clawMachine.b[Y] === clawMachine.p[Y];
        if (isPositive && isGoodX && isGoodY) {
            tokenCount += na * 3n + nb;
            prizeCount++;
        }
    });
    return `prizes: ${prizeCount} - tokens: ${tokenCount}`;
}

solverHandler.solve();
