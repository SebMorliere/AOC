import { Logger, Puzzle } from '../utils/utils';

const logger = new Logger('debug');

const readerInput = new Puzzle(2, 2, 'input1.data');
const readerExample = new Puzzle(2, 2, 'example1.data');
const reader = readerInput.init();

const rangeDescriptors: Range[] = [];

reader.subscribe({
    next: line => {
        line.split(',').forEach(t => {
            const [min, max] = t.split('-').map(t => +t);
            rangeDescriptors.push(new Range(min, max));
        });
    },
    complete: () => {
        let res = 0;
        rangeDescriptors.forEach(rd => {
            res += iterateRange(rd);
        });
        logger.info('solution', res);
    },
});

function iterateRange(rd: Range): number {
    let res = 0;
    while (rd.hasNext()) {
        const next = rd.next();
        if (next && isInvalid(next)) {
            res += next;
        }
    }
    return res;
}

function isInvalid(id: number): boolean {
    const idStr: string = id.toString(10);
    for (let i = 1; i <= idStr.length / 2; i++) {
        if (idStr.length % i > 0) {
            continue;
        }
        const toTest = idStr.substring(0, i);
        const partialRes = idStr.split(toTest).join('').length === 0;
        if (partialRes) {
            logger.debug(`got ${idStr} INVALID with ${toTest}`);
            return true;
        }
    }
    return false;
}

class Range {
    min: number;
    max: number;
    private cursor: number;

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