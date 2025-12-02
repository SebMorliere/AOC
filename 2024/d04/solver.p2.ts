import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(4, 2, './d04/input1.data', lineProcessor, solver);

const fullData: string[][] = [];

function lineProcessor(data: string) {
    fullData.push(data.split(''));
}

function solver() {
    let res = 0;

    for (let row = 0; row < fullData.length - 2; row++) {
        for (let col = 0; col < fullData[0].length - 2; col++) {
            const square = [];
            square.push(fullData[row].slice(col, col + 3));
            square.push(fullData[row + 1].slice(col, col + 3));
            square.push(fullData[row + 2].slice(col, col + 3));

            res += isXmas(square) ? 1 : 0;
            res += isXmas(rotate(square)) ? 1 : 0;
            res += isXmas(rotate(rotate(square))) ? 1 : 0;
            res += isXmas(rotate(rotate(rotate(square)))) ? 1 : 0;
        }
    }
    return res;
}

function isXmas(square3x3: string[][]): boolean {
    const t0 = /M.S/.exec(square3x3[0].join(''));
    const t1 = /.A./.exec(square3x3[1].join(''));
    const t2 = /M.S/.exec(square3x3[2].join(''));

    return !!t0 && !!t1 && !!t2;
}

function rotate(square3x3: string[][]): string[][]{
    return square3x3[0].map((val, index) => square3x3.map(row => row[index]).reverse());
}

solverHandler.solve();
