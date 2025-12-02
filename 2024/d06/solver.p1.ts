import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(6, 1, 'input1.data', lineProcessor, solver);

const matrix: string[] = [];
const matrixTrack: string[] = [];
let initialPosX: number = 0;
let initialPosY: number = 0;

function lineProcessor(data: string, lineIndex: number) {
    const line = data;
    const initialX = data.indexOf('^');
    if (initialX > -1) {
        initialPosX = initialX;
        initialPosY = lineIndex;
        matrixTrack.push(line.replace('^', 'X'));
    } else {
        matrixTrack.push(line);
    }
    matrix.push(line);
}

function solver() {
    let limit = 0;
    try {
        let actualPosX = initialPosX;
        let actualPosY = initialPosY;
        let actualDir = [0, -1];
        while (limit < 10000) {
            [actualPosX, actualPosY, actualDir[0], actualDir[1]] = goToNextPosition(matrix, actualPosX, actualPosY, actualDir);
            limit++;
        }
    } catch (error) {
        console.log('Reached the end');
    }

    return (matrixTrack.join('').match(/X/g) || []).length;
}

function isOOB(matrix: string[], positionX: number, positionY: number): boolean {
    return positionX > matrix[0].length - 1 || positionY > matrix.length - 1 || positionX < 0 || positionY < 0;
}

function goToNextPosition(matrix: string[], actualPosX: number, actualPosY: number, actualDir: number[]): number[] {
    let nextDir: number[] = actualDir;
    let nextPosX: number = actualPosX + nextDir[0];
    let nextPosY: number = actualPosY + nextDir[1];
    if (isOOB(matrix, nextPosX, nextPosY)) {
        throw new Error('OOB');
    }

    while (matrix[nextPosY].charAt(nextPosX) === '#') {
        nextDir = [-nextDir[1], nextDir[0]];
        [nextPosX, nextPosY, nextDir[0], nextDir[1]] = goToNextPosition(matrix, actualPosX, actualPosY, nextDir);
    }
    matrixTrack[nextPosY] = matrixTrack[nextPosY].substring(0, nextPosX) + 'X' + matrixTrack[nextPosY].substring(nextPosX + 1);
    return [nextPosX, nextPosY, ...nextDir];
}

solverHandler.solve();
