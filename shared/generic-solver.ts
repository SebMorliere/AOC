import { Subscription, filter, map } from "rxjs";
import { initPuzzle, reader } from "./utils";

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

    protected lineProcessor(line: string): void {
    }

    protected resultProcessor(): void {
    }

    protected resultDisplayer() {
        console.log(`Day ${this.DAY} puzzle ${this.PART}> answer (with ${this.fileName}): `, this.res);
    }

    private clearSubs() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}