import * as fs from "fs";
import { initPuzzle, sum } from "../shared/utils";
import { Game } from "./game";

const DAY = 2;
const PART = 2;
initPuzzle(DAY, PART);

const testFile1 = "./day_2/test1.data";
const inputFile1 = "./day_2/input1.data";

function solver(fileName: string) {
    const readStream: fs.ReadStream = fs.createReadStream(fileName, {encoding: "utf-8", autoClose: true});
    const games: Game = new Game(12, 13, 14);

    readStream.on("data", (chunk: string) => {
        chunk.split("\n")
            .map(line => line.trim())
            .filter(line => line !== "")
            .forEach(line => {
                games.pushFromInput(line);
            });
    });

    readStream.on("error", (err: Error) => {
        throw err;
    });

    readStream.on("end", () => {
        const res = games.gameSet
            .map(game => game.power)
            .reduce(sum, 0);
        console.log(`Day ${DAY} puzzle ${PART}> answer (with ${fileName}): `, res);
    });
}

solver(testFile1);
solver(inputFile1);
