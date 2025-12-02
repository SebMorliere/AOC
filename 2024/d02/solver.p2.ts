import { SolverHandler } from '../utils/solverHandler';


const solverHandler = new SolverHandler(2, 2, './d02/input1.data', lineProcessor, solver);

let safeReportsCount = 0;
solverHandler.solve();

function lineProcessor(data: string): void {
    let reports = data.split(' ').map(s => +s);
    let diffs = measureDiff(reports);
    let isSafe = validateDiff(diffs);

    if (!isSafe) {
        for (let i = 0; i < reports.length; i++) {
            const deletedReport = reports.splice(i, 1)[0];
            diffs = measureDiff(reports);
            isSafe = validateDiff(diffs);
            if (isSafe) {
                break;
            } else {
                reports = [
                    ...reports.slice(0, i),
                    deletedReport,
                    ...reports.slice(i)
                ];
            }
        }
    }

    if (isSafe) {
        safeReportsCount++;
    }
}

function measureDiff(reports: number[]): number[] {
    const res: number[] = [];
    for (let i = 0; i < reports.length - 1; i++) {
        res.push(reports[i + 1] - reports[i]);
    }
    return res;
}

function validateDiff(diffs: number[]): boolean {
    let res: boolean = true;
    for (let i = 0; i < diffs.length - 1; i++) {
        const sameDir = diffs[i + 1] * diffs[i] > 0;
        const isInRange = Math.abs(diffs[i]) < 4 && Math.abs(diffs[i + 1]) < 4;
        res = res && sameDir && isInRange;
    }
    return res;
}

function solver(): number {
    return safeReportsCount;
}

