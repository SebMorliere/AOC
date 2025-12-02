import { SolverHandler } from '../utils/solverHandler';

let safeReports = 0;

function lineProcessor(data: string) {
    const report = data.split(' ').map(s => +s);
    let direction = 0;
    while(report.length > 1) {
        const current: number = report.shift() || Infinity;
        const next: number = report[0];
        const diff: number = next - current;
        if (direction >= 0 && diff > 0 && diff <= 3) {
            direction = 1;
        } else if (direction <= 0 && diff < 0 && diff >= -3) {
            direction = -1;
        } else {
            direction = 0;
            break;
        }
    }
    if (direction !== 0 ) {
        safeReports++;
    }
}

function solver() {
    return safeReports;
}

const solverHandler = new SolverHandler(2, 1, './d02/input1.data', lineProcessor, solver);

solverHandler.solve();
