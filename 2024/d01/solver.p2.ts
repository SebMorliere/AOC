import { initPuzzle, sum } from '../utils/utils';

const reader = initPuzzle(1, 2, './d01/input1.data');
const leftValues: number[] = [];
const rightValues: number[] = [];

reader.subscribe({
    next: data => {
        const newValues = data.split('   ').map(s => +s);
        leftValues.push(newValues[0]);
        rightValues.push(newValues[1]);
    },
    error: err => {
        console.log('reading error', err);
    },
    complete: () => {
        console.log('reading finished');
        solverP2();
    },
});

function solverP2() {
    console.log('start solving');
    leftValues.sort((a, b) => a - b);
    rightValues.sort((a, b) => a - b);
    const res = leftValues
        .map(leftValue => {
            const iteration = rightValues.reduce((sum, nextRightValue) => nextRightValue === leftValue ? (sum + 1) : sum, 0);
            return leftValue * iteration;
        })
        .reduce(sum, 0);
    console.log('solution', res);
}
