import * as fs from "fs";
import * as readline from "readline";
import { Observable, Subscriber, Subscription, filter, map } from "rxjs";

export function initPuzzle(day: number, part: number) {
    console.log(`start puzzle ${part} - day ${day}`);
}


export function reader(fileName: string): Observable<string> {
    const stream: fs.ReadStream = fs.createReadStream(fileName, { encoding: "utf-8", autoClose: true });
    const lineReaderEmitter: readline.Interface = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    return new Observable((observer: Subscriber<string>) => {
        lineReaderEmitter.on("line", line => observer.next(line));
        lineReaderEmitter.on("close", () => observer.complete());
        lineReaderEmitter.on("error", err => observer.error(err));
    });
}

export class GenericSolver {
    private readonly subscriptions: Subscription[] = [];
    protected readonly fileName: string;
    protected readonly DAY;
    protected readonly PART;
    protected res: string | number = "";

    constructor(day: number, part: number, fileName: string) {
        initPuzzle(day, part);
        this.fileName = fileName;
        this.DAY = day;
        this.PART = part;
    }

    public solve(): void {
        const lines = reader(this.fileName);
        this.subscriptions.push(
            lines.pipe(
                map(line => line.trim()),
                filter(line => line !== "")
            ).subscribe({
                next: (line) => this.lineProcessor(line),
                error: (err) => {
                    throw err;
                },
                complete: () => {
                    this.resultProcessor();
                    this.resultDisplayer();
                    this.clearSubs();
                }
            })
        );
    }

    protected lineProcessor(line: string): void {}
    protected resultProcessor(): void {}

    protected resultDisplayer() {
        console.log(`Day ${this.DAY} puzzle ${this.PART}> answer (with ${this.fileName}): `, this.res);
    }

    private clearSubs() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}