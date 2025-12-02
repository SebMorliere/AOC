import { GenericSolver } from "../utils/generic-solver";
import { CardUtil, Hand, HandUtil, SortHand } from "./models";
import { sum } from "../utils/utils";

const DAY = 7;
const PART = 1;
const testFile = `./day_${DAY}/test${PART}.data`;
const inputFile = `./day_${DAY}/input${PART}.data`;

class Solver extends GenericSolver {
    private readonly hands: Hand[] = [];

    protected lineProcessor(line: string): void {
        const [rawCards, rawBid] = line.split(" ");
        const cards = rawCards.split("").map(l => CardUtil.process(l));
        const newHand: Hand = {
            bid: +rawBid,
            cards: cards,
            rank: HandUtil.process(cards)
        };
        this.hands.push(newHand);
    }

    protected resultProcessor(): void {
        this.res = this.hands.sort(SortHand)
            // .map((hand, index) => {
            //     handLogger(hand, index);
            //     return hand;
            // })
            .map((hand, index) => hand.bid * (index + 1))
            .reduce(sum, 0);
    }

}

new Solver(DAY, PART, testFile).solve(); // expecting 6440
new Solver(DAY, PART, inputFile).solve(); // 252295678 GOOD

