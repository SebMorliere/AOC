import { GenericSolver } from "../utils/generic-solver";
import { CardUtil, Hand, handLogger, HandUtil, SortHand } from "./models";
import { sum } from "../utils/utils";

const DAY = 7,
    PART = 2,
    DATA = 1;
const testFile = `./day_${DAY}/test${DATA}.data`,
    inputFile = `./day_${DAY}/input${DATA}.data`;

class Solver extends GenericSolver {
    private readonly hands: Hand[] = [];

    protected lineProcessor(line: string): void {
        const [rawCards, rawBid] = line.split(" ");
        const cards = rawCards.split("").map(l => CardUtil.processWithJokers(l));
        const newHand: Hand = {
            bid: +rawBid,
            cards: cards,
            rank: HandUtil.processWithJoker(cards)
        };
        this.hands.push(newHand);
    }

    protected resultProcessor(): void {
        this.res = this.hands.sort(SortHand)
            .map((hand, index) => {
                handLogger(hand, index);
                return hand;
            })
            .map((hand, index) => hand.bid * (index + 1))
            .reduce(sum, 0);
    }

}

new Solver(DAY, PART, testFile).solve(); // expecting 5905
new Solver(DAY, PART, inputFile).solve();
// TOO LOW 250545770
// TOO LOW 250452116
//         250577259
