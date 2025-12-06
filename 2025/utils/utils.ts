import fs from 'fs';
import readline from 'readline';
import { Observable, Subscriber } from 'rxjs';

export function initPuzzle(day: number, part: number, inputFile: string): Observable<string> {
    console.log(`start solving Day ${day} - Part ${part} with input file ${inputFile}`);
    return fileReader(inputFile);
}


export function fileReader(fileName: string): Observable<string> {
    const stream: fs.ReadStream = fs.createReadStream(fileName, { encoding: 'utf-8', autoClose: true });
    const lineReaderEmitter: readline.Interface = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    return new Observable((observer: Subscriber<string>) => {
        lineReaderEmitter.on('line', line => observer.next(line));
        lineReaderEmitter.on('close', () => observer.complete());
        lineReaderEmitter.on('error', err => observer.error(err));
    });
}

export function sum(previousValue: number, currentValue: number): number {
    return previousValue + currentValue;
}

export class IterLogger {
    value: number;

    private start: number = 0;
    private hasStarted: boolean  = false;
    private nextTick: number = 0;

    private readonly tick: number = 0;
    private readonly range: number = 0;

    constructor(private maxValue: number, private initialValue: number = 0, private increment = 1) {
        this.value = this.initialValue;
        this.tick = Math.max(increment, (this.maxValue - this.initialValue) / 100);
        this.nextTick = this.value + this.tick;
        this.range = this.maxValue - this.initialValue;
        console.log(`* IterLog initiated:\n* from ${this.initialValue} to ${this.maxValue} (range ${this.range} - step ${this.increment})`);
    }

    next() {
        if (!this.hasStarted) {
            this.start = new Date().getTime();
            this.hasStarted = true;
        } else if (this.value === this.nextTick) {
            const elapsedTime = new Date().getTime() - this.start;
            const donePercent = (this.value - this.initialValue) / this.range;
            const averageTimePerTick = elapsedTime / donePercent;
            const remaining = Math.round((this.maxValue - this.value) / this.range * averageTimePerTick);
            console.log(
                // `doing ${this.value} whithin [${this.initialValue} - ${this.maxValue}] `,
                `${Math.round(donePercent*100)}%`,
                `- elasped: ${elapsedTime} ms`,
                `- remaining: ${remaining} ms`, );
            this.nextTick += this.tick;
        }
        if (this.value > this.maxValue) {
            throw new Error('out of range');
        }
        return this.value += this.increment;
    }
}