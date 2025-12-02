import { SolverHandler } from '../utils/solverHandler';

const solverHandler = new SolverHandler(4, 1, './d04/input1.data', lineProcessor, solver);

const fullData: string[][] = [];

function lineProcessor(data: string) {
    fullData.push(data.split(''));
}

function solver() {
    let res = 0;
    const dataHeight = fullData.length;
    const dataWidth = fullData[0].length;

    // for each row
    for (const row of fullData) {
        res += countXmas(row.join(''));
        res += countXmas(row.slice().reverse().join(''));
    }

    // for each column
    for (let i = 0; i < dataHeight; i++) {
        const col = fullData.map(row => row[i]);
        res += countXmas(col.join(''));
        res += countXmas(col.reverse().join(''));
    }

    // diag on first row : from top to bottom right
    for (let col = 0; col < dataWidth; col++) {
        const diag = [fullData[0][col]];
        let nextCol = col;
        let nextRow = 0;

        while (++nextCol < dataWidth && ++nextRow < dataHeight) {
            diag.push(fullData[nextRow][nextCol]);
        }
        res += countXmas(diag.join(''));
        res += countXmas(diag.reverse().join(''));
    }

    // diag on first row : from top to bottom left
    for (let col = dataWidth - 1; col > 0; col--) {
        const diag = [fullData[0][col]];
        let nextCol = col;
        let nextRow = 0;

        while (--nextCol >= 0 && ++nextRow < dataHeight) {
            diag.push(fullData[nextRow][nextCol]);
        }
        res += countXmas(diag.join(''));
        res += countXmas(diag.reverse().join(''));
    }


    // diag on last row : from bottom to top right
    for (let col = 1; col < dataWidth - 1; col++) {
        const diag = [fullData[dataHeight - 1][col]];
        let nextCol = col;
        let nextRow = dataHeight - 1;

        while (++nextCol < dataWidth && --nextRow >= 0) {
            diag.push(fullData[nextRow][nextCol]);
        }
        res += countXmas(diag.join(''));
        res += countXmas(diag.reverse().join(''));
    }

    // diag on last row : from bottom to top left
    for (let col = dataWidth - 2; col > 0; col--) {
        const diag = [fullData[dataHeight - 1][col]];
        let nextCol = col;
        let nextRow = dataHeight - 1;

        while (--nextCol >= 0 && --nextRow >= 0) {
            diag.push(fullData[nextRow][nextCol]);
        }
        res += countXmas(diag.join(''));
        res += countXmas(diag.reverse().join(''));
    }

    return res;
}

function countXmas(letters: string) {
    const regex = /XMAS/g;
    let counter = 0;
    let instruction = regex.exec(letters);
    while (instruction) {
        counter++;
        instruction = regex.exec(letters);
    }
    return counter;
}

solverHandler.solve();
