import * as fs from "fs";
import * as readline from "readline";
import { Observable, Subscriber } from "rxjs";

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

