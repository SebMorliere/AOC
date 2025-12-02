import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(6, 2, 'input1.data', lineProcessor, solver);

const initialMatrix: string[] = [];
let initialPosX: number = 0;
let initialPosY: number = 0;

function lineProcessor(data: string, lineIndex: number) {
    const line = data;
    const initialX = data.indexOf('^');
    if (initialX > -1) {
        initialPosX = initialX;
        initialPosY = lineIndex;
    }
    initialMatrix.push(line);
}

function solver() {
    let res = 0;
    const pathRecord: Set<string> = generatePathRecord(initialMatrix);
    const testedPAth: Set<string> = new Set();
    let isFirst = true;
    pathRecord.forEach(pathEntry => {
        if (isFirst) {
            isFirst = false;
        } else {
            const [posX, posY] = pathEntry.split(',').map(v => +v);
            if (!testedPAth.has([posX, posY].join(','))) {
                testedPAth.add([posX, posY].join(','));
                const modifiedMatrix = initialMatrix.slice();
                modifiedMatrix[posY] = initialMatrix[posY].substring(0, posX) + 'O' + initialMatrix[posY].substring(posX + 1);
                const pathRecord: Set<string> = generatePathRecord(modifiedMatrix);
                if (pathRecord.size === 0) {
                    res++;
                }
            }
        }

    });

    return res;
}

function generatePathRecord(matrix: string[]): Set<string> {
    const pathEntries: Set<string> = new Set<string>();
    let limit = 0;
    try {
        let actualPosX = initialPosX;
        let actualPosY = initialPosY;
        let actualDir = [0, -1];
        pathEntries.add(buildPathEntry(actualPosX, actualPosY, actualDir));
        while (limit < 10_000) {
            [actualPosX, actualPosY, actualDir[0], actualDir[1]] = goToNextPosition(matrix, actualPosX, actualPosY, actualDir);
            const pathEntry = buildPathEntry(actualPosX, actualPosY, actualDir);
            if (pathEntries.has(pathEntry)) {
                throw new Error('LOOP');
            } else {
                pathEntries.add(pathEntry);
            }
            limit++;
        }
    } catch (error) {
        if (error instanceof Error && error.message === 'LOOP') {
            return new Set();
        }
    }
    return pathEntries;
}

function goToNextPosition(matrix: string[], actualPosX: number, actualPosY: number, actualDir: number[]): number[] {
    let nextDir: number[] = actualDir;
    let nextPosX: number = actualPosX + nextDir[0];
    let nextPosY: number = actualPosY + nextDir[1];
    if (isOOB(matrix, nextPosX, nextPosY)) {
        throw new Error('OOB');
    }

    while (matrix[nextPosY].charAt(nextPosX) === '#' || matrix[nextPosY].charAt(nextPosX) === 'O') {
        nextDir = [-nextDir[1], nextDir[0]];
        [nextPosX, nextPosY, nextDir[0], nextDir[1]] = goToNextPosition(matrix, actualPosX, actualPosY, nextDir);
    }
    return [nextPosX, nextPosY, ...nextDir];
}

function isOOB(matrix: string[], positionX: number, positionY: number): boolean {
    return positionX > matrix[0].length - 1 || positionY > matrix.length - 1 || positionX < 0 || positionY < 0;
}

function buildPathEntry(posX: number, poxY: number, dir: number[]): string {
    return [posX, poxY, ...dir].join(',');
}

solverHandler.solve();
