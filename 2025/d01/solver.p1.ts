import { Puzzle } from '../utils/utils';

const readerInput = new Puzzle(1, 1, 'input1.data');
const readerExample = new Puzzle(1, 1, 'example1.data');

const reader = readerInput.init();

let res = 0;
let actualPosition = 50;

reader.subscribe({
    next: line => {
        const direction = line[0];
        const value = parseInt(line.substring(1));
        actualPosition += direction === 'R' ? value : -value;
        actualPosition = actualPosition % 100;
        if (actualPosition === 0) {
            res++;
        }
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
    console.log('solution', res);
}
