import { Puzzle } from '../utils/utils';

const readerInput = new Puzzle(1, 2, 'input1.data');
const readerExample1 = new Puzzle(1, 2, 'example1.data');

const reader = readerInput.init();

let res = 0;
let actualPosition = 50;

reader.subscribe({
    next: line => {
        const [direction, rawValue] = [line[0], parseInt(line.substring(1))];
        const value = (direction === 'R' ? rawValue : -rawValue);
        const processedPosition = processNextPosition(actualPosition, value);
        actualPosition = processedPosition.position;
        res += processedPosition.loops;
    },
    error: err => {
        console.log('reading error', err);
    },
    complete: () => {
        console.log('reading finished');
        solverP1();
    },
});

function processNextPosition(actualPosition: number, rotation: number, loops: number = 0): { position: number, loops: number } {
    if (actualPosition === 0) {
        if (rotation > 99) {
            return processNextPosition(actualPosition, rotation - 100, loops + 1);
        } else if (rotation < -99) {
            return processNextPosition(actualPosition, rotation + 100, loops + 1);
        } else if (rotation < 0) {
            return processNextPosition(actualPosition, rotation + 100, loops);
        } else {
            return { position: actualPosition + rotation, loops };
        }
    }

    const nexPosition = (actualPosition + rotation);
    if (nexPosition > 100) {
        return processNextPosition(actualPosition, rotation - 100, loops + 1);
    } else if (nexPosition === 100) {
        return { position: 0, loops: loops + 1 };
    } else if (nexPosition < 0) {
        return processNextPosition(actualPosition, rotation + 100, loops + 1);
    } else if (nexPosition === 0) {
        return { position: nexPosition, loops: loops + 1 };
    } else {
        return { position: nexPosition, loops };
    }
}

function solverP1() {
    console.log('solution', res);
}
