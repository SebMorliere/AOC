import fs from 'fs';
import readline from 'readline';
import { Observable, Subscriber } from 'rxjs';

export class Logger {
    level: 'info' | 'debug' = 'info';

    constructor(level?: 'info' | 'debug') {
        this.level = level ?? 'info';
    }

    info(...msg: any[]) {
        console.log('\x1b[36mINFO:\x1b[0m', ...msg);
    }

    error(...msg: any[]) {
        console.error('\x1b[31mERROR:\x1b[0m', ...msg);
    }
    debug(...msg: any[]) {
        if (this.level === 'debug') {
            console.log('\x1b[35mDEBUG:\x1b[0m', ...msg);
        }
    }
}

export class Puzzle {
    private logger = new Logger();

    constructor(private day: number, private part: number, private fileName: string) {
    }

    init(): Observable<string> {
        const filePAth = `./d${(this.day+'').padStart(2, '0')}/${this.fileName}`;
        this.logger.info(`start solving Day ${this.day} - Part ${this.part} with input file ${filePAth}`);
        return this.fileReader(`./d${(this.day+'').padStart(2, '0')}/${this.fileName}`);
    }

    private fileReader(fileName: string): Observable<string> {
        const stream: fs.ReadStream = fs.createReadStream(fileName, { encoding: 'utf-8', autoClose: true });
        const lineReaderEmitter: readline.Interface = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });

        return new Observable((observer: Subscriber<string>) => {
            lineReaderEmitter.on('line', line => observer.next(line));
            lineReaderEmitter.on('close', () => {
                this.logger.info('reading finished');
                observer.complete();
            });
            lineReaderEmitter.on('error', err => {
                this.logger.error('reading error', err);
            });
        });
    }
}

export function sum(previousValue: number, currentValue: number): number {
    return previousValue + currentValue;
}
