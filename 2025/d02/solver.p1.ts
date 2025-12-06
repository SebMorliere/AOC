import { Puzzle } from '../utils/utils';

const readerInput = new Puzzle(2, 1, 'input1.data');
const readerExample = new Puzzle(2, 1, 'example1.data');

const reader = readerInput.init();

const rangeDescriptors: Range[] = [];

reader.subscribe({
    next: line => {
        line.split(',').forEach(t => {
            const [min, max] = t.split('-').map(t => +t);
            rangeDescriptors.push(new Range(min, max));
        });
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
    let res = 0;
    rangeDescriptors.forEach(rd => {
        res += iterateRange(rd)
    })
    console.log('solution', res);
}

function iterateRange(rd: Range): number {
    let res = 0;
    while(rd.hasNext()) {
        const next = rd.next();
        if (next && isInvalid(next)) {
            res += next;
        }
    }
    return res;
}

function isInvalid(id: number): boolean {
    const idStr: string = id.toString(10);
    const shouldCheck = idStr.length % 2 === 0;
    const firstHalf: string = idStr.substring(0, id.toString(10).length / 2);
    const secondHalf: string = idStr.substring(id.toString(10).length / 2, id.toString(10).length);
    return shouldCheck && (firstHalf === secondHalf);
}

class Range {
    min: number;
    max: number;
    private cursor:number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
        this.cursor = min;
    }

    hasNext(): boolean {
        return this.cursor <= this.max;
    }

    next(): number | undefined {
        return this.hasNext() ? this.cursor++ : undefined;
    }

}