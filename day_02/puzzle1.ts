import * as fs from "fs";
import { initPuzzle } from "../shared/utils";

initPuzzle(2, 1);
const testFile1 = "./day_02/test1.data";
const inputFile1 = "./day_02/input1.data";

interface GameResult {
    red: number;
    green: number;
    blue: number;
}

interface GameSet {
    id: number;
    results: GameResult[];
    isValid: boolean;
}

class Game {
    limits: GameResult;
    gameSet: GameSet[];

    constructor(redLimit: number, greenLimit: number, blueLimit: number) {
        this.limits = {red: redLimit, green: greenLimit, blue: blueLimit};
        this.gameSet = [];
    }

    pushFromInput(input: string) {
        const gameData = input.split(":");
        const id = +gameData[0].replace("Game ", "");
        const plays: GameResult[] = gameData[1].split(";")
            .map(grStr => {
                const gr: GameResult = { red: 0, green: 0, blue: 0 };
                grStr.split(",")
                    .map(c => c.trim())
                    .forEach(colorStr => {
                        if (colorStr.endsWith("red")) {
                            gr.red = +colorStr.replace("red", "").trim();
                        } else if (colorStr.endsWith("green")) {
                            gr.green = +colorStr.replace("green", "").trim();
                        } else if (colorStr.endsWith("blue")) {
                            gr.blue = +colorStr.replace("blue", "").trim();
                        }
                    });
                return gr;
            });
        const isValid: boolean = plays.every((gr) => (gr.red <= this.limits.red && gr.green <= this.limits.green && gr.blue <= this.limits.blue));

        this.gameSet.push({
            id: id,
            results: plays,
            isValid: isValid
        });
    }
}

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
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
        console.log(`puzzle 1 answer (${fileName}): `, res);
    });
}

solver(testFile1);
solver(inputFile1);
// 2335 is too high