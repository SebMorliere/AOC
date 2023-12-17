import { GenericSolver } from "../shared/generic-solver";
import { CardUtil, Hand, HandUtil, rankTinter, SortHand } from "./models";
import { sum } from "../shared/utils";
import { BgColor, FgColor, tintBg, tintFg } from "../shared/colored-logger";

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
            //     this.handLogger(hand, index);
            //     return hand;
            // })
            .map((hand, index) => hand.bid * (index + 1))
            .reduce(sum, 0);
    }

    private handLogger(hand: Hand, index: number) {
        const rank: string = tintFg((index + 1 + "").padStart(4, " "), FgColor.GRAY);
        const bid: string = tintFg(hand.bid.toString().padStart(3, " "), FgColor.GRAY);
        const labels: string = tintFg(hand.cards.map(c => c.label).join(""), FgColor.BLUE);
        const type: string = rankTinter(hand.rank);
        const value: string = tintBg(">>> " + (hand.bid * (index + 1)).toString().padStart(6, " "), BgColor.GRAY);
        const message: string = `${rank} ${tintFg("*", FgColor.GRAY)} ${bid} ${value}  ${labels} ${type}`;
        this.logger.logTinted(message);
    }
}

new Solver(DAY, PART, testFile).solve(); // expecting 6440
new Solver(DAY, PART, inputFile).solve(); // 252295678 GOOD
