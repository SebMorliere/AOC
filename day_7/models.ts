import { BgColor, ColoredLogger, FgColor, tintBg, tintFg } from "../shared/colored-logger";

export type CardLabel = "A" | "K" | "Q" | "J" | "T" |
    "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

export interface Card {
    order: number;
    label: CardLabel;
}

export type HandType = "Five of a kind" | // AAAAA 1l X 5
    "Four of a kind" |                    // KKKKI 2l X 4      +1
    "Full house" |                        // 999QQ 2l X 3+2
    "Three of a kind" |                   // TTT64 3l X 3    +1+1
    "Two pair" |                          // 7733J 3l X 2+2    +1
    "One pair" |                          // 22AKQ 4l X 2  +1+1+1
    "High card";                          // AKQJT 5l X 1+1+1+1+1

export interface Rank {
    type: HandType;
    rank: number;
}

export interface Hand {
    cards: Card[];
    rank: Rank;
    bid: number;
}

export const ALL_CARDS: Map<string, Card> = new Map([
    ["2", {order: 2, label: "2"}],
    ["3", {order: 3, label: "3"}],
    ["4", {order: 4, label: "4"}],
    ["5", {order: 5, label: "5"}],
    ["6", {order: 6, label: "6"}],
    ["7", {order: 7, label: "7"}],
    ["8", {order: 8, label: "8"}],
    ["9", {order: 9, label: "9"}],
    ["T", {order: 10, label: "T"}],
    ["J", {order: 11, label: "J"}],
    ["Q", {order: 12, label: "Q"}],
    ["K", {order: 13, label: "K"}],
    ["A", {order: 14, label: "A"}]
]);

export const ALL_CARDS_WITH_JOKERS: Map<string, Card> = new Map([
    ["J", {order: 1, label: "J"}],
    ["2", {order: 2, label: "2"}],
    ["3", {order: 3, label: "3"}],
    ["4", {order: 4, label: "4"}],
    ["5", {order: 5, label: "5"}],
    ["6", {order: 6, label: "6"}],
    ["7", {order: 7, label: "7"}],
    ["8", {order: 8, label: "8"}],
    ["9", {order: 9, label: "9"}],
    ["T", {order: 10, label: "T"}],
    ["Q", {order: 12, label: "Q"}],
    ["K", {order: 13, label: "K"}],
    ["A", {order: 14, label: "A"}]
]);

export class CardUtil {
    public static process(label: string): Card {
        const card: Card | undefined = ALL_CARDS.get(label);
        if (card !== undefined) {
            return card;
        } else {
            throw Error("invalid card label");
        }
    }

    public static processWithJokers(label: string): Card {
        const card: Card | undefined = ALL_CARDS_WITH_JOKERS.get(label);
        if (card !== undefined) {
            return card;
        } else {
            throw Error("invalid card label");
        }
    }
}

export class HandUtil {
    private static readonly ALL_RANKS_MAP: Map<HandType, Rank> = new Map([
        ["Five of a kind", {type: "Five of a kind", rank: 9}],
        ["Four of a kind", {type: "Four of a kind", rank: 8}],
        ["Full house", {type: "Full house", rank: 7}],
        ["Three of a kind", {type: "Three of a kind", rank: 6}],
        ["Two pair", {type: "Two pair", rank: 5}],
        ["One pair", {type: "One pair", rank: 4}],
        ["High card", {type: "High card", rank: 3}]
    ]);

    public static process(cards: Card[]): Rank {
        const uniqueLabels: Set<CardLabel> = new Set(cards.map(c => c.label));
        if (uniqueLabels.size === 1) {
            return this.getRankOrFuckOff("Five of a kind");

        } else if (uniqueLabels.size === 4) {
            return this.getRankOrFuckOff("One pair");

        } else if (uniqueLabels.size === 5) {
            return this.getRankOrFuckOff("High card");

        } else if (uniqueLabels.size === 2) {
            const anyLabel = cards[0].label;
            const LabelOccurrences = cards.filter(card => card.label === anyLabel).length;
            return LabelOccurrences === 4 || LabelOccurrences === 1
                ? this.getRankOrFuckOff("Four of a kind")
                : this.getRankOrFuckOff("Full house");

        } else if (uniqueLabels.size === 3) {
            const anyLabel1 = cards[0].label;
            const anyLabel2 = cards[1].label;
            const labelOccurrences1 = cards.filter(card => card.label === anyLabel1).length;
            const labelOccurrences2 = cards.filter(card => card.label === anyLabel2).length;
            const hasTwoSingleCards = (labelOccurrences1 === 1 && labelOccurrences2 === 1);
            const hasThreeOfAKind = labelOccurrences1 === 3 || labelOccurrences2 === 3;
            return hasTwoSingleCards || hasThreeOfAKind
                ? this.getRankOrFuckOff("Three of a kind")
                : this.getRankOrFuckOff("Two pair");

        } else {
            throw new Error("invalid card list - should be a list of 5 cards");
        }
    }


// AAAAA 1l X 5
// KKKKI 2l X 41
// 999QQ 2l X 32
// TTT64 3l X 311
// 7733J 3l X 221
// 22AKQ 4l X 2111
// AKQJT 5l X 11111

    public static processWithJoker(cards: Card[], jokerLabelTested?: Card[]): Rank {
        const uniqueLabels: Set<CardLabel> = new Set(cards.map(c => c.label));
        const filteredOccurrenceArr: number[] = [];
        uniqueLabels.forEach(cardLabel => {
            if (cardLabel !== "J") {
                filteredOccurrenceArr.push(cards.filter(card => card.label === cardLabel).length);
            }
        });
        let jOccurrence: number = cards.filter(card => card.label === "J").length;
        filteredOccurrenceArr.sort((a, b) => b - a);
        if (jOccurrence === 0) {
            return this.process(cards);
        } else {
            while (jOccurrence > 0) {
                const indexToIncrement: number = filteredOccurrenceArr.findIndex(nbOccurrence => nbOccurrence < 5);
                filteredOccurrenceArr[indexToIncrement] = ++filteredOccurrenceArr[indexToIncrement];
                jOccurrence--;
            }
            const occurrencePattern = filteredOccurrenceArr.join("");
            switch (occurrencePattern) {
                case "5": {
                    return this.getRankOrFuckOff("Five of a kind");
                }
                case "41": {
                    return  this.getRankOrFuckOff("Four of a kind");
                }
                case "32": {
                    return  this.getRankOrFuckOff("Full house");
                }
                case "311": {
                    return  this.getRankOrFuckOff("Three of a kind");
                }
                case "221": {
                    return  this.getRankOrFuckOff("Two pair");
                }
                case "2111": {
                    return this.getRankOrFuckOff("One pair");
                }
                default: {
                    return this.getRankOrFuckOff("High card");
                }
            }

        }
    }

    private static getRankOrFuckOff(handType: HandType): Rank {
        const rank: Rank | undefined = this.ALL_RANKS_MAP.get(handType);
        if (rank === undefined) {
            throw new Error("invalid rank");
        } else {
            return rank;
        }
    }
}

export function SortHand(left: Hand, right: Hand): number {
    const sortByRank: number = left.rank.rank - right.rank.rank;
    if (sortByRank !== 0) {
        return sortByRank;
    } else {
        for (let i = 0; i < 5; i++) {
            const sortByOrder: number = left.cards[i].order - right.cards[i].order;
            if (sortByOrder !== 0) {
                return sortByOrder;
            }
        }
        return 0;
    }
}

export function SortCard(left: Card, right: Card): number {
    const sortByOrder: number = left.order - right.order;
    if (sortByOrder !== 0) {
        return sortByOrder;
    } else {
        return 0;
    }
}


export function rankTinter(rank: Rank): string {
    const output = rank.type.padStart(15, " ");
    switch (rank.type) {
        case "Five of a kind": {
            return tintFg(output, FgColor.BRIGHT_GREEN);
        }
        case "Four of a kind": {
            return tintFg(output, FgColor.RED);
        }
        case "Full house": {
            return tintFg(output, FgColor.BRIGHT_GREEN);
        }
        case "Three of a kind": {
            return tintFg(output, FgColor.GREEN);
        }
        case "Two pair": {
            return tintFg(output, FgColor.BRIGHT_YELLOW);
        }
        case "One pair": {
            return tintFg(output, FgColor.YELLOW);
        }
        default: {
            return tintFg(output, FgColor.BRIGHT_WHITE);
        }

    }
}

export function handLogger(hand: Hand, index: number) {
    const rank: string = tintFg((index + 1 + "").padStart(4, " "), FgColor.GRAY);
    const bid: string = tintFg(hand.bid.toString().padStart(3, " "), FgColor.GRAY);
    const labels: string = hand.cards.map(c => tintFg(c.label, c.label === "J" ? FgColor.BRIGHT_MAGENTA : FgColor.BLUE)).join("");
    const type: string = rankTinter(hand.rank);
    const value: string = tintBg(">>> " + (hand.bid * (index + 1)).toString().padStart(6, " "), BgColor.GRAY);
    const message: string = `${rank} ${tintFg("*", FgColor.GRAY)} ${bid} ${value}  ${labels} ${type}`;
    new ColoredLogger().logTinted(message);
}
