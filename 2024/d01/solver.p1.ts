import { initPuzzle, sum } from '../utils/utils';

const reader = initPuzzle(1, 1, './d01/input1.data');
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
        solverP1();
    },
});

function solverP1() {
    console.log('start solving');
    leftValues.sort((a, b) => a - b);
    rightValues.sort((a, b) => a - b);
    const diff = leftValues
        .map((value, index) => Math.abs(value - rightValues[index]));
    const res = diff.reduce(sum, 0);
    console.log('solution', res);
}
