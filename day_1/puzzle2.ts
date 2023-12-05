import * as fs from "fs";
import { initPuzzle } from "../shared/utils";

initPuzzle(1, 2);

// const dataFileName = "./day_1/test2.data";
const dataFileName = "./day_1/input2.data";
console.log("data file name:", dataFileName);
let finalRes: number = 0;

const readStream: fs.ReadStream = fs.createReadStream(dataFileName, {encoding: "utf-8", autoClose: true});

readStream.on("data", (chunk: string) => {
    chunk.split("\n")
        .map(line => line.trim().toLowerCase())
        .filter(line => line.length > 0)
        .forEach(line => {
            const numbers = allNumbersReplacer(line);
            const firstDigit: string = numbers[0];
            const lastDigit: string = numbers[numbers.length - 1];
            const res: string = firstDigit + lastDigit;
            finalRes += + res;
        });
});

readStream.on("error", (err: Error) => {
    throw err;
});

readStream.on("end", () => {
    console.log("puzzle 1 answer: ", finalRes);
    // wrong answer (asked): 54095
});

// one|two|three|four|five|six|seven|eight|nine

function allNumbersReplacer(input: string, position?: number): string[] {
    const numbers: string[] = [];
    for (let i = 0; i < input.length; i++) {
        if(!isNaN(+input.charAt(i))) {
            numbers.push(input.charAt(i));
        } else {
            const subInput = input.substring(i);
            const numberFound = numberFinder(subInput);
            if (numberFound !== "") {
                numbers.push(numberFound);
            }
        }
    }

    return numbers;
}

function numberFinder(input: string): string {
    if (input.startsWith("one")) {
        return "1";
    } else if (input.startsWith("two")) {
        return "2";
    } else if (input.startsWith("three")) {
        return "3";
    } else if (input.startsWith("four")) {
        return "4";
    } else if (input.startsWith("five")) {
        return "5";
    } else if (input.startsWith("six")) {
        return "6";
    } else if (input.startsWith("seven")) {
        return "7";
    } else if (input.startsWith("eight")) {
        return "8";
    } else if (input.startsWith("nine")) {
        return "9";
    } else {
        return "";
    }
}
