import * as fs from "fs";
import { initPuzzle } from "../shared/utils";

initPuzzle(1, 1);

// const dataFileName = "./day_01/test1.data";
const dataFileName = "./day_01/input1.data";
console.log("data file name:", dataFileName);
let finalRes: number = 0;

const readStream: fs.ReadStream = fs.createReadStream(dataFileName, {encoding: "utf-8", autoClose: true});

readStream.on("data", (chunk: string) => {
    chunk.split("\n").forEach(line => {
        const regex: RegExp = /\d/;
        const firstDigit: number = line.search(regex);
        const lastDigit: number = line.length - line.split("").reverse().join("").search(regex) - 1;
        const res: string = line.charAt(firstDigit) + line.charAt(lastDigit);
        finalRes += + res;
    });
});

readStream.on("error", (err: Error) => {
    throw err;
});

readStream.on("end", () => {
    console.log("puzzle 1 answer: ", finalRes);
});
