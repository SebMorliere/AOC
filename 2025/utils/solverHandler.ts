import { Observable, Subscriber } from 'rxjs';
import fs from 'fs';
import readline from 'readline';

export class SolverHandler {
    start: number;

    constructor(private day: number,
                private part: number,
                private inputFile: string,
                private lineProcessor: (data: string, index: number) => void,
                private solverFn: () => string | number) {
        console.log(`Init puzzle solver [Day ${this.day} - Part ${this.part}]`);
        this.start = new Date().getTime();
    }

    solve() {
        console.log(`Start solving`);
        let index = 0;
        const fileName = this.inputFile.startsWith('./d')
            ? this.inputFile
            : `./d${this.day.toString().padStart(2, '0')}/${this.inputFile}`;
        this.fileReader(fileName).subscribe({
            next: data => this.lineProcessor(data, index++),
            error: err => {
                console.error(`ERROR while reading input file ${this.inputFile}:`, err);
            },
            complete: () => {
                const res = this.solverFn();
                const elapsed = new Date().getTime() - this.start;
                console.log(`Puzzle response (${elapsed}ms) >>>`, res);
            },
        });
    }

    private fileReader(fileName: string): Observable<string> {
        console.log(`Using input file: ${this.inputFile}`);
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
}