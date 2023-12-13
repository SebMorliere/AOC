import { GenericSolver } from "../shared/generic-solver";

const DAY = 4;
const PART = 2;
const DATA = 1;
const testFile = `./day_${DAY}/test${DATA}.data`;
const inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    readonly scratchcards: Scratchcard[] = [];

    protected lineProcessor(line: string): void {
        const [rawCardId, rawNumbers] = line.split(":");
        const [winningNumbers, possessedNumbers] = rawNumbers.split("|")
            .map(rawNums => rawNums.split(" ").map(num => +num.trim()));
        const winningNumbersFound = possessedNumbers
            .filter(pNum => winningNumbers.find(wNum => wNum === pNum))
            .length;
        const scratchcard: Scratchcard = {
            cardId: rawCardId.replace("Card ", ""),
            winningNumbers: winningNumbers,
            possessedNumbers: possessedNumbers,
            won: winningNumbersFound,
            instances: 1
        };
        this.scratchcards.push(scratchcard);
    }

    protected resultProcessor(): void {
        this.scratchcards.forEach((scratchcard, index) => {
            if (scratchcard.won > 0) {
                for (let i = index + 1; i < index + scratchcard.won + 1; i++) {
                    this.scratchcards[i].instances += scratchcard.instances;
                }
            }
        });
        this.res = this.scratchcards
            .map(sc => sc.instances)
            .reduce((previousValue, currentValue) => previousValue + currentValue);
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 30
new Solver(DAY, PART, inputFile).solve(); // accepted 9236992

interface Scratchcard {
    cardId: string;
    winningNumbers: number[];
    possessedNumbers: number[];
    instances: number;
    won: number;
}
