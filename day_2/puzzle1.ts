import * as fs from "fs";
import { initPuzzle, sum } from "../shared/utils";
import { Game } from "./game";

initPuzzle(2, 1);
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
        const res = games.gameSet.filter(game => game.isValid)
            .map(game => game.id)
            .reduce(sum, 0);
        console.log(`puzzle 1 answer (${fileName}): `, res);
    });
}

solver(testFile1);
solver(inputFile1);
// 2335 is too high