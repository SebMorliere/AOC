import { filter, map, Subscription } from "rxjs";
import { initPuzzle, fileReader } from "./utils";
import { ColoredLogger, FgColor, tint } from "./colored-logger";

export abstract class GenericSolver {
    private readonly subscriptions: Subscription[] = [];
    protected readonly fileName: string;
    protected readonly DAY: number;
    protected readonly PART: number;

    protected res: string | number = "";
    protected logger: ColoredLogger = new ColoredLogger();
    private readonly startTime: number;

    constructor(day: number, part: number, fileName: string) {
        initPuzzle(day, part);
        this.fileName = fileName;
        this.DAY = day;
        this.PART = part;
        this.startTime = Date.now();
    }

    public solve(): void {
        const lines = fileReader(this.fileName);
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
                    this.resultPrinter();
                    this.clearSubs();
                }
            })
        );
    }

    protected lineProcessor(line: string): void {
    }

    protected resultProcessor(): void {
    }

    protected resultPrinter() {
        const endTime: number = Date.now();
        const message = tint(`Execution time: ${(endTime - this.startTime) / 1000}s`, {fgColor: FgColor.GRAY});
        console.log(`Day ${this.DAY} > puzzle ${this.PART} > answer (input file: ${this.fileName}): `, this.res);
        this.logger.logTinted(message);
    }

    private clearSubs() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}